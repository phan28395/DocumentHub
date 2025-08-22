// CoreAPI
// Makes the app "extension ready"
// Provide upload, get docu text, set docu text, get metadata, access current document
// Provide ui management
// Provide settings management
// Provide storage and events access
import { eventBus } from './events.js';
import { storage } from './storage.js';

class CoreAPI {
  constructor() {
    // Document management
    this.documents = {
      current: null,  // Will hold current document data
      
      // Upload a new document
      upload: async (file) => { //Publisher
        // For now, just emit event, features will handle
        
        eventBus.emit('document:upload:requested', { file });
        return { id: Date.now(), file };
      },
      
      // Get current document text
      getText: () => {
        return this.documents.current?.text || '';
      },
      
      // Set document text (for text editor)
      setText: (text) => {
        if (this.documents.current) {
          this.documents.current.text = text;
          eventBus.emit('document:text:updated', { text });
        }
      },
      
      // Get document metadata
      getMetadata: () => {
        return this.documents.current?.metadata || {};
      }
    };

    // UI management
    this.ui = {
      // Get container for feature to render into
      getContainer: (containerId) => {
        return document.getElementById(containerId);
      },
      
      // Show user notifications
      showNotification: (message, type = 'info') => {
        eventBus.emit('ui:notification', { message, type });
      }
    };

    // Settings management
    this.settings = {
      get: async (key, defaultValue) => {
        return storage.load(`settings_${key}`, defaultValue);
      },
      
      set: async (key, value) => {
        await storage.save(`settings_${key}`, value);
        eventBus.emit('settings:changed', { key, value });
      }
    };

    // Storage access
    this.storage = storage;
    
    // Event bus access
    this.events = eventBus;
  }
}

// Single global instance
export const coreAPI = new CoreAPI();