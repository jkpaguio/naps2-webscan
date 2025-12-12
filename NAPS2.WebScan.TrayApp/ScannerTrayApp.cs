using System;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Win32;
using NAPS2.Escl;
using NAPS2.Escl.Server;
using NAPS2.Images.ImageSharp;
using NAPS2.Remoting.Server;
using NAPS2.Scan;
using System.IO;
using System.Linq;

namespace NAPS2.WebScan.TrayApp
{
    public class ScannerTrayApp : ApplicationContext
    {
        private NotifyIcon trayIcon;
        private ContextMenuStrip trayMenu;
        private ScanServer? scanServer;
        private CorsProxyServer? corsProxy;
        private CancellationTokenSource? cancellationTokenSource;
        private bool isRunning = false;
        private string scannerName = "No scanner detected";
        private string preferredScanSource = "Auto-detect";
        private int serverPort = 9801; // Scanner service port
        private int proxyPort = 9802;  // CORS proxy port (this is what your website should use)
        private string currentStatus = "Initializing...";

        // Auto-start constants
        private const string APP_NAME = "ITBSWebScan";
        private const string REGISTRY_KEY = @"Software\Microsoft\Windows\CurrentVersion\Run";

        public ScannerTrayApp()
        {
            // Load saved settings
            LoadSettings();

            // Create context menu
            trayMenu = new ContextMenuStrip();
            trayMenu.Items.Add("Status: Initializing...", null, OnStatusClick).Enabled = false;
            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("Start Service", null, OnStartClick);
            trayMenu.Items.Add("Stop Service", null, OnStopClick);
            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("Settings...", null, OnSettingsClick);
            trayMenu.Items.Add("Open Scanner Status", null, OnOpenStatusClick);
            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("About", null, OnAboutClick);
            trayMenu.Items.Add("Exit", null, OnExitClick);

            // Create tray icon with fallback
            trayIcon = new NotifyIcon()
            {
                Icon = LoadIcon(),
                ContextMenuStrip = trayMenu,
                Visible = true,
                Text = "ITBS WebScan - Initializing..."
            };

            // Single click opens settings, right-click shows menu
            trayIcon.Click += OnTrayIconClick;

            // Enable auto-start by default on first run
            if (!IsAutoStartEnabled())
            {
                SetAutoStart(true);
            }

            // Start the scanner service automatically
            _ = StartScannerServiceAsync();
        }

        private void LoadSettings()
        {
            try
            {
                // Load settings from registry or config file
                using (RegistryKey? key = Registry.CurrentUser.OpenSubKey(@"Software\ITBSWebScan", false))
                {
                    if (key != null)
                    {
                        preferredScanSource = key.GetValue("ScanSource", "Auto-detect")?.ToString() ?? "Auto-detect";
                        serverPort = Convert.ToInt32(key.GetValue("Port", 9801));
                        proxyPort = Convert.ToInt32(key.GetValue("ProxyPort", 9802));
                    }
                }
            }
            catch { }
        }

        private void SaveSettings()
        {
            try
            {
                using (RegistryKey? key = Registry.CurrentUser.CreateSubKey(@"Software\ITBSWebScan"))
                {
                    if (key != null)
                    {
                        key.SetValue("ScanSource", preferredScanSource);
                        key.SetValue("Port", serverPort);
                        key.SetValue("ProxyPort", proxyPort);
                    }
                }
            }
            catch { }
        }

        private Icon LoadIcon()
        {
            try
            {
                // Always use full path from application directory
                string appDir = AppDomain.CurrentDomain.BaseDirectory;
                string iconPath = Path.Combine(appDir, "logo.ico");
                
                if (File.Exists(iconPath))
                {
                    return new Icon(iconPath);
                }
                
                // Fallback to system icon if logo.ico not found
                return SystemIcons.Application;
            }
            catch
            {
                // If all else fails, use system icon
                return SystemIcons.Application;
            }
        }

