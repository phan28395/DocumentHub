// Main entry point - Wires everything together
import { coreAPI } from './core/api.js';

// Initialize the app
async function init() {
  console.log('Document Intelligence Platform initializing...');
  
  // Set up notification handler
  coreAPI.events.on('ui:notification', ({ message, type }) => {
    showNotification(message, type);
  });
  
  // For testing - expose API globally in development
  if (window.location.hostname === 'localhost') {
    window.coreAPI = coreAPI;
  }
  
  console.log('Core system ready. Waiting for features to load...');
}

// Simple notification system
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  container.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Start the app
init();