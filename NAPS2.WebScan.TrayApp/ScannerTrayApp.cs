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

namespace NAPS2.WebScan.TrayApp
{
    public class ScannerTrayApp : ApplicationContext
    {
        private NotifyIcon trayIcon;
        private ContextMenuStrip trayMenu;
        private ScanServer? scanServer;
        private CancellationTokenSource? cancellationTokenSource;
        private bool isRunning = false;
        private string scannerName = "No scanner detected";

        // Auto-start constants
        private const string APP_NAME = "ITBSWebScan";
        private const string REGISTRY_KEY = @"Software\Microsoft\Windows\CurrentVersion\Run";

        public ScannerTrayApp()
        {
            // Create context menu
            trayMenu = new ContextMenuStrip();
            trayMenu.Items.Add("Scanner Status: Initializing...", null, OnStatusClick).Enabled = false;
            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("Start Service", null, OnStartClick);
            trayMenu.Items.Add("Stop Service", null, OnStopClick);
            trayMenu.Items.Add(new ToolStripSeparator());
            
            // Add auto-start option with checkmark
            var autoStartItem = new ToolStripMenuItem("Start with Windows", null, OnAutoStartClick);
            autoStartItem.Checked = IsAutoStartEnabled();
            trayMenu.Items.Add(autoStartItem);
            
            trayMenu.Items.Add(new ToolStripSeparator());
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

            trayIcon.DoubleClick += OnTrayIconDoubleClick;

            // Enable auto-start by default on first run
            if (!IsAutoStartEnabled())
            {
                SetAutoStart(true);
            }

            // Start the scanner service automatically
            _ = StartScannerServiceAsync();
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

                await Task.Run(async () =>
                {
                    using var scanningContext = new ScanningContext(new ImageSharpImageContext());
                    var controller = new ScanController(scanningContext);

                    scanServer = new ScanServer(scanningContext, new EsclServer
                    {
                        SecurityPolicy = EsclSecurityPolicy.ServerAllowAnyOrigin
                    });

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
                        return;
                    }

                    var port = 9801;
                    scanServer.RegisterDevice(firstDevice, port: port);
                    await scanServer.Start();

                    isRunning = true;
                    UpdateStatus($"Running on port {port}", true);
                    ShowBalloonTip("Scanner Ready", $"Scanner: {scannerName}\nPort: {port}", ToolTipIcon.Info);

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
                            // Ensure proper quoting and registry value type for paths with spaces
                            key.SetValue(APP_NAME, $"\"{exePath}\"", RegistryValueKind.String);
                            ShowBalloonTip("Auto-Start Enabled", "Application will start automatically on login", ToolTipIcon.Info);
                        }
                        else
                        {
                            key.DeleteValue(APP_NAME, false);
                            ShowBalloonTip("Auto-Start Disabled", "Application will no longer start automatically", ToolTipIcon.Info);
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

        private void OnAutoStartClick(object? sender, EventArgs e)
        {
            bool currentState = IsAutoStartEnabled();
            SetAutoStart(!currentState);
            
            // Update menu checkmark
            if (sender is ToolStripMenuItem menuItem)
            {
                menuItem.Checked = !currentState;
            }
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

        private void OnOpenStatusClick(object? sender, EventArgs e)
        {
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = "http://localhost:9801/eSCL/ScannerStatus",
                UseShellExecute = true
            });
        }

        private void OnAboutClick(object? sender, EventArgs e)
        {
            MessageBox.Show(
                $"ITBS WebScan System Tray Application\n\n" +
                $"Version: 1.0.0\n" +
                $"Scanner: {scannerName}\n" +
                $"Port: 9801\n" +
                $"Auto-Start: {(IsAutoStartEnabled() ? "Enabled" : "Disabled")}\n\n" +
                $"Provides web-based document scanning for local applications.",
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

        private void OnTrayIconDoubleClick(object? sender, EventArgs e)
        {
            MessageBox.Show(
                $"ITBS WebScan is running\n\n" +
                $"Scanner: {scannerName}\n" +
                $"Status: {(isRunning ? "Running" : "Stopped")}\n" +
                $"Port: 9801\n" +
                $"Auto-Start: {(IsAutoStartEnabled() ? "Enabled" : "Disabled")}\n\n" +
                $"Right-click the icon for options.",
                "ITBS WebScan",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                trayIcon?.Dispose();
                trayMenu?.Dispose();
                scanServer?.Dispose();
                cancellationTokenSource?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}