        private async Task StartScannerServiceAsync()
        {
            if (isRunning)
            {
                ShowBalloonTip("Already Running", "Scanner service is already running", ToolTipIcon.Info);
                return;
            }

            try
            {
                UpdateStatus("Starting...", false);
                
                cancellationTokenSource = new CancellationTokenSource();
                var token = cancellationTokenSource.Token;

                // Start CORS proxy first
                corsProxy = new CorsProxyServer(proxyPort, serverPort);
                var proxyTask = Task.Run(() => corsProxy.StartAsync(), token);

                await Task.Run(async () =>
                {
                    using var scanningContext = new ScanningContext(new ImageSharpImageContext());
                    var controller = new ScanController(scanningContext);

                    // Create scanner server (no CORS modifications needed)
                    scanServer = new ScanServer(scanningContext, new EsclServer());

                    // Find scanner
                    ScanDevice? firstDevice = null;
                    var driversToTry = new[] { Driver.Wia, Driver.Twain, Driver.Escl };

                    foreach (var driver in driversToTry)
                    {
                        try
                        {
                            var devices = await controller.GetDeviceList(driver);
                            firstDevice = devices.FirstOrDefault();

                            if (firstDevice != null)
                            {
                                scannerName = firstDevice.Name;
                                break;
                            }
                        }
                        catch { }
                    }

                    if (firstDevice == null)
                    {
                        UpdateStatus("No scanner found", false);
                        ShowBalloonTip("No Scanner", "Please connect a scanner and restart", ToolTipIcon.Warning);
                        corsProxy?.Stop();
                        return;
                    }

                    scanServer.RegisterDevice(firstDevice, port: serverPort);
                    await scanServer.Start();

                    isRunning = true;
                    UpdateStatus($"Running (Proxy: {proxyPort})", true);
                    ShowBalloonTip("Scanner Ready", 
                        $"Scanner: {scannerName}\n" +
                        $"Scanner Port: {serverPort}\n" +
                        $"Web Access Port: {proxyPort} (Use this!)\n" +
                        $"Source: {preferredScanSource}", 
                        ToolTipIcon.Info);

                    // Keep running until cancelled
                    await Task.Delay(Timeout.Infinite, token);
                }, token);
            }
            catch (TaskCanceledException)
            {
                // Service stopped normally
            }
            catch (Exception ex)
            {
                UpdateStatus("Error: " + ex.Message, false);
                ShowBalloonTip("Error", "Failed to start scanner service", ToolTipIcon.Error);
                MessageBox.Show($"Error starting scanner service:\n\n{ex.Message}", 
                    "ITBS WebScan Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async Task StopScannerServiceAsync()
        {
            if (!isRunning)
            {
                ShowBalloonTip("Not Running", "Scanner service is not running", ToolTipIcon.Info);
                return;
            }

            try
            {
                UpdateStatus("Stopping...", false);
                
                cancellationTokenSource?.Cancel();
                
                // Stop proxy first
                corsProxy?.Stop();
                corsProxy = null;
                
                if (scanServer != null)
                {
                    await scanServer.Stop();
                    scanServer.Dispose();
                    scanServer = null;
                }

                isRunning = false;
                UpdateStatus("Stopped", false);
                ShowBalloonTip("Service Stopped", "Scanner service has been stopped", ToolTipIcon.Info);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error stopping scanner service:\n\n{ex.Message}",
                    "ITBS WebScan Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void UpdateStatus(string status, bool running)
        {
            currentStatus = status;
            
            if (trayIcon.ContextMenuStrip?.Items[0] != null)
            {
                trayIcon.ContextMenuStrip.Items[0].Text = $"Status: {status}";
                trayIcon.Text = $"ITBS WebScan - {status}";
                
                // Update icon (will use system icon if logo.ico is missing)
                trayIcon.Icon = LoadIcon();

                // Enable/disable start/stop buttons
                if (trayIcon.ContextMenuStrip.Items[2] is ToolStripMenuItem startItem)
                    startItem.Enabled = !running;
                if (trayIcon.ContextMenuStrip.Items[3] is ToolStripMenuItem stopItem)
                    stopItem.Enabled = running;
            }
        }

        private void ShowBalloonTip(string title, string text, ToolTipIcon icon)
        {
            trayIcon.ShowBalloonTip(3000, title, text, icon);
        }

        // Auto-start functionality
        private void SetAutoStart(bool enable)
        {
            try
            {
                using (RegistryKey? key = Registry.CurrentUser.OpenSubKey(REGISTRY_KEY, true))
                {
                    if (key != null)
                    {
                        if (enable)
                        {
                            string exePath = Application.ExecutablePath;
                            key.SetValue(APP_NAME, $"\"{exePath}\"", RegistryValueKind.String);
                        }
                        else
                        {
                            key.DeleteValue(APP_NAME, false);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error setting auto-start:\n\n{ex.Message}", 
                    "ITBS WebScan", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private bool IsAutoStartEnabled()
        {
            try
            {
                using (RegistryKey? key = Registry.CurrentUser.OpenSubKey(REGISTRY_KEY, false))
                {
                    if (key != null)
                    {
                        object? value = key.GetValue(APP_NAME);
                        return value != null;
                    }
                }
            }
            catch { }
            return false;
        }

        private void OnStatusClick(object? sender, EventArgs e)
        {
            // Status item (disabled)
        }

        private async void OnStartClick(object? sender, EventArgs e)
        {
            await StartScannerServiceAsync();
        }

        private async void OnStopClick(object? sender, EventArgs e)
        {
            await StopScannerServiceAsync();
        }

        private void OnSettingsClick(object? sender, EventArgs e)
        {
            OpenSettings();
        }

        private void OpenSettings()
        {
            using (var settingsForm = new SettingsForm(
                scannerName, 
                preferredScanSource,
                IsAutoStartEnabled(),
                isRunning,
                proxyPort, // Show proxy port in settings
                currentStatus))
            {
                if (settingsForm.ShowDialog() == DialogResult.OK && settingsForm.SettingsSaved)
                {
                    // Update settings
                    preferredScanSource = settingsForm.SelectedScanSource;

                    // Update auto-start
                    if (IsAutoStartEnabled() != settingsForm.AutoStartEnabled)
                    {
                        SetAutoStart(settingsForm.AutoStartEnabled);
                    }

                    // Save settings
                    SaveSettings();

                    ShowBalloonTip("Settings Saved", 
                        $"Scan Source: {preferredScanSource}", 
                        ToolTipIcon.Info);
                }
            }
        }

        private void OnOpenStatusClick(object? sender, EventArgs e)
        {
            try
            {
                // Open the proxy URL (this is what has CORS headers)
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = $"http://localhost:{proxyPort}/eSCL/ScannerStatus",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error opening browser:\n\n{ex.Message}",
                    "ITBS WebScan Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void OnAboutClick(object? sender, EventArgs e)
        {
            MessageBox.Show(
                $"ITBS WebScan System Tray Application\n\n" +
                $"Version: 1.3.0 (CORS Proxy)\n" +
                $"Scanner: {scannerName}\n" +
                $"Scanner Port: {serverPort}\n" +
                $"Web Access Port: {proxyPort} ⭐ Use this port from your website!\n" +
                $"Scan Source: {preferredScanSource}\n" +
                $"Auto-Start: {(IsAutoStartEnabled() ? "Enabled" : "Disabled")}\n\n" +
                $"The proxy adds CORS headers automatically.\n" +
                $"Update your website to use: http://localhost:{proxyPort}",
                "About ITBS WebScan",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }

        private async void OnExitClick(object? sender, EventArgs e)
        {
            if (isRunning)
            {
                var result = MessageBox.Show(
                    "The scanner service is currently running. Are you sure you want to exit?",
                    "ITBS WebScan",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Question);

                if (result == DialogResult.No)
                    return;

                await StopScannerServiceAsync();
            }

            trayIcon.Visible = false;
            Application.Exit();
        }

        private void OnTrayIconClick(object? sender, EventArgs e)
        {
            // Check if it's a left click (not right-click for context menu)
            if (e is MouseEventArgs mouseEvent && mouseEvent.Button == MouseButtons.Left)
            {
                OpenSettings();
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                trayIcon?.Dispose();
                trayMenu?.Dispose();
                scanServer?.Dispose();
                corsProxy?.Stop();
                cancellationTokenSource?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}