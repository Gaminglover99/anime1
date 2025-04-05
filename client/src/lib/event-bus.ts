// Simple event bus for components to communicate
type EventMap = {
  'reset-filters': void;
  'reset-search': void;
  'home-search': string; // New event for search from navbar to home page
  // Add more events as needed
};

type EventCallback<T> = (data: T) => void;

class EventBus {
  private events: {
    [K in keyof EventMap]?: EventCallback<EventMap[K]>[];
  } = {};

  subscribe<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event]?.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event]?.filter(cb => cb !== callback);
    };
  }

  publish<K extends keyof EventMap>(event: K, data?: EventMap[K]) {
    if (!this.events[event]) {
      return;
    }
    
    this.events[event]?.forEach(callback => {
      // @ts-ignore - Type mismatch, but we know it's the right type
      callback(data);
    });
  }
}

export const eventBus = new EventBus();