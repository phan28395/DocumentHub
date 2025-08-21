// Simple storage abstraction
// Add cloud sync later, only change this file
class Storage {
  constructor() {
    this.prefix = 'docIntel_';
  }

  async save(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage save failed:', e);
      return false;
    }
  }

  async load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage load failed:', e);
      return defaultValue;
    }
  }

  async remove(key) {
    localStorage.removeItem(this.prefix + key);
  }
}

export const storage = new Storage();