# NAPS2 WebScan - Quick Start Guide

## 🚀 5-Minute Setup

### For End Users (Using Pre-built App)

**Step 1:** Download `NAPS2WebScan-Setup.zip`

**Step 2:** Extract and run `setup.bat`

**Step 3:** Look for icon in system tray (near clock)

**Step 4:** Test at http://localhost:9801/eSCL/ScannerStatus

**Done!** The app auto-starts with Windows.

---

### For Developers (Building from Source)

**Prerequisites:**
- .NET 6.0+ SDK
- Scanner with drivers installed

**Build Commands:**
```powershell
# Clone
git clone https://github.com/cyanfish/naps2-webscan.git
cd naps2-webscan\NAPS2.WebScan.TrayApp

# Build
dotnet build -c Release

# Publish
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true -o C:\Published

# Run
C:\Published\NAPS2.WebScan.TrayApp.exe
```

**Done!** Application is now running in system tray.

---

## 🌐 Using in Your Web App

**Step 1:** Copy `web-scanner.js` to your project

**Step 2:** Create HTML:
```html
<button id="scan">Scan</button>
<script type="module">
  import WebScanner from './web-scanner.js';
  const scanner = new WebScanner('http://localhost:9801');
  
  document.getElementById('scan').onclick = async () => {
    const docs = await scanner.scan({ resolution: 300 });
    // Download first document
    const url = URL.createObjectURL(docs[0]);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan.pdf';
    a.click();
  };
</script>
```

**Done!** You can now scan from your web app.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| No tray icon | Start `NAPS2.WebScan.TrayApp.exe` manually |
| Service not running | Right-click icon → Start Service |
| No scanner detected | Check scanner is on, connected, drivers installed |
| CORS errors | Restart tray app |
| 503 errors | Wait longer (5-8 seconds) before getting document |

---

## 📁 Project Structure

```
naps2-webscan/
├── NAPS2.WebScan.TrayApp/        ⭐ System tray app (use this)
├── web-client/
│   ├── web-scanner.js            ⭐ JavaScript library
│   ├── demo.html                 ⭐ Demo page
│   └── server.js                 ⭐ Optional backend
└── NAPS2.WebScan.LocalService/   (Windows Service - alternative)
```

---

## ✅ Quick Checklist

**End User Installation:**
- [ ] Run setup.bat
- [ ] See tray icon
- [ ] Test http://localhost:9801/eSCL/ScannerStatus
- [ ] Try demo.html

**Developer Setup:**
- [ ] Install .NET 6.0+ SDK
- [ ] Clone repository
- [ ] Run `dotnet build`
- [ ] Run `dotnet publish`
- [ ] Test executable

**Web Integration:**
- [ ] Copy web-scanner.js
- [ ] Import in HTML
- [ ] Call scanner.scan()
- [ ] Handle returned Blob

---

## 🎯 Key URLs

- **Service Status**: http://localhost:9801/eSCL/ScannerStatus
- **NAPS2 Docs**: https://www.naps2.com/sdk
- **GitHub**: https://github.com/cyanfish/naps2-webscan

---

## 📦 What You Get

✅ System tray application  
✅ Auto-starts with Windows  
✅ Works with any scanner  
✅ JavaScript library for web apps  
✅ Demo HTML page  
✅ Optional Node.js backend  

---

**Need detailed instructions?** See `NAPS2-WebScan-Complete-Guide.md`

**Having issues?** Check the Troubleshooting section in the complete guide.
