using NAPS2.Escl;
using NAPS2.Escl.Server;
using NAPS2.Images.ImageSharp;
using NAPS2.Remoting.Server;
using NAPS2.Scan;
using NAPS2.Threading;

namespace NAPS2.WebScan.LocalService;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting NAPS2 WebScan LocalService...");
        
        using var scanningContext = new ScanningContext(new ImageSharpImageContext());
        var controller = new ScanController(scanningContext);

        // Create ESCL server with proper CORS settings
        var esclServer = new EsclServer
        {
            // This is the key setting for CORS
            SecurityPolicy = EsclSecurityPolicy.ServerAllowAnyOrigin
        };

        using var scanServer = new ScanServer(scanningContext, esclServer);

        // Find scanner device
        ScanDevice? firstDevice = null;
        var driversToTry = new[] { Driver.Wia, Driver.Twain, Driver.Escl };
        
        _logger.LogInformation("Searching for scanner devices...");
        
        while (!stoppingToken.IsCancellationRequested && firstDevice == null)
        {
            foreach (var driver in driversToTry)
            {
                try
                {
                    _logger.LogInformation($"Checking {driver} driver...");
                    var devices = await controller.GetDeviceList(driver);
                    firstDevice = devices.FirstOrDefault();
                    
                    if (firstDevice != null)
                    {
                        _logger.LogInformation($"✓ Found device: {firstDevice.Name} (using {driver} driver)");
                        break;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"Error checking {driver} driver: {ex.Message}");
                }
            }

            if (firstDevice == null)
            {
                _logger.LogWarning("No scanner devices detected. Retrying in 5 seconds...");
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }

        if (firstDevice == null)
        {
            _logger.LogError("Service stopping: No scanner device found");
            return;
        }

        // Register device on port 9801
        var port = 9801;
        
        try
        {
            scanServer.RegisterDevice(firstDevice, port: port);
            
            _logger.LogInformation("╔═══════════════════════════════════════════════════╗");
            _logger.LogInformation("║  NAPS2 WebScan Service - STARTING                ║");
            _logger.LogInformation("╚═══════════════════════════════════════════════════╝");
            
            await scanServer.Start();
            
            _logger.LogInformation("╔═══════════════════════════════════════════════════╗");
            _logger.LogInformation("║  NAPS2 WebScan Service - READY                   ║");
            _logger.LogInformation("╚═══════════════════════════════════════════════════╝");
            _logger.LogInformation($"Scanner:      {firstDevice.Name}");
            _logger.LogInformation($"Port:         {port}");
            _logger.LogInformation($"Test URL:     http://localhost:{port}/eSCL/ScannerStatus");
            _logger.LogInformation($"CORS Policy:  ServerAllowAnyOrigin");
            _logger.LogInformation("╚═══════════════════════════════════════════════════╝");
            
            // Share the device(s) until the service is stopped
            await stoppingToken.WaitHandle.WaitOneAsync();
            
            _logger.LogInformation("Shutting down scanner service...");
            await scanServer.Stop();
            _logger.LogInformation("Service stopped successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error starting scanner service: {ex.Message}");
            _logger.LogError($"Stack trace: {ex.StackTrace}");
        }
    }
}