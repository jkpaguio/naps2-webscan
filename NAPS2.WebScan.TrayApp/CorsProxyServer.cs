using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace NAPS2.WebScan.TrayApp
{
    /// <summary>
    /// CORS Proxy Server with Private Network Access support
    /// Handles preflight requests correctly for HTTPS → localhost access
    /// </summary>
    public class CorsProxyServer
    {
        private HttpListener? listener;
        private readonly int proxyPort;
        private readonly int targetPort;
        private bool isRunning = false;

        public bool IsRunning => isRunning;
        public int ProxyPort => proxyPort;
        public int TargetPort => targetPort;

        public CorsProxyServer(int proxyPort = 9802, int targetPort = 9801)
        {
            this.proxyPort = proxyPort;
            this.targetPort = targetPort;
        }

        public async Task StartAsync()
        {
            if (isRunning)
                return;

            try
            {
                listener = new HttpListener();
                listener.Prefixes.Add($"http://localhost:{proxyPort}/");
                listener.Prefixes.Add($"http://127.0.0.1:{proxyPort}/");
                listener.Start();
                isRunning = true;

                Log($"CORS Proxy started on port {proxyPort}, forwarding to {targetPort}");

                while (isRunning)
                {
                    try
                    {
                        var context = await listener.GetContextAsync();
                        _ = Task.Run(() => HandleRequestAsync(context));
                    }
                    catch (HttpListenerException)
                    {
                        // Listener stopped
                        break;
                    }
                    catch (Exception ex)
                    {
                        Log($"Listener error: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Log($"Proxy startup error: {ex.Message}");
                throw;
            }
        }

        private async Task HandleRequestAsync(HttpListenerContext context)
        {
            var request = context.Request;
            var response = context.Response;

            try
            {
                var origin = request.Headers["Origin"] ?? "unknown";
                var method = request.HttpMethod;
                var path = request.Url?.PathAndQuery ?? "/";

                Log($"Request: {method} {path} from {origin}");

                // CRITICAL: Handle OPTIONS preflight FIRST
                if (method == "OPTIONS")
                {
                    Log("  -> Handling preflight (OPTIONS)");
                    
                    // Check if this is a Private Network Access preflight
                    var requestPrivateNetwork = request.Headers["Access-Control-Request-Private-Network"];
                    if (!string.IsNullOrEmpty(requestPrivateNetwork))
                    {
                        Log($"  -> Private Network Access request detected: {requestPrivateNetwork}");
                    }
                    
                    // Set all CORS headers for preflight
                    response.Headers.Set("Access-Control-Allow-Origin", "*");
                    response.Headers.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
                    response.Headers.Set("Access-Control-Allow-Headers", "*");
                    
                    // CRITICAL: Private Network Access header - MUST be present for HTTPS->localhost
                    response.Headers.Set("Access-Control-Allow-Private-Network", "true");
                    
                    response.Headers.Set("Access-Control-Max-Age", "86400");
                    response.Headers.Set("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
                    
                    response.StatusCode = 204; // No Content
                    response.ContentLength64 = 0;
                    
                    Log($"  <- Preflight response: 204 (PNA allowed)");
                    response.Close();
                    return;
                }

                // Forward actual request to scanner service
                var targetUrl = $"http://localhost:{targetPort}{path}";
                Log($"  -> Forwarding to {targetUrl}");

                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(30);
                
                var proxyRequest = new HttpRequestMessage(new HttpMethod(method), targetUrl);

                // Copy headers (skip Host, Connection, and CORS-related)
                foreach (var headerKey in request.Headers.AllKeys)
                {
                    if (headerKey != null && 
                        !headerKey.Equals("Host", StringComparison.OrdinalIgnoreCase) &&
                        !headerKey.Equals("Connection", StringComparison.OrdinalIgnoreCase) &&
                        !headerKey.StartsWith("Access-Control", StringComparison.OrdinalIgnoreCase) &&
                        !headerKey.Equals("Origin", StringComparison.OrdinalIgnoreCase))
                    {
                        var headerValue = request.Headers[headerKey];
                        if (headerValue != null)
                        {
                            try
                            {
                                proxyRequest.Headers.TryAddWithoutValidation(headerKey, headerValue);
                            }
                            catch { }
                        }
                    }
                }

                // Copy request body for POST/PUT
                if (request.HasEntityBody && (method == "POST" || method == "PUT"))
                {
                    using var reader = new StreamReader(request.InputStream, request.ContentEncoding);
                    var body = await reader.ReadToEndAsync();
                    proxyRequest.Content = new StringContent(body, request.ContentEncoding, request.ContentType ?? "application/xml");
                    Log($"  -> Request body: {body.Length} bytes");
                }

                // Send request to scanner
                var scannerResponse = await client.SendAsync(proxyRequest);
                
                Log($"  <- Scanner response: {(int)scannerResponse.StatusCode}");

                // Copy response status
                response.StatusCode = (int)scannerResponse.StatusCode;
                response.StatusDescription = scannerResponse.ReasonPhrase ?? "";

                // Set CORS headers FIRST (before copying scanner headers)
                response.Headers.Set("Access-Control-Allow-Origin", "*");
                response.Headers.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
                response.Headers.Set("Access-Control-Allow-Headers", "*");
                response.Headers.Set("Access-Control-Allow-Private-Network", "true");
                response.Headers.Set("Access-Control-Expose-Headers", "*");

                // Copy scanner response headers (non-CORS)
                foreach (var header in scannerResponse.Headers)
                {
                    if (!header.Key.StartsWith("Access-Control", StringComparison.OrdinalIgnoreCase))
                    {
                        try
                        {
                            response.Headers.Add(header.Key, string.Join(", ", header.Value));
                        }
                        catch { }
                    }
                }

                // Copy content headers
                foreach (var header in scannerResponse.Content.Headers)
                {
                    try
                    {
                        if (header.Key.Equals("Content-Type", StringComparison.OrdinalIgnoreCase))
                        {
                            response.ContentType = string.Join(", ", header.Value);
                        }
                        else if (header.Key.Equals("Content-Length", StringComparison.OrdinalIgnoreCase))
                        {
                            // Will be set when we write the body
                        }
                        else
                        {
                            response.Headers.Add(header.Key, string.Join(", ", header.Value));
                        }
                    }
                    catch { }
                }

                // Copy response body
                var responseBody = await scannerResponse.Content.ReadAsByteArrayAsync();
                response.ContentLength64 = responseBody.Length;
                
                if (responseBody.Length > 0)
                {
                    await response.OutputStream.WriteAsync(responseBody, 0, responseBody.Length);
                    Log($"  <- Response body: {responseBody.Length} bytes");
                }
                
                response.Close();
                Log($"  <- Complete");
            }
            catch (Exception ex)
            {
                Log($"ERROR: {ex.Message}");
                Log($"  Stack: {ex.StackTrace}");
                
                try
                {
                    // Add CORS headers even to error responses
                    response.Headers.Set("Access-Control-Allow-Origin", "*");
                    response.Headers.Set("Access-Control-Allow-Private-Network", "true");
                    
                    response.StatusCode = 500;
                    var error = Encoding.UTF8.GetBytes($"Proxy error: {ex.Message}");
                    response.ContentLength64 = error.Length;
                    response.OutputStream.Write(error, 0, error.Length);
                    response.Close();
                }
                catch { }
            }
        }

        public void Stop()
        {
            Log("Stopping CORS Proxy...");
            isRunning = false;
            listener?.Stop();
            listener?.Close();
            listener = null;
        }

        private void Log(string message)
        {
            var timestamp = DateTime.Now.ToString("HH:mm:ss.fff");
            Console.WriteLine($"[{timestamp}] [Proxy:{proxyPort}] {message}");
            
            // Also log to file
            try
            {
                string logPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                    "ITBSWebScan",
                    "proxy.log");

                Directory.CreateDirectory(Path.GetDirectoryName(logPath) ?? "");
                File.AppendAllText(logPath, $"[{timestamp}] {message}\n");
            }
            catch { }
        }
    }
}