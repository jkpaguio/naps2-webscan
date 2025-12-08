# NAPS2.WebScan

NAPS2.WebScan contains sample code for scanning from a web browser in JavaScript/TypeScript using [NAPS2.Sdk](https://www.naps2.com/sdk).

## How does this work?

Consider a corporate network with an intranet site we want to add scanning capabilities to. Users will scan using a 
scanner attached to their local machine and then upload it to the intranet server. 

- `NAPS2.WebScan.LocalService` is a Windows Service we would install on every client machine. It shares scanning devices attached to the local machine using ESCL, which is a [standard](https://mopria.org/mopria-escl-specification) HTTP protocol the browser can connect to.
- `NAPS2.WebScan.WebServer` is an example web server with JS/TS client code for scanning (in practice you would integrate the code with your existing server).

Note that while the sample service code is designed for Windows, the concept can easily be extended cross-platform.

## How do I build the JS/TS code?

- `cd NAPS2.WebScan.WebServer`
- `npm install`
- `vite build`

## Where's the interesting code?

- [Worker.cs](https://github.com/cyanfish/naps2-webscan/blob/master/NAPS2.WebScan.LocalService/Worker.cs) - Setting up the scanner-sharing server
- [site.ts](https://github.com/cyanfish/naps2-webscan/blob/master/NAPS2.WebScan.WebServer/wwwroot/js/site.ts) - Scanning from JavaScript/TypeScript
- [escl-sdk-ts](https://github.com/cyanfish/naps2-webscan/tree/master/NAPS2.WebScan.WebServer/wwwroot/lib/escl-sdk-ts) - Lightly modified version of the [escl-sdk-ts](https://www.npmjs.com/package/escl-sdk-ts) package used for the client

## How do I set option X for scanning?

Have a look at [IScanSettingParams](https://github.com/cyanfish/naps2-webscan/blob/4571e9c917edcc053f89aaeba047725529fdc7bf/NAPS2.WebScan.WebServer/wwwroot/lib/escl-sdk-ts/types/scanner.d.ts#L54) and the whole [types folder](https://github.com/cyanfish/naps2-webscan/tree/master/NAPS2.WebScan.WebServer/wwwroot/lib/escl-sdk-ts/types) for the type definitions. The [ESCL spec](https://mopria.org/mopria-escl-specification) may also be helpful.

## How do I scan multiple pages from a feeder?

Keep calling `NextDocument` until it errors with a 404.

## Still having trouble?

Feel free to create [an issue](https://github.com/cyanfish/naps2-webscan/issues).

################################################################################

# WebScannerModal - Complete Documentation

A comprehensive JavaScript library for web-based document scanning using NAPS2's eSCL protocol. Supports both flatbed and ADF (Auto Document Feeder) scanning with batch capabilities, preview, and local document storage.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)

---

## Overview

WebScannerModal provides a complete scanning solution with:

- 📄 **Single & Batch Scanning**: Scan one document or multiple in sequence
- 🖨️ **ADF Support**: Automatic document feeder for multi-page scanning
- 👁️ **Live Preview**: View scanned documents before saving
- 💾 **Local Storage**: Keep scanned documents in memory for later use
- ⚙️ **Capabilities Detection**: Automatically detects scanner features
- 📊 **Progress Tracking**: Real-time feedback for batch operations
- 🎨 **Modern UI**: Beautiful, responsive modal interface

---

## Prerequisites

### Required

1. **NAPS2** (Not Another PDF Scanner 2) installed with WebScan service running
   - Download from: https://www.naps2.com/
   - Enable and start the WebScan service on `http://localhost:9801`

2. **Modern Browser** with CORS support
   - Chrome, Firefox, Edge, or Safari

### Optional

3. **PDF.js** (for PDF preview generation)
   - CDN: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`

---

## Installation

### Method 1: Direct Script Include

```html
<!DOCTYPE html>
<html>
<head>
    <title>Document Scanner</title>
    <!-- Optional: PDF.js for PDF previews -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
    <!-- Your content -->
    
    <!-- Include WebScannerModal -->
    <script src="path/to/webscanner-modal.js"></script>
    
    <script>
        // Initialize scanner
        const scanner = new WebScannerModal({ autoCheckService: true });
        
        // Open scanner interface
        scanner.open();
    </script>
</body>
</html>
```

### Method 2: Module Import (if using bundler)

```javascript
import { WebScannerModal } from './webscanner-modal.js';

const scanner = new WebScannerModal({ autoCheckService: true });
scanner.open();
```

---

## Quick Start

### Basic Usage

```javascript
// 1. Initialize the scanner
const scanner = new WebScannerModal({
    autoCheckService: true,  // Automatically check service on load
    serviceUrl: 'http://localhost:9801',  // Default NAPS2 URL
    onDocumentsScanned: (documents) => {
        console.log('Scanned documents:', documents);
    }
});

// 2. Open the scanner modal
scanner.open();

// 3. User scans documents through the UI

// 4. Get scanned documents
const docs = scanner.getDocuments();
docs.forEach(doc => {
    console.log('Document ID:', doc.id);
    console.log('Blob:', doc.blob);
    console.log('Scan #:', doc.scanNumber);
});
```

---

## API Reference

### Constructor: `new WebScannerModal(options)`

Creates a new scanner instance.

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serviceUrl` | String | `'http://localhost:9801'` | NAPS2 WebScan service URL |
| `autoCheckService` | Boolean | `true` | Auto-check service availability on init |
| `onDocumentsScanned` | Function | `null` | Callback when scanning completes |

**Example:**

```javascript
const scanner = new WebScannerModal({
    serviceUrl: 'http://localhost:9801',
    autoCheckService: true,
    onDocumentsScanned: (documents) => {
        console.log(`Scanned ${documents.length} document(s)`);
        documents.forEach(doc => {
            console.log(`Scan ${doc.scanNumber}, Page ${doc.pageNumber}`);
        });
    }
});
```

---

### Core Methods

#### `open()`

Opens the scanner modal interface.

**Returns:** `void`

**Example:**

```javascript
const scanner = new WebScannerModal();
scanner.open();
```

---

#### `close()`

Closes the scanner modal interface.

**Returns:** `void`

**Example:**

```javascript
scanner.close();
```

---

#### `checkService()`

Manually checks if the NAPS2 service is available and retrieves scanner capabilities.

**Returns:** `Promise<void>`

**Example:**

```javascript
await scanner.checkService();
// Updates UI with service status and scanner capabilities
```

---

#### `getDocuments()`

Retrieves all scanned documents from the internal store.

**Returns:** `Array<Object>`

Each document object contains:
- `id` (String): Unique document identifier
- `blob` (Blob): The actual document data
- `scanNumber` (Number): Which scan batch this belongs to
- `pageNumber` (Number): Page number within the scan
- `metadata` (Object): Format, size, and type information

**Example:**

```javascript
const documents = scanner.getDocuments();

documents.forEach(doc => {
    console.log('Document ID:', doc.id);
    console.log('Scan Number:', doc.scanNumber);
    console.log('Page Number:', doc.pageNumber);
    console.log('Size:', doc.metadata.size, 'bytes');
    console.log('Format:', doc.metadata.format);
    
    // Create download link
    const url = URL.createObjectURL(doc.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-${doc.scanNumber}-page-${doc.pageNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
});
```

---

#### `clearAllDocuments()`

Removes all documents from the internal store and frees memory.

**Returns:** `void`

**Example:**

```javascript
// Clear all scanned documents
scanner.clearAllDocuments();
console.log('Document store cleared');
```

---

#### `openPreview()`

Opens the preview modal showing all scanned documents as thumbnails.

**Returns:** `void`

**Example:**

```javascript
// Scan some documents first, then show preview
scanner.openPreview();
```

---

#### `closePreview()`

Closes the preview modal.

**Returns:** `void`

**Example:**

```javascript
scanner.closePreview();
```

---

#### `removeDocument(docId)`

Removes a specific document from the store by its ID.

**Parameters:**
- `docId` (String): The unique document identifier

**Returns:** `void`

**Example:**

```javascript
const docs = scanner.getDocuments();
const firstDocId = docs[0].id;

// Remove the first document
scanner.removeDocument(firstDocId);
console.log('Document removed');
```

---

### Advanced Methods

#### `performScan()`

Performs a single scan operation with current UI settings.

**Returns:** `Promise<void>`

**Note:** This is called internally by the UI, but can be triggered programmatically.

**Example:**

```javascript
// Set up custom scan settings first (via UI or direct manipulation)
// Then trigger scan
await scanner.performScan();
```

---

#### `startBatchScan()`

Starts a batch scanning operation based on current UI settings.

**Returns:** `Promise<void>`

**Supports three modes:**
1. **Single scan**: One operation
2. **Prompt mode**: User replaces paper between scans
3. **Delay mode**: Automatic scanning with delays

**Example:**

```javascript
// Configure batch settings in UI, then start
await scanner.startBatchScan();
```

---

#### `switchTab(tabName)`

Switches between "Single Scan" and "Batch Scan" tabs.

**Parameters:**
- `tabName` (String): Either `'single'` or `'batch'`

**Returns:** `void`

**Example:**

```javascript
// Switch to batch scan tab
scanner.switchTab('batch');

// Switch back to single scan
scanner.switchTab('single');
```

---

### WebScanner Core Class

The underlying scanner communication layer.

#### `scanner.scan(options)`

Low-level scanning method (accessed via `scanner.scanner.scan()`).

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `source` | String | `'Platen'` | `'Platen'` (flatbed) or `'Feeder'` (ADF) |
| `resolution` | Number | `300` | DPI resolution (150, 300, 600) |
| `colorMode` | String | `'RGB24'` | `'RGB24'`, `'Grayscale8'`, `'BlackAndWhite1'` |
| `format` | String | `'image/jpeg'` | `'image/jpeg'`, `'image/png'`, `'application/pdf'` |
| `intent` | String | `'Document'` | `'Document'`, `'Photo'`, `'TextAndGraphic'` |

**Returns:** `Promise<Array<Blob>>`

**Example:**

```javascript
// Perform a custom scan
const blobs = await scanner.scanner.scan({
    source: 'Platen',
    resolution: 600,
    colorMode: 'RGB24',
    format: 'application/pdf',
    intent: 'Photo'
});

console.log(`Scanned ${blobs.length} page(s)`);
blobs.forEach((blob, i) => {
    console.log(`Page ${i + 1}: ${blob.size} bytes, type: ${blob.type}`);
});
```

---

## Usage Examples

### Example 1: Simple Single-Page Scan

```javascript
// Initialize scanner
const scanner = new WebScannerModal({
    autoCheckService: true,
    onDocumentsScanned: (docs) => {
        console.log('Scan complete!', docs);
    }
});

// Open modal
document.getElementById('scanBtn').addEventListener('click', () => {
    scanner.open();
});

// Get scanned documents later
document.getElementById('getDocsBtn').addEventListener('click', () => {
    const documents = scanner.getDocuments();
    console.log(`Retrieved ${documents.length} document(s)`);
});
```

---

### Example 2: Batch Scanning with Callback

```javascript
const scanner = new WebScannerModal({
    autoCheckService: true,
    onDocumentsScanned: (documents) => {
        // Upload to server
        documents.forEach(async (doc) => {
            const formData = new FormData();
            formData.append('file', doc.blob, `scan-${doc.scanNumber}.pdf`);
            formData.append('scanNumber', doc.scanNumber);
            formData.append('pageNumber', doc.pageNumber);
            
            await fetch('/api/upload-scan', {
                method: 'POST',
                body: formData
            });
        });
        
        alert('All documents uploaded!');
    }
});

scanner.open();
```

---

### Example 3: ADF Multi-Page Scanning

```javascript
const scanner = new WebScannerModal({ autoCheckService: true });

// Open modal
scanner.open();

// User configuration in UI:
// 1. Select "Feeder (ADF)" as input source
// 2. Load multiple pages in ADF
// 3. Click "Scan Document"
// Result: All pages scanned as separate documents

// After scanning, download all pages
document.getElementById('downloadAllBtn').addEventListener('click', () => {
    const docs = scanner.getDocuments();
    docs.forEach(doc => {
        const url = URL.createObjectURL(doc.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page-${doc.pageNumber}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
    });
});
```

---

### Example 4: Custom Preview Display

```javascript
const scanner = new WebScannerModal({
    autoCheckService: true,
    onDocumentsScanned: (documents) => {
        // Custom preview in your own UI
        const previewContainer = document.getElementById('myPreview');
        previewContainer.innerHTML = '';
        
        documents.forEach(doc => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(doc.blob);
            img.style.width = '200px';
            img.style.margin = '10px';
            
            const caption = document.createElement('p');
            caption.textContent = `Scan ${doc.scanNumber}, Page ${doc.pageNumber}`;
            
            const wrapper = document.createElement('div');
            wrapper.appendChild(img);
            wrapper.appendChild(caption);
            
            previewContainer.appendChild(wrapper);
        });
    }
});

scanner.open();
```

---

### Example 5: Programmatic Scanning

```javascript
const scanner = new WebScannerModal({ autoCheckService: false });

// Manual service check
await scanner.checkService();

// Perform low-level scan with specific settings
const blobs = await scanner.scanner.scan({
    source: 'Platen',
    resolution: 600,
    colorMode: 'RGB24',
    format: 'application/pdf',
    intent: 'Photo'
});

// Process results
console.log(`Scanned ${blobs.length} page(s)`);

// Add to document store
scanner.documentStore.scanCount++;
await scanner.addDocumentsToStore(blobs, scanner.documentStore.scanCount);

// Show preview
scanner.openPreview();
```

---

### Example 6: Integration with Form Submission

```javascript
const scanner = new WebScannerModal({
    autoCheckService: true,
    onDocumentsScanned: async (documents) => {
        // Add scanned documents to form
        const formData = new FormData(document.getElementById('myForm'));
        
        documents.forEach((doc, index) => {
            formData.append(`document_${index}`, doc.blob, `scan-${index}.pdf`);
        });
        
        // Submit form with scanned documents
        await fetch('/api/submit-form', {
            method: 'POST',
            body: formData
        });
        
        alert('Form submitted with scanned documents!');
        scanner.clearAllDocuments();
    }
});

// Attach to form button
document.getElementById('scanDocumentsBtn').addEventListener('click', () => {
    scanner.open();
});
```

---

### Example 7: React Integration

```javascript
import { useEffect, useRef } from 'react';

function ScannerComponent() {
    const scannerRef = useRef(null);
    
    useEffect(() => {
        // Initialize scanner
        scannerRef.current = new WebScannerModal({
            autoCheckService: true,
            onDocumentsScanned: (documents) => {
                console.log('React: Documents scanned', documents);
                // Update React state, upload to server, etc.
            }
        });
        
        // Cleanup
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clearAllDocuments();
            }
        };
    }, []);
    
    const handleOpenScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.open();
        }
    };
    
    const handleGetDocuments = () => {
        if (scannerRef.current) {
            const docs = scannerRef.current.getDocuments();
            console.log('Retrieved documents:', docs);
        }
    };
    
    return (
        <div>
            <button onClick={handleOpenScanner}>Open Scanner</button>
            <button onClick={handleGetDocuments}>Get Documents</button>
        </div>
    );
}
```

---

### Example 8: Debug and Troubleshooting

```javascript
const scanner = new WebScannerModal({ autoCheckService: false });

// Check if service is available
const isAvailable = await scanner.scanner.isServiceAvailable();
console.log('Service available:', isAvailable);

// Get scanner capabilities
const caps = await scanner.scanner.getScannerCapabilities();
console.log('Capabilities:', caps);

// Check scanner status (debug helper)
const status = await scanner.checkScannerStatus();
console.log('Scanner status:', status);

// Test ADF with minimal settings (debug helper)
try {
    const result = await scanner.testADF();
    console.log('ADF test successful:', result.length, 'pages');
} catch (error) {
    console.error('ADF test failed:', error);
}
```

---

## Advanced Features

### Scanner Capabilities Detection

The library automatically detects your scanner's capabilities:

```javascript
const scanner = new WebScannerModal({ autoCheckService: true });

// After service check, capabilities are stored
const caps = scanner.scannerCapabilities;

if (caps) {
    console.log('Input Sources:', caps.inputSources);
    // [{type: 'Platen', label: 'Flatbed', maxWidth: 2550, maxHeight: 3508}]
    
    console.log('Resolutions:', caps.resolutions);
    // [150, 300, 600]
    
    console.log('Color Modes:', caps.colorModes);
    // ['RGB24', 'Grayscale8', 'BlackAndWhite1']
    
    console.log('Supported Formats:', caps.documentFormats);
    // ['image/jpeg', 'image/png', 'application/pdf']
}
```

---

### Batch Scanning Modes

#### 1. Single Scan
One scan operation, stores all pages.

#### 2. Prompt Mode
Multiple scans with user prompts to replace paper:
- Set number of scans (2-20)
- User prompted between each scan
- Good for flatbed scanning of multiple documents

#### 3. Delay Mode
Automatic multiple scans with delays:
- Set number of scans (2-20)
- Set delay between scans (5-60 seconds)
- Fully automated for prepared documents

---

### Output Modes

#### 1. Load into Preview
Stores documents in memory for review before saving.

#### 2. Save to Single File
All pages combined into one file (requires PDF format or manual combining).

#### 3. Save to Multiple Files
Split documents into separate files:
- **One file per scan**: Groups pages by scan operation
- **One file per page**: Each page as separate file
- **Filename pattern**: Use `$(nnn)` for auto-numbering

---

## Troubleshooting

### Service Not Running

**Error:** "Service Not Running - Please start NAPS2 WebScan service"

**Solution:**
1. Open NAPS2 application
2. Go to Tools → Web Scan → Start Service
3. Ensure service is running on `http://localhost:9801`
4. Click "Recheck Service" in the scanner modal

---

### ADF Not Working

**Error:** "Scanner error: Check if paper is loaded in ADF feeder"

**Solutions:**
1. Verify paper is loaded in ADF tray
2. Ensure ADF cover is closed properly
3. Check scanner is not in sleep mode
4. Try using flatbed mode first to verify scanner works
5. Use debug helper: `scanner.checkScannerStatus()`

---

### No Preview Generated

**Issue:** PDF documents show placeholder instead of preview

**Solution:**
Include PDF.js library:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

---

### CORS Errors

**Error:** "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
NAPS2 WebScan service should allow CORS by default. If issues persist:
1. Restart NAPS2 WebScan service
2. Check firewall settings
3. Ensure you're accessing via `localhost` not `127.0.0.1`

---

### Memory Issues

**Issue:** Browser running slow after many scans

**Solution:**
```javascript
// Clear documents periodically
scanner.clearAllDocuments();

// Or remove specific documents
const docs = scanner.getDocuments();
docs.forEach(doc => {
    if (doc.scanNumber < 5) {  // Remove old scans
        scanner.removeDocument(doc.id);
    }
});
```

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Fully Supported |

---

## License

This library interfaces with NAPS2, which is licensed under GPLv2. Refer to NAPS2's license for usage terms.

---

## Support

For issues with:
- **WebScannerModal library**: Check this documentation
- **NAPS2 software**: Visit https://www.naps2.com/
- **Scanner hardware**: Consult your scanner manufacturer

---

## Version History

**v1.0.0**
- Initial release
- Single and batch scanning support
- ADF support
- Preview functionality
- Capabilities detection
- Local document storage

---

**Happy Scanning! 🖨️**