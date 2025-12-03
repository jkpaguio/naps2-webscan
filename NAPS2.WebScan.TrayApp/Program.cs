using System;
using System.Windows.Forms;

namespace NAPS2.WebScan.TrayApp
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            
            // Run the system tray application
            Application.Run(new ScannerTrayApp());
        }
    }
}