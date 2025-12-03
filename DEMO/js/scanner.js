/**
 * WebScanner - Client library for NAPS2.WebScan
 * 
 * This module provides a simple interface to scan documents
 * from a web browser using NAPS2.WebScan local service.
 */

class WebScanner {
    constructor(serviceUrl = 'http://localhost:9801') {
        this.serviceUrl = serviceUrl;
        this.esclEndpoint = `${serviceUrl}/eSCL`;
    }

    /**
     * Check if the NAPS2.WebScan service is running
     * @returns {Promise<boolean>}
     */
    async isServiceAvailable() {
        try {
            const response = await fetch(`${this.esclEndpoint}/ScannerStatus`, {
                method: 'GET',
                mode: 'cors'
            });
            return response.ok;
        } catch (error) {
            console.error('Service check failed:', error);
            return false;
        }
    }

    /**
     * Get scanner capabilities
     * @returns {Promise<Object>}
     */
    async getScannerCapabilities() {
        try {
            const response = await fetch(`${this.esclEndpoint}/ScannerCapabilities`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error('Failed to get scanner capabilities');
            }
            
            const xmlText = await response.text();
            return this._parseCapabilities(xmlText);
        } catch (error) {
            throw new Error(`Get capabilities failed: ${error.message}`);
        }
    }

    /**
     * Get scanner status
     * @returns {Promise<Object>}
     */
    async getScannerStatus() {
        try {
            const response = await fetch(`${this.esclEndpoint}/ScannerStatus`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error('Failed to get scanner status');
            }
            
            const xmlText = await response.text();
            return this._parseStatus(xmlText);
        } catch (error) {
            throw new Error(`Get status failed: ${error.message}`);
        }
    }

    /**
     * Start a scan job
     * @param {Object} options - Scan options
     * @returns {Promise<string>} Job URI
     */
    async startScan(options = {}) {
        const settings = this._buildScanSettings(options);
        
        try {
            // Use a simpler fetch without explicit Content-Type header
            // This might avoid the preflight request
            const response = await fetch(`${this.esclEndpoint}/ScanJobs`, {
                method: 'POST',
                mode: 'cors',
                body: settings
            });
            
            if (!response.ok) {
                throw new Error(`Scan start failed: ${response.status}`);
            }
            
            // Get job location from response header
            const location = response.headers.get('Location');
            if (!location) {
                throw new Error('No Location header in response');
            }
            
            return location;
        } catch (error) {
            console.error('Start scan error:', error);
            throw new Error(`Start scan failed: ${error.message}`);
        }
    }

