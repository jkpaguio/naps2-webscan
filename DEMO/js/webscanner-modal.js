/**
 * WebScannerModal - Complete Document Scanner Library with Capabilities Detection
 * Dependencies: PDF.js (optional, for PDF preview)
 * 
 * Usage:
 *   const scanner = new WebScannerModal({ autoCheckService: true });
 *   scanner.open();
 */

// WebScanner Core Class
class WebScanner {
    constructor(serviceUrl = 'http://localhost:9801') {
        this.serviceUrl = serviceUrl;
        this.esclEndpoint = `${serviceUrl}/eSCL`;
        this.capabilities = null;
    }

    async isServiceAvailable() {
        try {
            const res = await fetch(`${this.esclEndpoint}/ScannerStatus`, { method: 'GET', mode: 'cors' });
            return res.ok;
        } catch (e) { return false; }
    }

    async getScannerCapabilities() {
        try {
            const res = await fetch(`${this.esclEndpoint}/ScannerCapabilities`, { method: 'GET', mode: 'cors' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const text = await res.text();
            this.capabilities = this._parseCapabilities(text);
            return this.capabilities;
        } catch (e) {
            console.error('Failed to get capabilities:', e);
            return null;
        }
    }

    _parseCapabilities(xmlText) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');

        const capabilities = {
            inputSources: [],
            resolutions: [],
            colorModes: [],
            documentFormats: [],
            maxWidth: 0,
            maxHeight: 0
        };

        // Parse input sources (Platen and/or Feeder)
        const platen = xml.querySelector('Platen');
        if (platen) {
            capabilities.inputSources.push({
                type: 'Platen',
                label: 'Flatbed (Platen)',
                maxWidth: this._getTextContent(platen, 'MaxWidth'),
                maxHeight: this._getTextContent(platen, 'MaxHeight')
            });
        }

        const adf = xml.querySelector('Adf');
        if (adf) {
            capabilities.inputSources.push({
                type: 'Feeder',
                label: 'Document Feeder (ADF)',
                maxWidth: this._getTextContent(adf, 'MaxWidth'),
                maxHeight: this._getTextContent(adf, 'MaxHeight'),
                supportsDuplex: !!adf.querySelector('AdfDuplexInputCaps')
            });
        }

        // Parse resolutions from SettingProfiles
        const profiles = xml.querySelectorAll('SettingProfile');
        const resolutionSet = new Set();
        profiles.forEach(profile => {
            const xRes = this._getTextContent(profile, 'XResolution');
            const yRes = this._getTextContent(profile, 'YResolution');
            if (xRes && yRes && xRes === yRes) {
                resolutionSet.add(parseInt(xRes));
            }
        });
        capabilities.resolutions = Array.from(resolutionSet).sort((a, b) => a - b);

        // Parse color modes
        const colorModeSet = new Set();
        profiles.forEach(profile => {
            const mode = this._getTextContent(profile, 'ColorMode');
            if (mode) colorModeSet.add(mode);
        });
        capabilities.colorModes = Array.from(colorModeSet);

        // Parse document formats
        const formats = xml.querySelectorAll('DocumentFormat');
        formats.forEach(fmt => {
            const formatText = fmt.textContent.trim();
            if (formatText) capabilities.documentFormats.push(formatText);
        });

        // Get max dimensions
        if (capabilities.inputSources.length > 0) {
            capabilities.maxWidth = Math.max(...capabilities.inputSources.map(s => s.maxWidth));
            capabilities.maxHeight = Math.max(...capabilities.inputSources.map(s => s.maxHeight));
        }

        return capabilities;
    }

    _getTextContent(parent, tagName) {
        const el = parent.querySelector(tagName);
        return el ? parseInt(el.textContent.trim()) : 0;
    }

    async startScan(opts = {}) {
        const settings = this._buildScanSettings(opts);

        console.log('📤 Sending scan request to NAPS2...');
        console.log('📋 Scan XML Settings:');
        console.log(settings);

        const res = await fetch(`${this.esclEndpoint}/ScanJobs`, { method: 'POST', mode: 'cors', body: settings });

        console.log(`📥 ScanJobs response: ${res.status} ${res.statusText}`);

        if (!res.ok) {
            const errorText = await res.text().catch(() => 'Unknown error');
            console.error('❌ Failed to start scan:', errorText);
            throw new Error(`Scan start failed: ${res.status} - ${errorText}`);
        }

        const loc = res.headers.get('Location');
        if (!loc) throw new Error('No Location header');

        console.log(`✅ Scan job started at: ${loc}`);
        return loc;
    }

    async getNextDocument(jobUri) {
        const res = await fetch(`${jobUri}/NextDocument`, { method: 'GET', mode: 'cors' });

        console.log(`📄 GetNextDocument response: ${res.status} ${res.statusText}`);

        if (res.status === 404) return null;
        if (res.status === 503) throw new Error('Scanner busy (503)');
        if (res.status === 500) {
            // Internal server error - often means no paper in ADF or scan failed
            const errorText = await res.text().catch(() => 'Unknown error');
            console.error('❌ Server error (500):', errorText);
            throw new Error('Scanner error: Check if paper is loaded in ADF feeder or try different settings');
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        console.log(`✅ Retrieved document: ${blob.size} bytes, type: ${blob.type}`);
        return blob;
    }

    async scan(opts = {}) {
        console.log('🎯 Starting scan job...');
        const jobUri = await this.startScan(opts);
        console.log(`✅ Scan job created: ${jobUri}`);

        const docs = [];
        const isADF = opts.source === 'Feeder';

        // Wait for scanner to be ready
        const initialWait = isADF ? 3000 : 5000;
        console.log(`⏳ Waiting ${initialWait}ms for scanner to initialize...`);
        await this._sleep(initialWait);

        let retries = 0;
        const maxRetries = isADF ? 15 : 10; // More retries for ADF

        console.log(`🔄 Polling for documents (max ${maxRetries} attempts)...`);

        while (retries < maxRetries) {
            try {
                console.log(`📄 Attempt ${retries + 1}/${maxRetries}: Checking for document...`);
                const doc = await this.getNextDocument(jobUri);

                if (doc) {
                    console.log(`✅ Document ${docs.length + 1} retrieved`);
                    docs.push(doc);

                    // For ADF, check if there are more pages
                    if (isADF) {
                        console.log('🔄 ADF mode: Checking for next page...');
                        await this._sleep(2000); // Wait before checking for next page
                    } else {
                        // For flatbed, we expect only one page
                        break;
                    }
                } else {
                    console.log('ℹ️ No more documents available (404 response)');
                    break;
                }
            } catch (e) {
                console.warn(`⚠️ Attempt ${retries + 1} failed:`, e.message);

                if (e.message.includes('503')) {
                    // Scanner busy - wait and retry
                    retries++;
                    console.log(`⏳ Scanner busy, waiting 2s before retry...`);
                    await this._sleep(2000);
                } else if (e.message.includes('404')) {
                    // No more documents
                    console.log('✅ Scan complete (no more documents)');
                    break;
                } else if (e.message.includes('500') || e.message.includes('Scanner error')) {
                    // Server error - likely no paper or scan failed
                    if (docs.length > 0) {
                        // We got some documents, consider it a success
                        console.log(`⚠️ Error after ${docs.length} pages, stopping scan`);
                        break;
                    } else {
                        // No documents retrieved, this is a real error
                        throw e;
                    }
                } else {
                    throw e;
                }
            }
        }

        if (docs.length === 0) {
            throw new Error(isADF
                ? 'No documents scanned. Please check: (1) Paper is loaded in ADF, (2) ADF cover is closed, (3) Scanner is ready'
                : 'No documents scanned. Please check if document is placed on scanner glass');
        }

        console.log(`✅ Scan complete: ${docs.length} document(s) retrieved`);
        return docs;
    }

    _buildScanSettings(o) {
        const intent = o.intent || 'Document';
        const format = o.format || 'image/jpeg';
        const colorMode = o.colorMode || 'RGB24';
        const resolution = o.resolution || 300;
        const source = o.source || 'Platen';
        const width = o.width || 2480;
        const height = o.height || 3508;
        return `<?xml version="1.0" encoding="UTF-8"?>
<scan:ScanSettings xmlns:scan="http://schemas.hp.com/imaging/escl/2011/05/03" xmlns:pwg="http://www.pwg.org/schemas/2010/12/sm">
    <pwg:Version>2.0</pwg:Version>
    <scan:Intent>${intent}</scan:Intent>
    <pwg:ScanRegions>
        <pwg:ScanRegion>
            <pwg:ContentRegionUnits>escl:ThreeHundredthsOfInches</pwg:ContentRegionUnits>
            <pwg:XOffset>0</pwg:XOffset>
            <pwg:YOffset>0</pwg:YOffset>
            <pwg:Width>${width}</pwg:Width>
            <pwg:Height>${height}</pwg:Height>
        </pwg:ScanRegion>
    </pwg:ScanRegions>
    <pwg:InputSource>${source}</pwg:InputSource>
    <scan:DocumentFormatExt>${format}</scan:DocumentFormatExt>
    <scan:XResolution>${resolution}</scan:XResolution>
    <scan:YResolution>${resolution}</scan:YResolution>
    <scan:ColorMode>${colorMode}</scan:ColorMode>
</scan:ScanSettings>`;
    }

    _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
}

// Main WebScannerModal Class
class WebScannerModal {
    constructor(opts = {}) {
        this.serviceUrl = opts.serviceUrl || 'http://localhost:9801';
        this.scanner = new WebScanner(this.serviceUrl);
        this.onDocumentsScanned = opts.onDocumentsScanned || null;
        this.autoCheckService = opts.autoCheckService !== false;

        this.documentStore = { documents: [], format: 'application/pdf', scanCount: 0 };
        this.batchState = { active: false, mode: null, currentScan: 0, totalScans: 0 };
        this.batchPromptResolve = null;
        this.batchPromptReject = null;
        this.scannerCapabilities = null;

        this.initializeModal();
        if (this.autoCheckService) setTimeout(() => this.checkService(), 100);
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
    }

    initializeModal() {
        const id = 'webScannerModalContainer';
        if (document.getElementById(id)) {
            document.getElementById(id).remove();
        }
        const c = document.createElement('div');
        c.id = id;
        c.innerHTML = this.getModalHTML();
        document.body.appendChild(c);
        this.addStyles();
        this.bindEvents();
        window.webScannerInstance = this;
    }

    getModalHTML() {
        return `<div id="webScannerModal" class="wsm"><div class="wsm-backdrop" onclick="webScannerInstance.close()"></div><div class="wsm-content"><div class="wsm-container"><div class="wsm-header"><div><h1>🖨️ Web Document Scanner</h1><p class="wsm-subtitle">Single and batch scanning with preview</p></div><button class="wsm-close-btn" onclick="webScannerInstance.close()">×</button></div><div id="wsmStatus" class="wsm-status wsm-checking"><div class="wsm-status-icon"><div class="wsm-spinner"></div></div><div class="wsm-status-content"><div class="wsm-status-title">Checking service...</div><div class="wsm-status-detail">Connecting to scanner</div></div></div><div id="wsmCapabilities" class="wsm-capabilities" style="display: none;"><h3>🔍 Scanner Capabilities</h3><div class="wsm-caps-grid"><div class="wsm-cap-item"><strong>Input Sources:</strong><span id="wsmCapSources">-</span></div><div class="wsm-cap-item"><strong>Resolutions:</strong><span id="wsmCapResolutions">-</span></div><div class="wsm-cap-item"><strong>Color Modes:</strong><span id="wsmCapColorModes">-</span></div><div class="wsm-cap-item"><strong>Formats:</strong><span id="wsmCapFormats">-</span></div></div></div><div class="wsm-tabs"><button class="wsm-tab wsm-active" onclick="webScannerInstance.switchTab('single')">📄 Single Scan</button><button class="wsm-tab" onclick="webScannerInstance.switchTab('batch')">📚 Batch Scan</button></div><div id="wsmSingleTab" class="wsm-tab-content wsm-active"><div class="wsm-options" style="background: #e8f4f8; border: 2px solid #2196f3;"><h3>📦 Document Store</h3><div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"><div><strong id="wsmStoreCount">0 documents</strong> stored locally<button class="wsm-btn-primary" onclick="webScannerInstance.openPreview()" style="margin-left: 15px; padding: 8px 16px; font-size: 13px;">👁️ View All</button></div><button class="wsm-btn-danger" onclick="webScannerInstance.clearAllDocuments()" style="padding: 8px 16px; font-size: 13px;">🗑️ Clear All</button></div></div><div class="wsm-controls"><button id="wsmCheckBtn" class="wsm-btn-secondary">🔄 Recheck Service</button><button id="wsmScanBtn" class="wsm-btn-primary" disabled>📄 Scan Document</button></div><div class="wsm-options"><h3>⚙️ Scan Settings</h3><div class="wsm-option-group"><label for="wsmSource">Input Source</label><select id="wsmSource"><option value="Platen">Flatbed (Platen)</option><option value="Feeder">Document Feeder (ADF)</option></select></div><div class="wsm-option-group"><label for="wsmResolution">Resolution (DPI)</label><select id="wsmResolution"><option value="150">150 DPI</option><option value="300" selected>300 DPI</option><option value="600">600 DPI</option></select></div><div class="wsm-option-group"><label for="wsmColorMode">Color Mode</label><select id="wsmColorMode"><option value="RGB24" selected>Color</option><option value="Grayscale8">Grayscale</option><option value="BlackAndWhite1">Black & White</option></select></div><div class="wsm-option-group"><label for="wsmIntent">Scan Intent</label><select id="wsmIntent"><option value="Document" selected>Document</option><option value="Photo">Photo</option><option value="TextAndGraphic">Text and Graphic</option></select></div><div class="wsm-option-group"><label for="wsmFormat">Output Format</label><select id="wsmFormat"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="application/pdf">PDF</option></select></div></div></div><div id="wsmBatchTab" class="wsm-tab-content"><div class="wsm-options" style="background: #e8f4f8; border: 2px solid #2196f3;"><h3>📦 Document Store</h3><div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"><div><strong id="wsmStoreCountBatch">0 documents</strong> stored<button class="wsm-btn-primary" onclick="webScannerInstance.openPreview()" style="margin-left: 15px; padding: 8px 16px; font-size: 13px;">👁️ View All</button></div><button class="wsm-btn-danger" onclick="webScannerInstance.clearAllDocuments()" style="padding: 8px 16px; font-size: 13px;">🗑️ Clear All</button></div></div><div class="wsm-options"><h3>🔄 Scan Mode</h3><div class="wsm-radio-group"><label class="wsm-radio-option wsm-selected"><input type="radio" name="wsmScanMode" value="single" checked><div><strong>Single scan</strong><br><small>One operation</small></div></label><label class="wsm-radio-option"><input type="radio" name="wsmScanMode" value="prompt"><div><strong>Multiple scans (prompt)</strong><br><small>Replace paper between scans</small></div></label><div class="wsm-sub-options" id="wsmPromptOptions"><div class="wsm-option-group"><label for="wsmPromptScans">Number of scans</label><input type="number" id="wsmPromptScans" value="3" min="2" max="20"></div></div><label class="wsm-radio-option"><input type="radio" name="wsmScanMode" value="delay"><div><strong>Multiple scans (delay)</strong><br><small>Automatic with delay</small></div></label><div class="wsm-sub-options" id="wsmDelayOptions"><div class="wsm-option-group"><label for="wsmDelayScans">Number of scans</label><input type="number" id="wsmDelayScans" value="3" min="2" max="20"></div><div class="wsm-option-group"><label for="wsmDelayTime">Delay (seconds)</label><input type="number" id="wsmDelayTime" value="10" min="5" max="60"></div></div></div></div><div class="wsm-options"><h3>💾 Output Configuration</h3><div class="wsm-radio-group"><label class="wsm-radio-option wsm-selected"><input type="radio" name="wsmOutputMode" value="preview" checked><div><strong>Load into preview</strong><br><small>Review before saving</small></div></label><label class="wsm-radio-option"><input type="radio" name="wsmOutputMode" value="single"><div><strong>Save to single file</strong><br><small>All pages combined</small></div></label><label class="wsm-radio-option"><input type="radio" name="wsmOutputMode" value="multiple"><div><strong>Save to multiple files</strong><br><small>Split files</small></div></label><div class="wsm-sub-options" id="wsmMultipleOptions"><div class="wsm-option-group"><label for="wsmSplitMode">Split by</label><select id="wsmSplitMode"><option value="scan">One file per scan</option><option value="page">One file per page</option></select></div><div class="wsm-option-group"><label for="wsmFilenamePattern">Filename pattern</label><input type="text" id="wsmFilenamePattern" value="scan-$(nnn)"><small style="color: #666; display: block; margin-top: 5px;">Use $(nnn) for numbering</small></div></div></div></div><div class="wsm-controls"><button id="wsmStartBatchBtn" class="wsm-btn-primary" disabled>🚀 Start Batch Scan</button><button id="wsmStopBatchBtn" class="wsm-btn-danger" disabled style="display: none;">⏹️ Stop Batch</button></div><div id="wsmBatchProgress" class="wsm-batch-progress"><h3>📊 Batch Progress</h3><div class="wsm-batch-status"><span id="wsmBatchStatusText">Initializing...</span><span id="wsmBatchCounter">0 / 0</span></div><div class="wsm-progress-bar"><div id="wsmBatchProgressFill" class="wsm-progress-fill" style="width: 0%">0%</div></div><div class="wsm-batch-log" id="wsmBatchLog"></div></div></div><div id="wsmResult" class="wsm-result"></div></div></div></div><div id="wsmPreviewModal" class="wsm-preview-modal"><div class="wsm-preview-container"><div class="wsm-preview-header"><h2>📄 Scanned Documents</h2><button class="wsm-close-btn" onclick="webScannerInstance.closePreview()">×</button></div><div class="wsm-preview-body"><div id="wsmPreviewGrid" class="wsm-preview-grid"></div></div><div class="wsm-preview-actions"><button class="wsm-btn-secondary" onclick="webScannerInstance.clearAllDocuments()">🗑️ Clear All</button><button class="wsm-btn-danger" onclick="webScannerInstance.closePreview()">Close</button><button class="wsm-btn-success" onclick="webScannerInstance.approveAndDownload()">✓ Download All</button></div></div></div><div id="wsmBatchPromptModal" class="wsm-batch-prompt-modal"><div class="wsm-batch-prompt-content"><h2>📄 Ready for Next Scan</h2><p id="wsmPromptMessage">Replace paper and click Continue.</p><div class="wsm-batch-prompt-actions"><button class="wsm-btn-danger" onclick="webScannerInstance.cancelBatchPrompt()">Cancel</button><button class="wsm-btn-success" onclick="webScannerInstance.continueBatchPrompt()">Continue</button></div></div></div>`;
    }

    addStyles() {
        const sid = 'wsmStyles';
        if (document.getElementById(sid)) return;
        const s = document.createElement('style');
        s.id = sid;
        s.textContent = `.wsm{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;overflow-y:auto}.wsm.wsm-show{display:block}.wsm-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1}.wsm-content{position:relative;z-index:2;padding:20px;min-height:100vh;display:flex;align-items:center;justify-content:center}.wsm-container{max-width:900px;width:100%;background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);padding:40px;margin:20px auto}.wsm-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}.wsm-header h1{color:#333;margin:0 0 10px 0;font-size:32px}.wsm-subtitle{color:#666;margin:0;font-size:14px}.wsm-close-btn{background:none;border:none;font-size:36px;color:#999;cursor:pointer;padding:0;width:40px;height:40px;border-radius:50%;transition:all 0.3s;line-height:1}.wsm-close-btn:hover{background:#f0f0f0;color:#333}.wsm-status{padding:20px;border-radius:8px;margin-bottom:20px;border:2px solid;display:flex;align-items:center;gap:15px}.wsm-status.wsm-checking{background:#e3f2fd;border-color:#2196f3;color:#1565c0}.wsm-status.wsm-success{background:#e8f5e9;border-color:#4caf50;color:#2e7d32}.wsm-status.wsm-error{background:#ffebee;border-color:#f44336;color:#c62828}.wsm-status-icon{font-size:24px;min-width:30px;text-align:center}.wsm-status-content{flex:1}.wsm-status-title{font-weight:bold;margin-bottom:5px}.wsm-status-detail{font-size:13px;opacity:0.8}.wsm-capabilities{background:#f0f7ff;border:2px solid #2196f3;border-radius:8px;padding:20px;margin-bottom:20px}.wsm-capabilities h3{margin:0 0 15px 0;color:#1565c0;font-size:16px}.wsm-caps-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.wsm-cap-item{background:#fff;padding:12px;border-radius:6px;border:1px solid #b3d9ff}.wsm-cap-item strong{display:block;color:#1565c0;font-size:13px;margin-bottom:5px}.wsm-cap-item span{color:#555;font-size:13px;word-break:break-word}.wsm-tabs{display:flex;gap:10px;margin-bottom:20px;border-bottom:2px solid #e0e0e0}.wsm-tab{padding:12px 24px;background:none;border:none;border-bottom:3px solid transparent;cursor:pointer;font-weight:600;color:#666;transition:all 0.3s;font-size:14px}.wsm-tab:hover{color:#667eea}.wsm-tab.wsm-active{color:#667eea;border-bottom-color:#667eea}.wsm-tab-content{display:none}.wsm-tab-content.wsm-active{display:block}.wsm-controls{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}.wsm-controls button{flex:1;min-width:150px}button.wsm-btn-primary,button.wsm-btn-secondary,button.wsm-btn-success,button.wsm-btn-danger{padding:12px 24px;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s}button:disabled{opacity:0.5;cursor:not-allowed}.wsm-btn-primary{background:#667eea;color:#fff}.wsm-btn-primary:hover:not(:disabled){background:#5568d3;transform:translateY(-2px);box-shadow:0 4px 12px rgba(102,126,234,0.4)}.wsm-btn-secondary{background:#6c757d;color:#fff}.wsm-btn-secondary:hover:not(:disabled){background:#5a6268}.wsm-btn-success{background:#28a745;color:#fff}.wsm-btn-success:hover:not(:disabled){background:#218838}.wsm-btn-danger{background:#dc3545;color:#fff}.wsm-btn-danger:hover:not(:disabled){background:#c82333}.wsm-options{background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px}.wsm-options h3{margin:0 0 15px 0;color:#333;font-size:16px}.wsm-option-group{margin-bottom:15px}.wsm-option-group:last-child{margin-bottom:0}.wsm-option-group label{display:block;margin-bottom:5px;color:#555;font-weight:500;font-size:14px}.wsm-option-group select,.wsm-option-group input[type="text"],.wsm-option-group input[type="number"]{width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:14px;background:#fff;box-sizing:border-box}.wsm-option-group select:disabled,.wsm-option-group input:disabled{background:#f5f5f5;color:#999;cursor:not-allowed}.wsm-radio-group{display:flex;flex-direction:column;gap:10px}.wsm-radio-option{display:flex;align-items:center;padding:12px;background:#fff;border:2px solid #ddd;border-radius:6px;cursor:pointer;transition:all 0.3s}.wsm-radio-option:hover{border-color:#667eea}.wsm-radio-option input[type="radio"]{margin-right:10px;width:auto;flex-shrink:0}.wsm-radio-option.wsm-selected{border-color:#667eea;background:#f0f4ff}.wsm-sub-options{margin-left:30px;margin-top:10px;display:none}.wsm-sub-options.wsm-show{display:block}.wsm-spinner{border:3px solid #f3f3f3;border-top:3px solid #667eea;border-radius:50%;width:20px;height:20px;animation:wsm-spin 1s linear infinite;display:inline-block;margin-right:10px}@keyframes wsm-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.wsm-batch-progress{display:none;background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px}.wsm-batch-progress.wsm-show{display:block}.wsm-batch-progress h3{margin:0 0 15px 0;color:#333}.wsm-batch-status{display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;color:#666}.wsm-progress-bar{width:100%;height:30px;background:#e0e0e0;border-radius:15px;overflow:hidden;margin-bottom:15px}.wsm-progress-fill{height:100%;background:linear-gradient(90deg,#667eea 0%,#764ba2 100%);transition:width 0.3s;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:12px}.wsm-batch-log{background:#fff;border:1px solid #ddd;border-radius:4px;padding:15px;max-height:200px;overflow-y:auto;font-family:monospace;font-size:12px}.wsm-log-entry{padding:5px 0;border-bottom:1px solid #f0f0f0}.wsm-log-entry:last-child{border-bottom:none}.wsm-log-entry.wsm-success{color:#28a745}.wsm-log-entry.wsm-error{color:#dc3545}.wsm-log-entry.wsm-info{color:#666}.wsm-preview-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10001;overflow-y:auto}.wsm-preview-modal.wsm-show{display:flex;align-items:center;justify-content:center;padding:20px}.wsm-preview-container{background:#fff;border-radius:12px;max-width:1200px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 25px 80px rgba(0,0,0,0.5)}.wsm-preview-header{padding:20px 30px;border-bottom:2px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center}.wsm-preview-header h2{color:#333;font-size:24px;margin:0}.wsm-preview-body{padding:30px;overflow-y:auto;flex:1}.wsm-preview-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;margin-bottom:30px}.wsm-preview-item{position:relative;border:2px solid #ddd;border-radius:8px;overflow:hidden;background:#f9f9f9;transition:all 0.3s}.wsm-preview-item:hover{border-color:#667eea;box-shadow:0 4px 12px rgba(102,126,234,0.3)}.wsm-preview-item img{width:100%;height:300px;object-fit:contain;background:#fff;cursor:pointer}.wsm-preview-item-footer{padding:10px;background:#fff;display:flex;justify-content:space-between;align-items:center}.wsm-preview-item-label{font-size:14px;font-weight:600;color:#555}.wsm-preview-item-actions{display:flex;gap:5px}.wsm-preview-item-btn{padding:5px 10px;font-size:12px;min-width:auto}.wsm-preview-actions{display:flex;gap:15px;padding:20px 30px;border-top:2px solid #e0e0e0;background:#f9f9f9}.wsm-preview-actions button{flex:1}.wsm-batch-prompt-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10002;align-items:center;justify-content:center}.wsm-batch-prompt-modal.wsm-show{display:flex}.wsm-batch-prompt-content{background:#fff;padding:40px;border-radius:12px;max-width:500px;text-align:center;box-shadow:0 25px 80px rgba(0,0,0,0.5)}.wsm-batch-prompt-content h2{color:#333;margin:0 0 20px 0;font-size:24px}.wsm-batch-prompt-content p{color:#666;margin:0 0 30px 0;font-size:16px;line-height:1.6}.wsm-batch-prompt-actions{display:flex;gap:15px}.wsm-batch-prompt-actions button{flex:1}.wsm-result{margin-top:20px;padding:15px;border-radius:6px;display:none}.wsm-result.wsm-show{display:block}.wsm-result.wsm-success{background:#d4edda;border:1px solid #c3e6cb;color:#155724}.wsm-result.wsm-error{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24}`;
        document.head.appendChild(s);
    }

    bindEvents() {
        this.el = {
            modal: document.getElementById('webScannerModal'),
            status: document.getElementById('wsmStatus'),
            capabilities: document.getElementById('wsmCapabilities'),
            scanBtn: document.getElementById('wsmScanBtn'),
            checkBtn: document.getElementById('wsmCheckBtn'),
            startBatchBtn: document.getElementById('wsmStartBatchBtn'),
            stopBatchBtn: document.getElementById('wsmStopBatchBtn'),
            result: document.getElementById('wsmResult'),
            batchProgress: document.getElementById('wsmBatchProgress'),
            batchLog: document.getElementById('wsmBatchLog'),
            previewModal: document.getElementById('wsmPreviewModal'),
            previewGrid: document.getElementById('wsmPreviewGrid'),
            batchPromptModal: document.getElementById('wsmBatchPromptModal')
        };

        this.el.checkBtn.onclick = () => this.checkService();
        this.el.scanBtn.onclick = () => this.performScan();
        this.el.startBatchBtn.onclick = () => this.startBatchScan();
        this.el.stopBatchBtn.onclick = () => this.stopBatch();

        document.querySelectorAll('.wsm-radio-option input[type="radio"]').forEach(r => {
            r.onchange = (e) => {
                document.querySelectorAll('.wsm-radio-option').forEach(o => o.classList.remove('wsm-selected'));
                e.target.closest('.wsm-radio-option').classList.add('wsm-selected');
                if (e.target.name === 'wsmScanMode') {
                    document.getElementById('wsmPromptOptions').classList.remove('wsm-show');
                    document.getElementById('wsmDelayOptions').classList.remove('wsm-show');
                    if (e.target.value === 'prompt') document.getElementById('wsmPromptOptions').classList.add('wsm-show');
                    else if (e.target.value === 'delay') document.getElementById('wsmDelayOptions').classList.add('wsm-show');
                }
                if (e.target.name === 'wsmOutputMode') {
                    document.getElementById('wsmMultipleOptions').classList.remove('wsm-show');
                    if (e.target.value === 'multiple') document.getElementById('wsmMultipleOptions').classList.add('wsm-show');
                }
            };
        });
    }

    open() {
        this.el.modal.classList.add('wsm-show');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.el.modal.classList.remove('wsm-show');
        document.body.style.overflow = '';
    }

    getDocuments() {
        return this.documentStore.documents.map(d => ({ id: d.id, blob: d.blob, scanNumber: d.scanNumber, pageNumber: d.pageNumber, metadata: d.metadata }));
    }

    async checkService() {
        this.updateStatus('checking', 'Checking service...', 'Please wait');
        this.el.scanBtn.disabled = true;
        this.el.startBatchBtn.disabled = true;
        this.el.capabilities.style.display = 'none';

        const ok = await this.scanner.isServiceAvailable();
        if (ok) {
            // Get scanner capabilities
            const caps = await this.scanner.getScannerCapabilities();
            if (caps) {
                this.scannerCapabilities = caps;
                this.updateStatus('success', 'Scanner Ready!', 'Capabilities detected');
                this.displayCapabilities(caps);
                this.updateScanSettings(caps);
                this.el.scanBtn.disabled = false;
                this.el.startBatchBtn.disabled = false;
            } else {
                this.updateStatus('success', 'Scanner Ready!', 'Ready to scan (capabilities not available)');
                this.el.scanBtn.disabled = false;
                this.el.startBatchBtn.disabled = false;
            }
        } else {
            this.updateStatus('error', 'Service Not Running', 'Please start NAPS2 WebScan service');
        }
    }

    displayCapabilities(caps) {
        this.el.capabilities.style.display = 'block';

        // Display input sources
        const sources = caps.inputSources.map(s => {
            let text = s.label;
            if (s.supportsDuplex) text += ' (Duplex)';
            return text;
        }).join(', ') || 'None';
        document.getElementById('wsmCapSources').textContent = sources;

        // Display resolutions
        const resolutions = caps.resolutions.length > 0
            ? caps.resolutions.join(', ') + ' DPI'
            : 'Not available';
        document.getElementById('wsmCapResolutions').textContent = resolutions;

        // Display color modes
        const colorModes = caps.colorModes.length > 0
            ? caps.colorModes.join(', ')
            : 'Not available';
        document.getElementById('wsmCapColorModes').textContent = colorModes;

        // Display formats
        const formats = caps.documentFormats.length > 0
            ? caps.documentFormats.map(f => f.split('/')[1]?.toUpperCase() || f).join(', ')
            : 'Not available';
        document.getElementById('wsmCapFormats').textContent = formats;
    }

    updateScanSettings(caps) {
        // Update input source dropdown
        const sourceSelect = document.getElementById('wsmSource');
        sourceSelect.innerHTML = '';
        caps.inputSources.forEach(source => {
            const option = document.createElement('option');
            option.value = source.type;
            option.textContent = source.label;
            sourceSelect.appendChild(option);
        });

        // Add change event to show ADF warning
        sourceSelect.addEventListener('change', (e) => {
            const isADF = e.target.value === 'Feeder';
            const scanBtn = document.getElementById('wsmScanBtn');

            if (isADF) {
                scanBtn.innerHTML = '📄 Scan from ADF';
                console.log('ℹ️ ADF mode selected - Make sure paper is loaded in the document feeder');
            } else {
                scanBtn.innerHTML = '📄 Scan Document';
            }
        });

        // Disable if no sources available
        if (caps.inputSources.length === 0) {
            sourceSelect.disabled = true;
        }

        // Update resolution dropdown
        if (caps.resolutions.length > 0) {
            const resolutionSelect = document.getElementById('wsmResolution');
            resolutionSelect.innerHTML = '';
            caps.resolutions.forEach(res => {
                const option = document.createElement('option');
                option.value = res;
                option.textContent = `${res} DPI`;
                if (res === 300) option.selected = true; // Default to 300 if available
                resolutionSelect.appendChild(option);
            });
        }

        // Update color mode dropdown
        if (caps.colorModes.length > 0) {
            const colorModeSelect = document.getElementById('wsmColorMode');
            colorModeSelect.innerHTML = '';

            const colorModeMap = {
                'RGB24': 'Color (RGB)',
                'Grayscale8': 'Grayscale',
                'BlackAndWhite1': 'Black & White'
            };

            caps.colorModes.forEach(mode => {
                const option = document.createElement('option');
                option.value = mode;
                option.textContent = colorModeMap[mode] || mode;
                if (mode === 'RGB24') option.selected = true;
                colorModeSelect.appendChild(option);
            });
        }

        // Update format dropdown based on supported formats
        if (caps.documentFormats.length > 0) {
            const formatSelect = document.getElementById('wsmFormat');
            formatSelect.innerHTML = '';
            caps.documentFormats.forEach(fmt => {
                const option = document.createElement('option');
                option.value = fmt;
                const label = fmt.split('/')[1]?.toUpperCase() || fmt;
                option.textContent = label;
                if (fmt === 'application/pdf') option.selected = true;
                formatSelect.appendChild(option);
            });
        }
    }

    updateStatus(type, title, detail) {
        this.el.status.className = `wsm-status wsm-${type}`;
        const icons = { checking: '<div class="wsm-spinner"></div>', success: '✅', error: '❌' };
        this.el.status.innerHTML = `<div class="wsm-status-icon">${icons[type]}</div><div class="wsm-status-content"><div class="wsm-status-title">${title}</div><div class="wsm-status-detail">${detail}</div></div>`;
    }

    async performScan() {
        this.el.scanBtn.disabled = true;
        this.el.scanBtn.innerHTML = '<div class="wsm-spinner"></div> Scanning...';
        this.el.result.classList.remove('wsm-show');
        const opts = {
            source: document.getElementById('wsmSource').value,
            resolution: parseInt(document.getElementById('wsmResolution').value),
            colorMode: document.getElementById('wsmColorMode').value,
            format: document.getElementById('wsmFormat').value,
            intent: document.getElementById('wsmIntent').value
        };

        console.log('🖨️ Starting scan with options:', opts);

        this.documentStore.format = opts.format;
        try {
            const docs = await this.scanner.scan(opts);
            console.log(`✅ Scan complete: ${docs.length} page(s) scanned`);

            this.el.scanBtn.innerHTML = '<div class="wsm-spinner"></div> Processing...';
            this.documentStore.scanCount++;
            await this.addDocumentsToStore(docs, this.documentStore.scanCount);
            this.el.result.className = 'wsm-result wsm-success wsm-show';
            this.el.result.textContent = `✅ Scanned ${docs.length} page(s) - stored locally`;
            this.openPreview();
            if (this.onDocumentsScanned) this.onDocumentsScanned(this.getDocuments());
        } catch (e) {
            console.error('❌ Scan error:', e);
            this.el.result.className = 'wsm-result wsm-error wsm-show';
            this.el.result.textContent = `❌ Scan failed: ${e.message}`;
        } finally {
            this.el.scanBtn.disabled = false;
            this.el.scanBtn.innerHTML = '📄 Scan Document';
        }
    }

    async startBatchScan() {
        const mode = document.querySelector('input[name="wsmScanMode"]:checked').value;
        const outputMode = document.querySelector('input[name="wsmOutputMode"]:checked').value;
        this.batchState.active = true;
        this.batchState.mode = mode;
        this.batchState.currentScan = 0;
        this.batchState.totalScans = mode === 'single' ? 1 : mode === 'prompt' ? parseInt(document.getElementById('wsmPromptScans').value) : parseInt(document.getElementById('wsmDelayScans').value);
        const opts = {
            source: document.getElementById('wsmSource').value,
            resolution: parseInt(document.getElementById('wsmResolution').value),
            colorMode: document.getElementById('wsmColorMode').value,
            format: document.getElementById('wsmFormat').value,
            intent: document.getElementById('wsmIntent').value
        };
        this.documentStore.format = opts.format;
        this.el.startBatchBtn.disabled = true;
        this.el.stopBatchBtn.disabled = false;
        this.el.stopBatchBtn.style.display = 'block';
        this.el.batchProgress.classList.add('wsm-show');
        this.el.result.classList.remove('wsm-show');
        this.el.batchLog.innerHTML = '';
        this.addLog('info', `Starting batch: ${mode} mode, ${this.batchState.totalScans} scan(s)`);
        let batchDocs = [];
        let batchGroups = [];
        try {
            for (let i = 0; i < this.batchState.totalScans; i++) {
                if (!this.batchState.active) {
                    this.addLog('error', 'Batch cancelled');
                    break;
                }
                this.batchState.currentScan = i + 1;
                this.updateBatchProgress();
                this.addLog('info', `Scan ${i + 1} of ${this.batchState.totalScans}: Starting...`);
                const docs = await this.scanner.scan(opts);
                this.documentStore.scanCount++;
                this.addLog('info', `Generating previews for ${docs.length} page(s)...`);
                await this.addDocumentsToStore(docs, this.documentStore.scanCount);
                batchGroups.push(docs);
                batchDocs.push(...docs);
                this.addLog('success', `Scan ${i + 1} complete: ${docs.length} page(s)`);
                if (i < this.batchState.totalScans - 1) {
                    if (mode === 'prompt') await this.showBatchPrompt(i + 1, this.batchState.totalScans);
                    else if (mode === 'delay') {
                        const delay = parseInt(document.getElementById('wsmDelayTime').value);
                        this.addLog('info', `Waiting ${delay}s...`);
                        await new Promise(r => setTimeout(r, delay * 1000));
                    }
                }
            }
            if (this.batchState.active) {
                this.addLog('success', `Batch complete! ${batchDocs.length} page(s) stored`);
                await this.handleBatchOutput(outputMode, batchDocs, batchGroups);
                if (this.onDocumentsScanned) this.onDocumentsScanned(this.getDocuments());
            }
        } catch (e) {
            this.addLog('error', `Error: ${e.message}`);
            this.el.result.className = 'wsm-result wsm-error wsm-show';
            this.el.result.textContent = `❌ Batch failed: ${e.message}`;
        } finally {
            this.batchState.active = false;
            this.el.startBatchBtn.disabled = false;
            this.el.stopBatchBtn.disabled = true;
            this.el.stopBatchBtn.style.display = 'none';
        }
    }

    stopBatch() {
        this.batchState.active = false;
        this.addLog('error', 'Batch stopped by user');
    }

    async handleBatchOutput(mode, docs, groups) {
        if (mode === 'preview') {
            this.openPreview();
        } else if (mode === 'single') {
            const ext = this.getExtension(this.documentStore.format);
            docs.forEach((d, i) => this.downloadBlob(d, i === 0 ? `batch-scan.${ext}` : `batch-scan-${i}.${ext}`));
            this.el.result.className = 'wsm-result wsm-success wsm-show';
            this.el.result.textContent = '✅ Downloaded batch documents';
        } else if (mode === 'multiple') {
            const splitMode = document.getElementById('wsmSplitMode').value;
            const pattern = document.getElementById('wsmFilenamePattern').value;
            const ext = this.getExtension(this.documentStore.format);
            if (splitMode === 'scan') {
                groups.forEach((g, si) => {
                    g.forEach((d, pi) => {
                        const fn = this.generateFilename(pattern, si + 1);
                        this.downloadBlob(d, `${fn}-page${pi + 1}.${ext}`);
                    });
                });
            } else {
                docs.forEach((d, i) => {
                    const fn = this.generateFilename(pattern, i + 1);
                    this.downloadBlob(d, `${fn}.${ext}`);
                });
            }
            this.el.result.className = 'wsm-result wsm-success wsm-show';
            this.el.result.textContent = `✅ Downloaded ${docs.length} file(s)`;
        }
    }

    generateFilename(pattern, num) {
        return pattern.replace('$(nnn)', String(num).padStart(3, '0'));
    }

    updateBatchProgress() {
        const pct = Math.round((this.batchState.currentScan / this.batchState.totalScans) * 100);
        document.getElementById('wsmBatchProgressFill').style.width = pct + '%';
        document.getElementById('wsmBatchProgressFill').textContent = pct + '%';
        document.getElementById('wsmBatchStatusText').textContent = `Scanning batch ${this.batchState.currentScan} of ${this.batchState.totalScans}`;
        document.getElementById('wsmBatchCounter').textContent = `${this.batchState.currentScan} / ${this.batchState.totalScans}`;
    }

    addLog(type, msg) {
        const ts = new Date().toLocaleTimeString();
        const e = document.createElement('div');
        e.className = `wsm-log-entry wsm-${type}`;
        e.textContent = `[${ts}] ${msg}`;
        this.el.batchLog.appendChild(e);
        this.el.batchLog.scrollTop = this.el.batchLog.scrollHeight;
    }

    showBatchPrompt(current, total) {
        return new Promise((resolve, reject) => {
            document.getElementById('wsmPromptMessage').textContent = `Scan ${current} of ${total} complete. Replace paper and click Continue.`;
            this.el.batchPromptModal.classList.add('wsm-show');
            this.batchPromptResolve = resolve;
            this.batchPromptReject = reject;
        });
    }

    continueBatchPrompt() {
        this.el.batchPromptModal.classList.remove('wsm-show');
        if (this.batchPromptResolve) this.batchPromptResolve();
    }

    cancelBatchPrompt() {
        this.el.batchPromptModal.classList.remove('wsm-show');
        this.batchState.active = false;
        if (this.batchPromptReject) this.batchPromptReject(new Error('Batch cancelled'));
    }

    async addDocumentsToStore(blobs, scanNum) {
        for (let i = 0; i < blobs.length; i++) {
            const blob = blobs[i];
            const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const previewUrl = await this.createPreviewUrl(blob);
            this.documentStore.documents.push({
                id: id,
                blob: blob,
                previewUrl: previewUrl,
                timestamp: new Date().toISOString(),
                scanNumber: scanNum,
                pageNumber: i + 1,
                metadata: { format: this.documentStore.format, size: blob.size, type: blob.type }
            });
        }
        this.updateStoreCounter();
    }

    async createPreviewUrl(blob) {
        if (blob.type.startsWith('image/')) return URL.createObjectURL(blob);
        if (blob.type === 'application/pdf' && typeof pdfjsLib !== 'undefined') {
            try {
                const ab = await blob.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
                const page = await pdf.getPage(1);
                const scale = 1.5;
                const vp = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = vp.height;
                canvas.width = vp.width;
                await page.render({ canvasContext: ctx, viewport: vp }).promise;
                return canvas.toDataURL('image/png');
            } catch (e) {
                return this.createPDFPlaceholder();
            }
        }
        return this.createPDFPlaceholder();
    }

    createPDFPlaceholder() {
        return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect fill="#f0f0f0" width="200" height="300"/><rect fill="#d0d0d0" x="20" y="20" width="160" height="200" rx="5"/><text x="100" y="130" text-anchor="middle" fill="#666" font-size="16" font-family="Arial">PDF Document</text></svg>');
    }

    updateStoreCounter() {
        const cnt = this.documentStore.documents.length;
        const txt = `${cnt} document${cnt !== 1 ? 's' : ''}`;
        document.getElementById('wsmStoreCount').textContent = txt;
        document.getElementById('wsmStoreCountBatch').textContent = txt;
    }

    switchTab(tab) {
        document.querySelectorAll('.wsm-tab').forEach(t => t.classList.remove('wsm-active'));
        document.querySelectorAll('.wsm-tab-content').forEach(c => c.classList.remove('wsm-active'));
        event.target.classList.add('wsm-active');
        document.getElementById(`wsm${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`).classList.add('wsm-active');
    }

    openPreview() {
        if (this.documentStore.documents.length === 0) {
            this.el.result.className = 'wsm-result wsm-error wsm-show';
            this.el.result.textContent = '❌ No documents in store';
            return;
        }
        this.renderPreview();
        this.el.previewModal.classList.add('wsm-show');
    }

    closePreview() {
        this.el.previewModal.classList.remove('wsm-show');
    }

    renderPreview() {
        this.el.previewGrid.innerHTML = '';
        if (this.documentStore.documents.length === 0) {
            this.el.previewGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">No documents in store</p>';
            return;
        }
        this.documentStore.documents.forEach((doc, idx) => {
            const item = document.createElement('div');
            item.className = 'wsm-preview-item';
            item.innerHTML = `<img src="${doc.previewUrl}" alt="Document ${idx + 1}"><div class="wsm-preview-item-footer"><span class="wsm-preview-item-label">Scan ${doc.scanNumber} - Page ${doc.pageNumber}<br><small style="color: #999; font-size: 11px;">${(doc.blob.size / 1024).toFixed(1)} KB</small></span><div class="wsm-preview-item-actions"><button class="wsm-btn-danger wsm-preview-item-btn" onclick="webScannerInstance.removeDocument('${doc.id}')">Remove</button></div></div>`;
            this.el.previewGrid.appendChild(item);
        });
    }

    removeDocument(docId) {
        const idx = this.documentStore.documents.findIndex(d => d.id === docId);
        if (idx !== -1) {
            const doc = this.documentStore.documents[idx];
            if (doc.previewUrl.startsWith('blob:')) URL.revokeObjectURL(doc.previewUrl);
            this.documentStore.documents.splice(idx, 1);
            this.updateStoreCounter();
            this.renderPreview();
        }
    }

    clearAllDocuments() {
        if (this.documentStore.documents.length === 0) return;
        if (confirm(`Clear all ${this.documentStore.documents.length} document(s)?`)) {
            this.documentStore.documents.forEach(d => {
                if (d.previewUrl.startsWith('blob:')) URL.revokeObjectURL(d.previewUrl);
            });
            this.documentStore.documents = [];
            this.documentStore.scanCount = 0;
            this.updateStoreCounter();
            this.closePreview();
            this.el.result.className = 'wsm-result wsm-success wsm-show';
            this.el.result.textContent = '✅ All documents cleared';
        }
    }

    approveAndDownload() {
        if (this.documentStore.documents.length === 0) return;
        try {
            this.documentStore.documents.forEach(doc => {
                const ext = this.getExtension(doc.metadata.format);
                const fn = `scan-${doc.scanNumber}-page-${doc.pageNumber}.${ext}`;
                this.downloadBlob(doc.blob, fn);
            });
            this.el.result.className = 'wsm-result wsm-success wsm-show';
            this.el.result.textContent = `✅ Downloaded ${this.documentStore.documents.length} document(s)!`;
        } catch (e) {
            this.el.result.className = 'wsm-result wsm-error wsm-show';
            this.el.result.textContent = `❌ Download failed: ${e.message}`;
        }
    }

    downloadBlob(blob, fn) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fn;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getExtension(fmt) {
        const fmts = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' };
        return fmts[fmt] || 'pdf';
    }

    // Debug helper - test ADF with minimal settings
    async testADF() {
        console.log('🧪 Testing ADF with minimal settings...');
        try {
            const result = await this.scanner.scan({
                source: 'Feeder',
                resolution: 100,
                colorMode: 'RGB24',
                format: 'image/jpeg',
                intent: 'Document'
            });
            console.log('✅ ADF Test Success:', result.length, 'pages');
            return result;
        } catch (error) {
            console.error('❌ ADF Test Failed:', error);
            throw error;
        }
    }

    // Debug helper - check scanner status
    async checkScannerStatus() {
        console.log('🔍 Checking scanner status...');
        try {
            const res = await fetch(`${this.scanner.esclEndpoint}/ScannerStatus`, { method: 'GET', mode: 'cors' });
            if (!res.ok) {
                console.error('❌ Failed to get scanner status:', res.status);
                return null;
            }
            const xml = await res.text();
            console.log('📋 Scanner Status XML:');
            console.log(xml);

            // Parse and display key info
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');

            const state = doc.querySelector('State')?.textContent;
            const adfState = doc.querySelector('AdfState')?.textContent;
            const adfLoaded = doc.querySelector('AdfLoaded')?.textContent;

            console.log('📊 Status Summary:');
            console.log('  Scanner State:', state || 'Unknown');
            console.log('  ADF State:', adfState || 'Not reported');
            console.log('  ADF Loaded:', adfLoaded || 'Not reported');

            return { state, adfState, adfLoaded, xml };
        } catch (error) {
            console.error('❌ Error checking status:', error);
            return null;
        }
    }
}