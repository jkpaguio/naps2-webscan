using System;
using System.Drawing;
using System.Windows.Forms;

namespace NAPS2.WebScan.TrayApp
{
    public class SettingsForm : Form
    {
        private TabControl tabControl;
        private Button btnSave;
        private Button btnCancel;

        // Scanner Settings
        private ComboBox cmbScanner;
        private ComboBox cmbScanSource;
        private CheckBox chkAutoStart;
        private CheckBox chkStartMinimized;

        // Status fields
        private Label lblStatusScanner;
        private Label lblStatusPort;
        private Label lblStatusSource;
        private Label lblStatusState;

        // Labels
        private Label lblScanner;
        private Label lblScanSource;

        public string SelectedScanner { get; private set; }
        public string SelectedScanSource { get; private set; }
        public bool AutoStartEnabled { get; private set; }
        public bool StartMinimized { get; private set; }
        public bool SettingsSaved { get; private set; }

        public SettingsForm(string currentScanner, string currentSource, bool autoStart, 
            bool isRunning, int port, string status)
        {
            InitializeComponents();
            LoadCurrentSettings(currentScanner, currentSource, autoStart);
            UpdateStatusDisplay(isRunning, port, currentScanner, currentSource, status);
        }

        private void InitializeComponents()
        {
            // Form settings
            this.Text = "ITBS WebScan - Settings";
            this.Size = new Size(500, 400);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.ShowInTaskbar = false;

            // Tab Control
            tabControl = new TabControl
            {
                Location = new Point(10, 10),
                Size = new Size(464, 300)
            };

            // Status Tab (First)
            var statusTab = new TabPage("Status");
            InitializeStatusTab(statusTab);
            tabControl.TabPages.Add(statusTab);

            // Scanner Tab
            var scannerTab = new TabPage("Scanner Settings");
            InitializeScannerTab(scannerTab);
            tabControl.TabPages.Add(scannerTab);

            // Application Tab
            var appTab = new TabPage("Application");
            InitializeApplicationTab(appTab);
            tabControl.TabPages.Add(appTab);

            // Buttons
            btnSave = new Button
            {
                Text = "Save",
                Location = new Point(310, 320),
                Size = new Size(75, 30),
                DialogResult = DialogResult.OK
            };
            btnSave.Click += BtnSave_Click;

            btnCancel = new Button
            {
                Text = "Cancel",
                Location = new Point(399, 320),
                Size = new Size(75, 30),
                DialogResult = DialogResult.Cancel
            };

            // Add controls to form
            this.Controls.Add(tabControl);
            this.Controls.Add(btnSave);
            this.Controls.Add(btnCancel);

            this.AcceptButton = btnSave;
            this.CancelButton = btnCancel;
        }

        private void InitializeStatusTab(TabPage tab)
        {
            var groupBox = new GroupBox
            {
                Text = "Scanner Service Status",
                Location = new Point(20, 20),
                Size = new Size(410, 200)
            };

            // Service State
            var lblStateTitle = new Label
            {
                Text = "Service State:",
                Location = new Point(20, 30),
                Size = new Size(120, 20),
                Font = new Font(SystemFonts.DefaultFont.FontFamily, 9, FontStyle.Bold)
            };

            lblStatusState = new Label
            {
                Text = "Initializing...",
                Location = new Point(150, 30),
                Size = new Size(240, 20),
                ForeColor = Color.DarkOrange
            };

            // Scanner Name
            var lblScannerTitle = new Label
            {
                Text = "Scanner:",
                Location = new Point(20, 60),
                Size = new Size(120, 20),
                Font = new Font(SystemFonts.DefaultFont.FontFamily, 9, FontStyle.Bold)
            };

            lblStatusScanner = new Label
            {
                Text = "No scanner detected",
                Location = new Point(150, 60),
                Size = new Size(240, 40),
                AutoSize = false
            };

            // Port
            var lblPortTitle = new Label
            {
                Text = "Port:",
                Location = new Point(20, 110),
                Size = new Size(120, 20),
                Font = new Font(SystemFonts.DefaultFont.FontFamily, 9, FontStyle.Bold)
            };

            lblStatusPort = new Label
            {
                Text = "9801",
                Location = new Point(150, 110),
                Size = new Size(240, 20)
            };

            // Scan Source
            var lblSourceTitle = new Label
            {
                Text = "Scan Source:",
                Location = new Point(20, 140),
                Size = new Size(120, 20),
                Font = new Font(SystemFonts.DefaultFont.FontFamily, 9, FontStyle.Bold)
            };

            lblStatusSource = new Label
            {
                Text = "Auto-detect",
                Location = new Point(150, 140),
                Size = new Size(240, 20)
            };

            groupBox.Controls.Add(lblStateTitle);
            groupBox.Controls.Add(lblStatusState);
            groupBox.Controls.Add(lblScannerTitle);
            groupBox.Controls.Add(lblStatusScanner);
            groupBox.Controls.Add(lblPortTitle);
            groupBox.Controls.Add(lblStatusPort);
            groupBox.Controls.Add(lblSourceTitle);
            groupBox.Controls.Add(lblStatusSource);

            // Info label
            var lblInfo = new Label
            {
                Text = "The scanner service provides eSCL/AirPrint scanning at:\nhttp://localhost:9801/eSCL/",
                Location = new Point(20, 230),
                Size = new Size(410, 40),
                AutoSize = false
            };

            tab.Controls.Add(groupBox);
            tab.Controls.Add(lblInfo);
        }

