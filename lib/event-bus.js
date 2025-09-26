// Simple event bus for cross-component communication
class EventBus {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  // Emit an event
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Remove all listeners for an event
  off(event) {
    delete this.events[event];
  }

  // Remove all listeners
  clear() {
    this.events = {};
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  if (!window.eventBus) {
    window.eventBus = new EventBus();
  }
}

export default typeof window !== 'undefined' ? window.eventBus : new EventBus();