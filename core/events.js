// EventBus
// Features communicate through events, not direct calls
class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback, context = null) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push({ callback, context });
    
    // Return unsubscribe function (important for cleanup)
    return () => this.off(event, callback);
  }

  emit(event, data = {}) {
    if (!this.listeners[event]) return;
    
    // Clone array to avoid issues if listener removes itself
    const listeners = [...this.listeners[event]];
    listeners.forEach(({ callback, context }) => {
      callback.call(context, data);
    });
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      listener => listener.callback !== callback
    );
  }
}

// Global instance - all features share this
export const eventBus = new EventBus();