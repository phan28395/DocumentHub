// Handles file selection and validation
// This feature is built like it could be an extension (inject coreAPI)

class UploadFeature {
  constructor(coreAPI) {
    // Give Uploadfeatures coreAPI's functions
    this.api = coreAPI; 
    this.allowedTypes = {
      'application/pdf': '.pdf',
      'text/plain': '.txt'
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  init() {
    console.log('Upload feature initializing...');
    
    // Get the container where we should render
    const container = this.api.ui.getContainer('upload-container');
    if (!container) {
      console.error('Upload container not found');
      return;
    }
    
    // Create our UI
    this.render(container);
    
    // Listen for events we care about
    this.setupEventListeners();
  }
  
  render(container) {
    // Create upload button UI
    container.innerHTML = `
      <label for="file-upload" class="upload-btn">
        📁 Upload Document
        <input 
          type="file" 
          id="file-upload"
          accept=".pdf,.txt"
          style="display: none;"
        />
      </label>
      <span id="upload-status" class="upload-status"></span>
    `;
    
    // Add styles
    this.addStyles();
    
    // Store references to elements we'll need
    this.fileInput = container.querySelector('#file-upload');
    this.statusEl = container.querySelector('#upload-status');
    
    // Handle file selection
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
  }
  
  addStyles() {
    // Only add styles once
    if (document.querySelector('#upload-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'upload-styles';
    style.textContent = `
      .upload-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #4CAF50;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      }
      
      .upload-btn:hover {
        background: #45a049;
      }
      
      .upload-status {
        margin-left: 1rem;
        font-size: 14px;
        color: #666;
      }
      
      .upload-status.error {
        color: #f44336;
      }
      
      .upload-status.success {
        color: #4CAF50;
      }
    `;
    document.head.appendChild(style);
  }
  
  async handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('File selected:', file.name, file.type, file.size);
    
    // Validate file type
    if (!this.allowedTypes[file.type]) {
      this.showStatus('Please select a PDF or TXT file', 'error');
      this.fileInput.value = ''; // Clear selection
      return;
    }
    
    // Validate file size (max 10MB for now)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.showStatus('File too large (max 10MB)', 'error');
      this.fileInput.value = '';
      return;
    }
    
    // Show uploading status
    this.showStatus('Processing...', '');
    
    try {
      // Read file content
      const content = await this.readFile(file);
      
      // Create document object
      const document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        content: content  // For TXT files, this is the text
      };
      
      // Store in CoreAPI
      this.api.documents.current = document;
      
      // Save to storage
      await this.api.storage.save(`document_${document.id}`, document);
      
      // Emit event - other features will respond
      this.api.events.emit('document:uploaded', {
        document: document,
        file: file  // Original file object in case others need it
      });
      
      // Show success
      this.showStatus(`Loaded: ${file.name}`, 'success');
      
    } catch (error) {
      console.error('Upload error:', error);
      this.showStatus('Failed to load file', 'error');
      this.api.ui.showNotification('Failed to load file: ' + error.message, 'error');
    }
    
    // Clear file input for re-selection
    this.fileInput.value = '';
  }
  
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        reject(new Error('Failed to read file'));
      };
      
      // Read as text for TXT files, as ArrayBuffer for PDF
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For PDF, we'll read as ArrayBuffer
        // The PDF extractor feature will handle actual text extraction
        reader.readAsArrayBuffer(file);
      }
    });
  }
  
  showStatus(message, type) {
    this.statusEl.textContent = message;
    this.statusEl.className = `upload-status ${type}`;
    
    // Clear status after 3 seconds if success
    if (type === 'success') {
      setTimeout(() => {
        this.statusEl.textContent = '';
        this.statusEl.className = 'upload-status';
      }, 3000);
    }
  }
  
  setupEventListeners() {
    // Listen for document-related events
    
    // Example: Clear upload status when a new document is requested
    this.api.events.on('document:clear', () => {
      this.statusEl.textContent = '';
      this.fileInput.value = '';
    });
    
    // Example: Disable upload while processing
    this.api.events.on('document:processing:start', () => {
      this.fileInput.disabled = true;
    });
    
    this.api.events.on('document:processing:end', () => {
      this.fileInput.disabled = false;
    });
  }
}

// Self-register when imported
export function initUpload(coreAPI) {
  return new UploadFeature(coreAPI);
}