        private void InitializeScannerTab(TabPage tab)
        {
            // Scanner Label
            lblScanner = new Label
            {
                Text = "Scanner Device:",
                Location = new Point(20, 25),
                Size = new Size(120, 20)
            };

            // Scanner ComboBox
            cmbScanner = new ComboBox
            {
                Location = new Point(150, 22),
                Size = new Size(280, 25),
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            cmbScanner.Items.AddRange(new object[] 
            { 
                "Auto-detect (Recommended)",
                "Manual Selection..." 
            });
            cmbScanner.SelectedIndex = 0;

            // Scan Source Label
            lblScanSource = new Label
            {
                Text = "Default Scan Source:",
                Location = new Point(20, 65),
                Size = new Size(120, 20)
            };

            // Scan Source ComboBox
            cmbScanSource = new ComboBox
            {
                Location = new Point(150, 62),
                Size = new Size(280, 25),
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            cmbScanSource.Items.AddRange(new object[]
            {
                "Flatbed (Glass)",
                "Document Feeder (ADF)",
                "Auto-detect"
            });
            cmbScanSource.SelectedIndex = 2; // Auto-detect default

            // Add controls to tab
            tab.Controls.Add(lblScanner);
            tab.Controls.Add(cmbScanner);
            tab.Controls.Add(lblScanSource);
            tab.Controls.Add(cmbScanSource);
        }

        private void InitializeApplicationTab(TabPage tab)
        {
            var groupBox = new GroupBox
            {
                Text = "Startup Options",
                Location = new Point(20, 20),
                Size = new Size(400, 120)
            };

            // Auto-start checkbox
            chkAutoStart = new CheckBox
            {
                Text = "Start with Windows",
                Location = new Point(20, 30),
                Size = new Size(350, 25),
                Checked = false
            };

            // Start minimized checkbox
            chkStartMinimized = new CheckBox
            {
                Text = "Start minimized to system tray",
                Location = new Point(20, 60),
                Size = new Size(350, 25),
                Checked = true
            };

            groupBox.Controls.Add(chkAutoStart);
            groupBox.Controls.Add(chkStartMinimized);

            // Info label
            var lblInfo = new Label
            {
                Text = "ITBS WebScan provides eSCL/AirPrint scanning services\n" +
                       "for web-based applications and local network devices.",
                Location = new Point(20, 160),
                Size = new Size(400, 60),
                AutoSize = false
            };

            tab.Controls.Add(groupBox);
            tab.Controls.Add(lblInfo);
        }

        private void LoadCurrentSettings(string scanner, string source, bool autoStart)
        {
            // Load scanner
            if (!string.IsNullOrEmpty(scanner) && scanner != "No scanner detected")
            {
                cmbScanner.Items.Insert(0, scanner);
                cmbScanner.SelectedIndex = 0;
            }

            // Load scan source
            switch (source?.ToLower())
            {
                case "flatbed":
                case "platen":
                case "flatbed (glass)":
                    cmbScanSource.SelectedIndex = 0;
                    break;
                case "feeder":
                case "adf":
                case "document feeder (adf)":
                    cmbScanSource.SelectedIndex = 1;
                    break;
                default:
                    cmbScanSource.SelectedIndex = 2; // Auto-detect
                    break;
            }

            // Load auto-start
            chkAutoStart.Checked = autoStart;
        }

        private void BtnSave_Click(object sender, EventArgs e)
        {
            // Save settings
            SelectedScanner = cmbScanner.SelectedItem?.ToString() ?? "Auto-detect";
            SelectedScanSource = cmbScanSource.SelectedItem?.ToString() ?? "Auto-detect";
            AutoStartEnabled = chkAutoStart.Checked;
            StartMinimized = chkStartMinimized.Checked;
            SettingsSaved = true;

            this.Close();
        }

        private void UpdateStatusDisplay(bool isRunning, int port, string scanner, string source, string status)
        {
            // Update service state
            if (isRunning)
            {
                lblStatusState.Text = "Running";
                lblStatusState.ForeColor = Color.Green;
            }
            else
            {
                lblStatusState.Text = status;
                lblStatusState.ForeColor = Color.DarkOrange;
            }

            // Update scanner name
            lblStatusScanner.Text = scanner ?? "No scanner detected";

            // Update port
            lblStatusPort.Text = port.ToString();

            // Update scan source
            lblStatusSource.Text = source ?? "Auto-detect";
        }
    }
}