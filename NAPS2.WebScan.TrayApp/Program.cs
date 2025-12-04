using System;
using System.IO;
using System.Windows.Forms;

namespace NAPS2.WebScan.TrayApp
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            // Set up error logging
            Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
            Application.ThreadException += Application_ThreadException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            try
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                
                // Run the system tray application
                Application.Run(new ScannerTrayApp());
            }
            catch (Exception ex)
            {
                LogError(ex);
                MessageBox.Show($"Fatal error starting application:\n\n{ex.Message}\n\nCheck error log in application directory.",
                    "ITBS WebScan Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void Application_ThreadException(object sender, System.Threading.ThreadExceptionEventArgs e)
        {
            LogError(e.Exception);
            MessageBox.Show($"Application error:\n\n{e.Exception.Message}\n\nCheck error log in application directory.",
                "ITBS WebScan Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }

        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            if (e.ExceptionObject is Exception ex)
            {
                LogError(ex);
            }
        }

        private static void LogError(Exception ex)
        {
            try
            {
                string logPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                    "ITBSWebScan",
                    "error.log");

                Directory.CreateDirectory(Path.GetDirectoryName(logPath));

                string logEntry = $"\n[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] ERROR:\n{ex}\n";
                File.AppendAllText(logPath, logEntry);
            }
            catch { }
        }
    }
}
