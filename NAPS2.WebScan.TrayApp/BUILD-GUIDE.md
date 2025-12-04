# ITBS WebScan - Complete Build Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Understanding the Paths](#understanding-the-paths)
4. [Building the Application](#building-the-application)
5. [Creating the Installer](#creating-the-installer)
6. [Testing](#testing)
7. [Distribution](#distribution)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **.NET SDK** (version 10.0 or higher)
   - Download: https://dotnet.microsoft.com/download
   - Check if installed: Open Command Prompt and type `dotnet --version`
   - Should show: `10.0.x` or higher

2. **Visual Studio 2022** (Recommended) OR **Visual Studio Code**
   - Visual Studio 2022 Community (Free): https://visualstudio.microsoft.com/downloads/
   - During installation, select:
     - ✅ .NET desktop development
     - ✅ Desktop development with C++

3. **Inno Setup** (for creating installer)
   - Download: https://jrsoftware.org/isdl.php
   - Install the default settings

4. **Git** (Optional, for version control)
   - Download: https://git-scm.com/downloads

### Required Files
- `ScannerTrayApp.cs` (main application logic)
- `Program.cs` (application entry point)
- `logo.ico` (application icon - **CRITICAL!**)
- `.csproj` file (project configuration)
- `ITBSWebScan.iss` (installer script)

---

## Project Structure

Your project is organized like this:

```
D:\PROJECTS\BPLS\naps2-webscan\
│
├── NAPS2.WebScan.TrayApp\              ← Main project folder
│   ├── ScannerTrayApp.cs               ← Main application code
│   ├── Program.cs                       ← Application entry point
│   ├── logo.ico                         ← Application icon (REQUIRED!)
│   ├── NAPS2.WebScan.TrayApp.csproj    ← Project configuration
│   │
│   ├── bin\                             ← Build outputs (created automatically)
│   │   ├── Debug\                       ← Debug builds
│   │   │   └── net10.0-windows\
│   │   └── Release\                     ← Release builds (for distribution)
│   │       └── net10.0-windows\         ← Your compiled application is HERE
│   │           ├── NAPS2.WebScan.TrayApp.exe  ← The main executable
│   │           ├── logo.ico             ← Icon file (must be copied here)
│   │           ├── NAPS2.Escl.dll       ← Required libraries
│   │           ├── NAPS2.Sdk.dll
│   │           └── (other DLL files)
│   │
│   └── obj\                             ← Temporary build files (ignore this)
│
├── ITBSWebScan.iss                      ← Installer script (place in root)
│
└── installer\                           ← Installer output (created automatically)
    └── ITBSWebScan-Setup.exe            ← Your final installer!
```

### Path Breakdown

| Path | What It Is | When It's Created |
|------|-----------|-------------------|
| `D:\PROJECTS\BPLS\naps2-webscan\` | **Root folder** - Your main project directory | You create this |
| `NAPS2.WebScan.TrayApp\` | **Project folder** - Contains source code | You create this |
| `bin\Release\net10.0-windows\` | **Build output** - Where compiled app goes | Created when you build |
| `installer\` | **Installer output** - Where setup.exe is created | Created by Inno Setup |

---

## Understanding the Paths

### 1. Source Code Location
```
D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\
```
- This is where you edit your `.cs` files
- This is where `logo.ico` should be placed
- This is where you run build commands

### 2. Build Output Location
```
D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\Release\net10.0-windows\
```
- This is where your compiled `.exe` appears after building
- All DLL dependencies are copied here automatically
- **You must copy `logo.ico` here manually** (or configure project to do it)
- This is the folder you'll distribute (or create installer from)

### 3. Installer Script Location
```
D:\PROJECTS\BPLS\naps2-webscan\ITBSWebScan.iss
```
- Place this file in the root project folder
- It points to the build output folder
- It creates the installer in the `installer\` subfolder

### 4. Final Installer Location
```
D:\PROJECTS\BPLS\naps2-webscan\installer\ITBSWebScan-Setup.exe
```
- This is your distributable installer
- Share this file with users
- It contains everything needed to install the app

---

## Building the Application

### Method 1: Using Visual Studio (Easiest)

#### Step 1: Open the Project
1. Navigate to: `D:\PROJECTS\BPLS\naps2-webscan\`
2. Find your solution file (`.sln`) or project file (`.csproj`)
3. Double-click to open in Visual Studio

#### Step 2: Replace Code Files
1. In Visual Studio's **Solution Explorer**, find:
   - `ScannerTrayApp.cs`
   - `Program.cs`
2. Right-click each → Delete (or keep as backup)
3. Right-click project → **Add** → **Existing Item**
4. Select the new `ScannerTrayApp.cs` and `Program.cs` files

#### Step 3: Ensure Icon is Included
1. Make sure `logo.ico` is in your project folder
2. Right-click `logo.ico` in Solution Explorer
3. Select **Properties**
4. Set **Copy to Output Directory** → **Copy always**
   
   If `logo.ico` isn't in your project:
   - Right-click project → **Add** → **Existing Item**
   - Browse to `logo.ico` and add it
   - Then set the copy property as above

#### Step 4: Build Release Version
1. At the top of Visual Studio, change **Debug** to **Release**
2. Click **Build** menu → **Rebuild Solution**
   - Or press `Ctrl + Shift + B`
3. Check the **Output** window for success message
4. Your exe is now in: `bin\Release\net10.0-windows\`

#### Step 5: Verify Build Output
1. Open File Explorer
2. Navigate to: `D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\Release\net10.0-windows\`
3. You should see:
   - ✅ `NAPS2.WebScan.TrayApp.exe`
   - ✅ `logo.ico` (CRITICAL - must be here!)
   - ✅ All `.dll` files
   - ✅ `runtimes\` folder (if exists)

### Method 2: Using Command Line

#### Step 1: Open Command Prompt
1. Press `Win + R`
2. Type `cmd` and press Enter

#### Step 2: Navigate to Project Folder
```batch
cd D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp
```

#### Step 3: Clean Previous Builds (Optional)
```batch
dotnet clean
```

#### Step 4: Build Release Version
```batch
dotnet build --configuration Release
```

Or for a complete rebuild:
```batch
dotnet build --configuration Release --no-incremental
```

#### Step 5: Verify Output
```batch
dir bin\Release\net10.0-windows
```

You should see your `.exe` and all dependencies.

#### Step 6: Copy Icon File (if not automatic)
```batch
copy logo.ico bin\Release\net10.0-windows\logo.ico
```

### Method 3: Using Visual Studio Code

#### Step 1: Open Folder
1. Open VS Code
2. **File** → **Open Folder**
3. Select: `D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp`

#### Step 2: Open Terminal
1. **Terminal** → **New Terminal**
2. Verify you're in the project folder: `pwd` (should show the project path)

#### Step 3: Build
```bash
dotnet build --configuration Release
```

#### Step 4: Verify Output
```bash
ls bin/Release/net10.0-windows
```

---

## Creating the Installer

### Step 1: Place Installer Script
1. Copy `ITBSWebScan.iss` to: `D:\PROJECTS\BPLS\naps2-webscan\`
   - **Important**: NOT in the `NAPS2.WebScan.TrayApp\` subfolder
   - Place it in the root: `D:\PROJECTS\BPLS\naps2-webscan\`

### Step 2: Verify Paths in Script
1. Open `ITBSWebScan.iss` in Notepad
2. Check this line matches your build output:
   ```ini
   Source: "D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\Release\net10.0-windows\*";
   ```
3. Check this line matches where you want the installer:
   ```ini
   OutputDir=D:\PROJECTS\BPLS\naps2-webscan\installer
   ```

### Step 3: Build Installer

#### Using Inno Setup GUI:
1. Right-click `ITBSWebScan.iss`
2. Select **Compile**
   - Or open it in Inno Setup and click **Build** → **Compile**

#### Using Command Line:
```batch
cd D:\PROJECTS\BPLS\naps2-webscan
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" ITBSWebScan.iss
```

### Step 4: Find Your Installer
1. Navigate to: `D:\PROJECTS\BPLS\naps2-webscan\installer\`
2. You should see: `ITBSWebScan-Setup.exe`
3. This is your final distributable installer!

---

## Testing

### Test the Built Application (Before Creating Installer)

1. **Navigate to build output**:
   ```
   D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\Release\net10.0-windows\
   ```

2. **Double-click** `NAPS2.WebScan.TrayApp.exe`

3. **Verify**:
   - ✅ Tray icon appears (look in system tray, bottom-right corner)
   - ✅ Tray icon shows "ITBS WebScan - ..." tooltip
   - ✅ Right-click icon → Menu shows "ITBS WebScan" branding
   - ✅ Double-click icon → Dialog shows "ITBS WebScan"
   - ✅ Scanner starts (or shows appropriate error if no scanner)

4. **Check error log** (if app doesn't start):
   ```
   %AppData%\ITBSWebScan\error.log
   ```
   - Press `Win + R`
   - Type: `%AppData%\ITBSWebScan`
   - Open `error.log` in Notepad

### Test the Installer

1. **Run the installer**:
   ```
   D:\PROJECTS\BPLS\naps2-webscan\installer\ITBSWebScan-Setup.exe
   ```

2. **During installation**:
   - ✅ Installer shows "ITBS WebScan"
   - ✅ Option to "Start with Windows" is available
   - ✅ Installation completes without errors

3. **After installation**:
   - ✅ Check Start Menu → "ITBS WebScan" appears
   - ✅ Check Programs & Features → "ITBS WebScan" is listed
   - ✅ App auto-starts (if you checked the option)
   - ✅ Files are in: `C:\Program Files\ITBS WebScan\`

4. **Test auto-start**:
   - Restart your computer
   - After login, check if tray icon appears automatically

5. **Test uninstallation**:
   - Start Menu → Right-click "ITBS WebScan" → Uninstall
   - OR Settings → Apps → ITBS WebScan → Uninstall
   - ✅ App closes automatically
   - ✅ Files are removed from Program Files
   - ✅ Start Menu entry is removed

---

## Distribution

### What to Distribute

**Option A: Portable Version (No Installer)**
- Zip the entire folder:
  ```
  D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\Release\net10.0-windows\
  ```
- Name it: `ITBSWebScan-v1.0.0-Portable.zip`
- Users extract and run `NAPS2.WebScan.TrayApp.exe`
- ⚠️ Won't appear in Programs & Features
- ⚠️ Won't auto-start unless user configures manually

**Option B: Installer (RECOMMENDED)**
- Distribute only:
  ```
  ITBSWebScan-Setup.exe
  ```
- Users run the installer
- ✅ Appears in Programs & Features
- ✅ Creates Start Menu shortcuts
- ✅ Offers auto-start during installation
- ✅ Can be properly uninstalled

### Version Numbering

Update version in `ITBSWebScan.iss`:
```ini
#define MyAppVersion "1.0.0"
```

### File Naming Convention
```
ITBSWebScan-Setup-v1.0.0.exe
ITBSWebScan-Portable-v1.0.0.zip
```

---

## Troubleshooting

### Problem: "dotnet: command not found"
**Solution**: .NET SDK is not installed or not in PATH
1. Download from: https://dotnet.microsoft.com/download
2. Install and restart Command Prompt
3. Verify: `dotnet --version`

### Problem: "The project file could not be loaded"
**Solution**: Wrong directory or missing .csproj file
1. Verify you're in: `D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\`
2. Check that `.csproj` file exists: `dir *.csproj`

### Problem: "logo.ico not found" when running app
**Solution**: Icon file is missing from output
1. Check if `logo.ico` exists in source folder
2. Copy manually: `copy logo.ico bin\Release\net10.0-windows\`
3. Or configure project to copy automatically (see Visual Studio Method)

### Problem: Build succeeds but exe doesn't work
**Solution**: Check error log
1. Try to run the exe
2. Check: `%AppData%\ITBSWebScan\error.log`
3. The log will tell you exactly what's missing or wrong

### Problem: "Could not find a part of the path" in Inno Setup
**Solution**: Paths in .iss file are incorrect
1. Open `ITBSWebScan.iss`
2. Verify the `Source:` path matches your actual build output location
3. Use absolute paths (not relative)

### Problem: Installer builds but includes wrong files
**Solution**: Clean and rebuild
1. Delete: `D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\bin\`
2. Delete: `D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp\obj\`
3. Rebuild: `dotnet build --configuration Release`
4. Recompile installer

### Problem: App doesn't auto-start after installation
**Solution**: Multiple possible causes
1. Check if "Start with Windows" was selected during installation
2. Check Registry:
   - Win + R → `regedit`
   - Go to: `HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`
   - Look for: `ITBSWebScan`
3. Check Task Manager:
   - Ctrl + Shift + Esc
   - Startup tab
   - Find "ITBS WebScan" and ensure it's Enabled
4. Check error log: `%AppData%\ITBSWebScan\error.log`

### Problem: "Access Denied" during build
**Solution**: Files are in use or insufficient permissions
1. Close the running application (check system tray)
2. Close Visual Studio
3. Open Command Prompt as Administrator
4. Rebuild

### Problem: Missing DLL errors when running
**Solution**: Dependencies not copied
1. Ensure you're running from the correct folder
2. The `.exe` must be in the same folder as all `.dll` files
3. Don't move the `.exe` alone - move the entire folder

---

## Quick Reference Commands

### Build Commands
```batch
# Navigate to project
cd D:\PROJECTS\BPLS\naps2-webscan\NAPS2.WebScan.TrayApp

# Clean build
dotnet clean

# Build Debug version
dotnet build

# Build Release version
dotnet build --configuration Release

# Complete rebuild
dotnet build --configuration Release --no-incremental

# Run the app
dotnet run

# Publish self-contained (includes .NET runtime)
dotnet publish -c Release -r win-x64 --self-contained
```

### File Operations
```batch
# Copy icon to output
copy logo.ico bin\Release\net10.0-windows\logo.ico

# List build output
dir bin\Release\net10.0-windows

# Open output folder
explorer bin\Release\net10.0-windows

# Open AppData folder
explorer %AppData%\ITBSWebScan
```

### Installer Commands
```batch
# Compile installer (adjust path if needed)
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" ITBSWebScan.iss

# Open installer output folder
explorer installer
```

---

## Build Checklist

Before distributing, verify:

### Code Checklist
- [ ] All files updated with "ITBS WebScan" branding
- [ ] Version number updated in `ITBSWebScan.iss`
- [ ] `logo.ico` exists in project folder
- [ ] `.csproj` configured to copy `logo.ico` to output

### Build Checklist
- [ ] Built in **Release** mode (not Debug)
- [ ] Build completed without errors
- [ ] Output folder contains all required files
- [ ] `logo.ico` is in the output folder
- [ ] Manual test: App runs from output folder
- [ ] Tray icon displays correctly
- [ ] All menu items work

### Installer Checklist
- [ ] `ITBSWebScan.iss` paths are correct
- [ ] Installer compiles without errors
- [ ] `ITBSWebScan-Setup.exe` created successfully
- [ ] Test installation on clean system (or VM)
- [ ] App appears in Programs & Features
- [ ] Start Menu shortcuts created
- [ ] Auto-start works (if enabled)
- [ ] Uninstallation removes all files

### Distribution Checklist
- [ ] Installer tested on at least one other computer
- [ ] README or installation instructions provided
- [ ] Version number documented
- [ ] Known issues documented (if any)

---

## Support

### Error Log Location
```
%AppData%\ITBSWebScan\error.log
```

Always check this file first when troubleshooting!

### Registry Location
```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
Key: ITBSWebScan
```

### Installation Location
```
C:\Program Files\ITBS WebScan\
```

---

## Summary

1. **Update code files** → `ScannerTrayApp.cs`, `Program.cs`
2. **Build**: `dotnet build --configuration Release`
3. **Verify output**: Check `bin\Release\net10.0-windows\`
4. **Create installer**: Compile `ITBSWebScan.iss`
5. **Test installer**: Run `ITBSWebScan-Setup.exe`
6. **Distribute**: Share the installer with users

That's it! You now have a professionally packaged Windows application.