    /**
     * Get the next document from scan job
     * @param {string} jobUri - Job URI from startScan
     * @returns {Promise<Blob>}
     */
    async getNextDocument(jobUri) {
        try {
            const response = await fetch(`${jobUri}/NextDocument`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (response.status === 404) {
                // No more documents - this is normal
                return null;
            }
            
            if (response.status === 503) {
                // Scanner is busy - throw error to retry
                throw new Error('Scanner busy (503)');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const blob = await response.blob();
            return blob;
        } catch (error) {
            // Re-throw with status code preserved
            throw new Error(`Get document failed: ${error.message}`);
        }
    }

    /**
     * Scan and get all documents
     * @param {Object} options - Scan options
     * @returns {Promise<Array<Blob>>}
     */
    async scan(options = {}) {
        const jobUri = await this.startScan(options);
        const documents = [];
        
        // Wait longer for scan to complete (adjust based on your scanner speed)
        console.log('Waiting for scan to complete...');
        await this._sleep(5000); // Wait 5 seconds for first document
        
        // Try to get documents with retry
        let retries = 0;
        const maxRetries = 10;
        
        while (retries < maxRetries) {
            try {
                const doc = await this.getNextDocument(jobUri);
                
                if (doc) {
                    console.log('Document received:', doc.size, 'bytes');
                    documents.push(doc);
                    
                    // Check for more pages after a short delay
                    await this._sleep(1000);
                } else {
                    // No more documents
                    console.log('No more documents');
                    break;
                }
            } catch (error) {
                if (error.message.includes('503')) {
                    // Scanner still busy, wait and retry
                    console.log('Scanner busy, waiting...');
                    retries++;
                    await this._sleep(2000);
                } else if (error.message.includes('404')) {
                    // No more documents
                    break;
                } else {
                    // Real error
                    throw error;
                }
            }
        }
        
        if (documents.length === 0) {
            throw new Error('No documents scanned. Scanner may be warming up or there was an error.');
        }
        
        return documents;
    }

    /**
     * Scan and download
     * @param {Object} options - Scan options
     * @param {string} filename - Download filename
     */
    async scanAndDownload(options = {}, filename = 'scan.pdf') {
        const documents = await this.scan(options);
        
        if (documents.length === 1) {
            // Single document
            this._downloadBlob(documents[0], filename);
        } else {
            // Multiple documents
            documents.forEach((doc, index) => {
                const ext = this._getExtension(options.format);
                this._downloadBlob(doc, `${filename}-${index + 1}.${ext}`);
            });
        }
    }

    /**
     * Scan and upload to server
     * @param {string} uploadUrl - Server upload endpoint
     * @param {Object} options - Scan options
     * @returns {Promise<Object>}
     */
    async scanAndUpload(uploadUrl, options = {}) {
        const documents = await this.scan(options);
        
        const formData = new FormData();
        documents.forEach((doc, index) => {
            const ext = this._getExtension(options.format);
            formData.append('files', doc, `scan-${index + 1}.${ext}`);
        });
        
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }
        
        return await response.json();
    }

    // Private helper methods

    _buildScanSettings(options) {
        const intent = options.intent || 'Document';
        const format = options.format || 'application/pdf';
        const colorMode = options.colorMode || 'RGB24';
        const resolution = options.resolution || 300;
        const source = options.source || 'Platen'; // Platen or Feeder
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<scan:ScanSettings xmlns:scan="http://schemas.hp.com/imaging/escl/2011/05/03" xmlns:pwg="http://www.pwg.org/schemas/2010/12/sm">
    <pwg:Version>2.0</pwg:Version>
    <scan:Intent>${intent}</scan:Intent>
    <pwg:ScanRegions>
        <pwg:ScanRegion>
            <pwg:ContentRegionUnits>escl:ThreeHundredthsOfInches</pwg:ContentRegionUnits>
            <pwg:XOffset>0</pwg:XOffset>
            <pwg:YOffset>0</pwg:YOffset>
            <pwg:Width>2550</pwg:Width>
            <pwg:Height>3300</pwg:Height>
        </pwg:ScanRegion>
    </pwg:ScanRegions>
    <pwg:InputSource>${source}</pwg:InputSource>
    <scan:DocumentFormatExt>${format}</scan:DocumentFormatExt>
    <scan:XResolution>${resolution}</scan:XResolution>
    <scan:YResolution>${resolution}</scan:YResolution>
    <scan:ColorMode>${colorMode}</scan:ColorMode>
</scan:ScanSettings>`;
    }

    _parseCapabilities(xmlText) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        
        const makeAndModel = xml.querySelector('MakeAndModel')?.textContent || 'Unknown';
        const serialNumber = xml.querySelector('SerialNumber')?.textContent || '';
        
        return {
            makeAndModel,
            serialNumber
        };
    }

    _parseStatus(xmlText) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        
        const state = xml.querySelector('State')?.textContent || 'Unknown';
        
        return {
            state,
            isReady: state === 'Idle'
        };
    }

    _downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    _getExtension(format) {
        const formats = {
            'application/pdf': 'pdf',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/tiff': 'tiff'
        };
        return formats[format] || 'pdf';
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for ES6 modules
export default WebScanner;

// Also support CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebScanner;
}