# NAPS2 WebScan - Complete Installation & Build Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Project Structure](#project-structure)
4. [Installation Guide](#installation-guide)
5. [Building from Source](#building-from-source)
6. [Deployment](#deployment)
7. [Usage Guide](#usage-guide)
8. [Troubleshooting](#troubleshooting)
9. [Development](#development)

---

## 🎯 Overview

NAPS2 WebScan enables web-based document scanning through a system tray application. It consists of:

- **System Tray Application** - Runs in background, auto-starts with Windows
- **Web Scanner Library** - JavaScript library for web applications
- **Demo Web Application** - Example implementation
- **Backend API** - Node.js server for document upload (optional)

**Key Features:**
- ✅ Scans directly from web browsers
- ✅ System tray application (like Asprise Scan)
- ✅ Auto-starts with Windows
- ✅ Cross-browser compatible
- ✅ Works with any scanner (WIA/TWAIN/ESCL)
- ✅ No admin rights required

---

## 💻 System Requirements

### For End Users:
- **Operating System**: Windows 10 or Windows 11
- **Scanner**: Any scanner with WIA, TWAIN, or ESCL drivers
- **Scanner Connection**: USB or Network
- **Disk Space**: ~50MB
- **Network**: Localhost access required

### For Developers:
- **.NET SDK**: 6.0 or later (https://dotnet.microsoft.com/download)
- **Node.js**: 16+ (for web server examples)
- **Git**: For cloning repository
- **IDE**: Visual Studio 2022 or VS Code (recommended)
- **Scanner**: Connected and working for testing

---

## 📁 Project Structure

```
naps2-webscan/
├── NAPS2.WebScan.LocalService/      # Windows Service (original)
│   ├── Worker.cs                     # Service worker
│   ├── Program.cs                    # Entry point
│   └── NAPS2.WebScan.LocalService.csproj
│
├── NAPS2.WebScan.TrayApp/           # System Tray Application ⭐ USE THIS
│   ├── ScannerTrayApp.cs            # Main tray app logic
│   ├── Program.cs                    # Entry point
│   ├── logo.ico                      # Application icon
│   └── NAPS2.WebScan.TrayApp.csproj
│
├── NAPS2.WebScan.WebServer/         # Example web server
│   └── wwwroot/
│       └── js/site.ts                # TypeScript client code
│
└── web-client/                       # Web integration files
    ├── web-scanner.js                # JavaScript scanner library
    ├── demo.html                     # Demo web page
    ├── server.js                     # Node.js backend API
    └── package.json                  # Node dependencies
```

---

## 🚀 Installation Guide

### For End Users (Pre-built Application)

#### Step 1: Download

Download the latest release:
- **NAPS2WebScan-Setup.zip** from releases page

#### Step 2: Extract

Extract the ZIP file to a location like:
```
C:\NAPS2WebScan\
```

#### Step 3: Install

**Option A - Quick Install (Recommended):**
1. Right-click `setup.bat`
2. Select "Run as Administrator" (not always required)
3. Follow the prompts

**Option B - Manual Install:**
1. Double-click `NAPS2.WebScan.TrayApp.exe`
2. The app will start and appear in system tray
3. Right-click tray icon → "Start with Windows" to enable auto-start

#### Step 4: Verify Installation

1. Look for the NAPS2 WebScan icon in system tray (near clock)
2. Right-click icon → Check status shows "Running"
3. Open browser to: http://localhost:9801/eSCL/ScannerStatus
4. You should see XML output with scanner information

#### Step 5: Test Scanning

1. Open the included `demo.html` in a web browser
2. Click "Recheck Service" - should show "Scanner Ready"
3. Click "Scan Document" - your scanner should scan!

### Uninstallation

**If installed via setup.bat:**
```batch
# Run the uninstall script
uninstall.bat
```

**If installed manually:**
1. Right-click tray icon → "Start with Windows" to disable
2. Right-click tray icon → "Exit"
3. Delete the application folder

---

## 🔨 Building from Source

### Prerequisites

Install these first:

1. **.NET 6.0 SDK or later**
   ```powershell
   # Download from: https://dotnet.microsoft.com/download
   # Verify installation:
   dotnet --version
   ```

2. **Git** (optional, for cloning)
   ```powershell
   # Download from: https://git-scm.com
   git --version
   ```

3. **Node.js** (optional, for web server)
   ```powershell
   # Download from: https://nodejs.org
   node --version
   npm --version
   ```

### Step 1: Clone or Download the Project

```powershell
# Option A: Clone with Git
git clone https://github.com/cyanfish/naps2-webscan.git
cd naps2-webscan

# Option B: Download ZIP
# Extract to: D:\PROJECTS\BPLS\naps2-webscan
```

### Step 2: Build the System Tray Application

```powershell
# Navigate to the tray app folder
cd D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp

# Restore dependencies
dotnet restore

# Build for development
dotnet build -c Release

# Run for testing
dotnet run
```

You should see the tray icon appear!

### Step 3: Publish for Distribution

```powershell
# Publish as single-file executable with all dependencies
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o D:\Published\NAPS2WebScan

# The output will be in:
# D:\Published\NAPS2WebScan\NAPS2.WebScan.TrayApp.exe
```

**Build Options Explained:**

| Option | Purpose |
|--------|---------|
| `-c Release` | Release configuration (optimized) |
| `-r win-x64` | Target Windows 64-bit |
| `--self-contained true` | Include .NET runtime (no dependencies) |
| `/p:PublishSingleFile=true` | Single EXE file |
| `-o [path]` | Output directory |

### Step 4: Test the Published Build

```powershell
cd D:\Published\NAPS2WebScan

# Run the executable
.\NAPS2.WebScan.TrayApp.exe
```

### Step 5: Build Web Client Files

The web client files (`web-scanner.js`, `demo.html`) are ready to use as-is. No build required!

**Optional - If you want to modify the TypeScript example:**

```powershell
cd NAPS2.WebScan.WebServer

# Install dependencies
npm install

# Build TypeScript
npm run build
```

---

## 📦 Deployment

### Creating a Distribution Package

#### Step 1: Create Folder Structure

```powershell
# Create distribution folder
mkdir D:\Distribution\NAPS2WebScan
cd D:\Distribution\NAPS2WebScan
```

#### Step 2: Copy Required Files

```powershell
# Copy the main executable
copy D:\Published\NAPS2WebScan\NAPS2.WebScan.TrayApp.exe .

# Copy icon (if you have one)
copy D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\logo.ico .

# Copy web client files (optional)
mkdir web-client
copy [path-to]\web-scanner.js web-client\
copy [path-to]\demo.html web-client\
```

#### Step 3: Create Installation Scripts

**Create `setup.bat`:**

```batch
@echo off
title NAPS2 WebScan Setup
color 0A

echo.
echo  ╔════════════════════════════════════════════════╗
echo  ║     NAPS2 WebScan - Installation Wizard       ║
echo  ╚════════════════════════════════════════════════╝
echo.
echo  This will install NAPS2 WebScan on your computer.
echo.
pause

REM Create installation directory
set INSTALL_DIR=%APPDATA%\NAPS2WebScan
echo.
echo [1/4] Creating installation directory...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copy files
echo [2/4] Copying files...
xcopy /Y "NAPS2.WebScan.TrayApp.exe" "%INSTALL_DIR%\" >nul
if exist "logo.ico" xcopy /Y "logo.ico" "%INSTALL_DIR%\" >nul

REM Add to startup
echo [3/4] Configuring automatic startup...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "NAPS2WebScan" /t REG_SZ /d "\"%INSTALL_DIR%\NAPS2.WebScan.TrayApp.exe\"" /f >nul

REM Start application
echo [4/4] Starting application...
start "" "%INSTALL_DIR%\NAPS2.WebScan.TrayApp.exe"

echo.
echo  ╔════════════════════════════════════════════════╗
echo  ║          Installation Complete!                ║
echo  ╚════════════════════════════════════════════════╝
echo.
echo  Installation location: %INSTALL_DIR%
echo.
echo  The NAPS2 WebScan icon should now appear in your
echo  system tray (near the clock).
echo.
echo  Scanner URL: http://localhost:9801
echo.
pause
```

**Create `uninstall.bat`:**

```batch
@echo off
echo ========================================
echo NAPS2 WebScan - Uninstaller
echo ========================================
echo.

REM Remove from Windows startup
echo Removing from Windows startup...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "NAPS2WebScan" /f >nul 2>&1

REM Kill running process
echo Stopping application...
taskkill /F /IM "NAPS2.WebScan.TrayApp.exe" >nul 2>&1

REM Remove installation directory
set INSTALL_DIR=%APPDATA%\NAPS2WebScan
if exist "%INSTALL_DIR%" (
    echo Removing files from: %INSTALL_DIR%
    rmdir /S /Q "%INSTALL_DIR%"
)

echo.
echo ========================================
echo Uninstallation complete!
echo ========================================
echo.
pause
```

**Create `README.txt`:**

```text
╔════════════════════════════════════════════════════════════╗
║           NAPS2 WebScan - System Tray Application          ║
╚════════════════════════════════════════════════════════════╝

INSTALLATION
------------
1. Run "setup.bat" to install
2. The application will start automatically
3. Look for the icon in your system tray (near the clock)

USAGE
-----
- Right-click the system tray icon for options
- The service starts automatically when you log in
- Access scanner at: http://localhost:9801

FEATURES
--------
✓ Automatic startup with Windows
✓ System tray application (always accessible)
✓ Start/Stop service from tray menu
✓ Scanner status in tooltip
✓ Web-based document scanning

SYSTEM TRAY MENU
-----------------
- Scanner Status: Shows current status
- Start Service: Start the scanner service
- Stop Service: Stop the scanner service
- Start with Windows: Toggle auto-start
- Open Scanner Status: View scanner in browser
- About: Application information
- Exit: Close the application

REQUIREMENTS
------------
- Windows 10 or Windows 11
- Scanner with WIA/TWAIN/ESCL drivers
- Scanner connected and powered on

WEB INTEGRATION
---------------
To use scanning in your web applications:
1. Include web-scanner.js in your project
2. Create a WebScanner instance
3. Call scanner.scan() to scan documents

Example:
  import WebScanner from './web-scanner.js';
  const scanner = new WebScanner('http://localhost:9801');
  const documents = await scanner.scan({
      resolution: 300,
      colorMode: 'RGB24',
      format: 'application/pdf'
  });

See demo.html for a complete example.

UNINSTALLATION
--------------
Run "uninstall.bat" to remove the application

TROUBLESHOOTING
---------------
If the scanner is not detected:
1. Make sure scanner is powered on
2. Ensure scanner drivers are installed
3. Test scanner with Windows "Scan" app
4. Right-click tray icon → Stop Service → Start Service

For more help, right-click the tray icon and select "About"

╚════════════════════════════════════════════════════════════╝
```

#### Step 4: Create Distribution ZIP

```powershell
# Create ZIP file
Compress-Archive -Path * -DestinationPath ..\NAPS2WebScan-v1.0.zip

# Your distribution file is now:
# D:\Distribution\NAPS2WebScan-v1.0.zip
```

### Distribution Package Contents

```
NAPS2WebScan-v1.0.zip
├── NAPS2.WebScan.TrayApp.exe    (main application)
├── logo.ico                      (optional icon)
├── setup.bat                     (installer)
├── uninstall.bat                 (uninstaller)
├── README.txt                    (user guide)
└── web-client/                   (optional)
    ├── web-scanner.js
    ├── demo.html
    ├── server.js
    └── package.json
```

---

## 📖 Usage Guide

### For End Users

#### Starting the Application

**Automatic (After Installation):**
- Application starts automatically when you log in to Windows
- Look for the icon in system tray (near the clock)

**Manual Start:**
- Double-click `NAPS2.WebScan.TrayApp.exe`
- Or run from Start Menu if installed

#### System Tray Menu Options

1. **Scanner Status** - Shows current status (Running/Stopped)
2. **Start Service** - Manually start the scanner service
3. **Stop Service** - Manually stop the scanner service
4. **Start with Windows** - Toggle auto-start (✓ = enabled)
5. **Open Scanner Status** - Opens http://localhost:9801 in browser
6. **About** - View application information
7. **Exit** - Close the application

#### Verifying Scanner is Working

1. **Right-click tray icon** → "Open Scanner Status"
2. Browser should open showing XML with scanner info
3. Look for your scanner name in the XML

#### Troubleshooting

**Scanner Not Detected:**
1. Ensure scanner is powered on and connected
2. Install scanner drivers from manufacturer
3. Test with Windows "Scan" app first
4. Right-click tray icon → Stop Service → Start Service

**Service Not Starting:**
1. Check if another scanner application is running
2. Restart your computer
3. Reinstall the application

### For Developers

#### Integrating into Your Web Application

**Step 1: Copy the Library**

Copy `web-scanner.js` to your web project:
```
your-project/
├── js/
│   └── web-scanner.js    ← Copy here
└── index.html
```

**Step 2: Include in Your HTML**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Scanner App</title>
</head>
<body>
    <button id="scanBtn">Scan Document</button>
    
    <script type="module">
        import WebScanner from './js/web-scanner.js';
        
        const scanner = new WebScanner('http://localhost:9801');
        
        document.getElementById('scanBtn').addEventListener('click', async () => {
            try {
                // Check if service is available
                const available = await scanner.isServiceAvailable();
                if (!available) {
                    alert('Scanner service not running');
                    return;
                }
                
                // Scan a document
                const documents = await scanner.scan({
                    resolution: 300,
                    colorMode: 'RGB24',
                    format: 'application/pdf'
                });
                
                // Download the first document
                const blob = documents[0];
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'scan.pdf';
                link.click();
                
                alert('Scan complete!');
            } catch (error) {
                alert('Scan failed: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

**Step 3: Scan Options**

```javascript
const options = {
    resolution: 300,           // 150, 300, 600 DPI
    colorMode: 'RGB24',        // 'RGB24', 'Grayscale8', 'BlackAndWhite1'
    format: 'application/pdf', // 'application/pdf', 'image/jpeg', 'image/png'
    source: 'Platen'          // 'Platen' or 'Feeder'
};

const documents = await scanner.scan(options);
```

**Step 4: Upload to Server (Optional)**

```javascript
// Scan and upload
const documents = await scanner.scan(options);

// Upload to your server
const formData = new FormData();
formData.append('file', documents[0], 'scan.pdf');

const response = await fetch('/api/upload-scan', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log('Uploaded:', result.documentId);
```

#### API Reference

**WebScanner Methods:**

```javascript
// Check if service is running
await scanner.isServiceAvailable()  // Returns: boolean

// Get scanner capabilities
await scanner.getScannerCapabilities()  // Returns: Object

// Get scanner status
await scanner.getScannerStatus()  // Returns: Object

// Start scan job
await scanner.startScan(options)  // Returns: string (job URI)

// Get next document
await scanner.getNextDocument(jobUri)  // Returns: Blob or null

// Scan and get all documents
await scanner.scan(options)  // Returns: Array<Blob>

// Scan and download
await scanner.scanAndDownload(options, filename)  // Downloads file

// Scan and upload to server
await scanner.scanAndUpload(uploadUrl, options)  // Returns: Object
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: "Service Not Running" Error

**Symptoms:** Web page shows "Service not running" or cannot connect to localhost:9801

**Solutions:**
1. Check if tray application is running (look for icon in system tray)
2. If icon is present, right-click → "Start Service"
3. If icon is not present, start the application manually
4. Check Windows Firewall isn't blocking port 9801
5. Verify in browser: http://localhost:9801/eSCL/ScannerStatus

#### Issue 2: "No Scanner Detected"

**Symptoms:** Service running but no scanner found

**Solutions:**
1. Ensure scanner is powered on and connected via USB
2. Install scanner drivers from manufacturer's website
3. Test scanner with Windows "Scan" app (Win+S, search "Scan")
4. Try different USB port
5. Restart scanner and computer
6. Right-click tray icon → Stop Service → Start Service

#### Issue 3: CORS Errors in Browser

**Symptoms:** Browser console shows CORS policy errors

**Solutions:**
1. Verify you're accessing via `localhost` not `127.0.0.1`
2. Service should have `SecurityPolicy = EsclSecurityPolicy.ServerAllowAnyOrigin`
3. Restart the tray application
4. Clear browser cache

#### Issue 4: Scan Fails with 503 Error

**Symptoms:** Scan job starts but fails to get document

**Solutions:**
1. Wait longer - scanner may be warming up
2. Lower resolution (try 150 DPI instead of 600)
3. Ensure document is loaded on scanner
4. Check scanner isn't sleeping (wake it up)
5. Try grayscale instead of color

#### Issue 5: Application Won't Auto-Start

**Symptoms:** Application doesn't start when logging in

**Solutions:**
1. Right-click tray icon → "Start with Windows" (should be checked)
2. Check registry:
   ```powershell
   reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v NAPS2WebScan
   ```
3. Re-run setup.bat
4. Check Task Manager → Startup tab

### Logging and Diagnostics

#### Check Windows Event Viewer

```powershell
# Open Event Viewer
eventvwr

# Navigate to: Windows Logs → Application
# Look for entries from NAPS2.WebScan.TrayApp
```

#### Test Service Manually

```powershell
# Test if service is responding
curl http://localhost:9801/eSCL/ScannerStatus

# Or in PowerShell:
Invoke-WebRequest -Uri http://localhost:9801/eSCL/ScannerStatus
```

#### Browser Console

Press F12 in browser and check Console tab for errors.

---

## 🛠️ Development

### Setting Up Development Environment

```powershell
# 1. Clone repository
git clone https://github.com/cyanfish/naps2-webscan.git
cd naps2-webscan

# 2. Open in Visual Studio Code
code .

# 3. Restore dependencies
cd NAPS2.WebScan.TrayApp
dotnet restore

# 4. Run in development mode
dotnet run
```

### Project Configuration

**Worker.cs Settings:**

```csharp
// Port configuration (line ~99)
var port = 9801;  // Change if needed

// CORS policy (line ~68)
SecurityPolicy = EsclSecurityPolicy.ServerAllowAnyOrigin

// Drivers to try (line ~82)
var driversToTry = new[] { Driver.Wia, Driver.Twain, Driver.Escl };
```

### Building Debug vs Release

```powershell
# Debug build (for development)
dotnet build -c Debug
dotnet run

# Release build (for distribution)
dotnet build -c Release
```

### Adding Custom Icon

1. Create or download a `.ico` file (e.g., `logo.ico`)
2. Place in project folder: `NAPS2.WebScan.TrayApp\logo.ico`
3. Update `.csproj`:
   ```xml
   <ItemGroup>
     <Content Include="logo.ico">
       <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
     </Content>
   </ItemGroup>
   ```
4. Update `ScannerTrayApp.cs`:
   ```csharp
   Icon = new Icon("logo.ico")
   ```

### Customizing Port

**In Worker.cs (line ~99):**
```csharp
var port = 9801;  // Change to any port you want
```

**In web-scanner.js (line ~8):**
```javascript
constructor(serviceUrl = 'http://localhost:9801') {  // Update port here
```

### Testing Changes

```powershell
# 1. Make changes to code
# 2. Rebuild
dotnet build -c Release

# 3. Test run
dotnet run

# 4. Publish for testing
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o test-build

# 5. Run published version
cd test-build
.\NAPS2.WebScan.TrayApp.exe
```

---

## 📚 Additional Resources

### NAPS2 Documentation
- **Main Site**: https://www.naps2.com
- **SDK Docs**: https://www.naps2.com/sdk
- **GitHub**: https://github.com/cyanfish/naps2

### ESCL Protocol
- **Specification**: https://mopria.org/mopria-escl-specification

### Support
- **GitHub Issues**: https://github.com/cyanfish/naps2-webscan/issues
- **Stack Overflow**: Tag [naps2]

---

## 📝 Quick Reference

### Common Commands

```powershell
# Build
dotnet build -c Release

# Publish
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o output

# Run
dotnet run

# Test service
curl http://localhost:9801/eSCL/ScannerStatus

# Check registry for auto-start
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v NAPS2WebScan
```

### Default Locations

| Item | Path |
|------|------|
| Installation | `%APPDATA%\NAPS2WebScan\` |
| Registry Key | `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` |
| Service URL | `http://localhost:9801` |
| Status URL | `http://localhost:9801/eSCL/ScannerStatus` |

### File Sizes

| Build Type | Approximate Size |
|------------|------------------|
| Self-contained (includes .NET) | ~50 MB |
| Framework-dependent (requires .NET) | ~5 MB |
| Web client files | ~20 KB |

---

## ✅ Checklist

### For End Users
- [ ] Scanner is connected and powered on
- [ ] Scanner drivers are installed
- [ ] Tested scanner with Windows "Scan" app
- [ ] Downloaded NAPS2 WebScan application
- [ ] Ran setup.bat or started application manually
- [ ] Verified tray icon appears
- [ ] Checked http://localhost:9801/eSCL/ScannerStatus works
- [ ] Tested scanning with demo.html

### For Developers
- [ ] .NET 6.0+ SDK installed
- [ ] Cloned or downloaded source code
- [ ] Restored NuGet packages
- [ ] Built successfully in Debug mode
- [ ] Tested running application
- [ ] Published for Release
- [ ] Tested published executable
- [ ] Created distribution package
- [ ] Documented custom changes

---

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ System tray icon is visible
2. ✅ Right-click menu shows "Status: Running on port 9801"
3. ✅ http://localhost:9801/eSCL/ScannerStatus shows XML
4. ✅ Demo web page shows "Scanner Ready"
5. ✅ Scanning actually works and downloads PDF
6. ✅ Application restarts automatically after reboot
7. ✅ Users can toggle "Start with Windows" from menu

