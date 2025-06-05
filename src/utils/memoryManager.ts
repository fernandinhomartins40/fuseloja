
export class MemoryManager {
  private objectUrls = new Set<string>();
  private cleanupCallbacks = new Map<string, () => void>();
  
  // Register an object URL for cleanup
  registerObjectUrl(url: string): string {
    this.objectUrls.add(url);
    return url;
  }
  
  // Register a cleanup callback for a specific resource
  registerCleanup(id: string, callback: () => void): void {
    this.cleanupCallbacks.set(id, callback);
  }
  
  // Clean up a specific object URL
  revokeObjectUrl(url: string): void {
    if (this.objectUrls.has(url)) {
      URL.revokeObjectURL(url);
      this.objectUrls.delete(url);
    }
  }
  
  // Clean up a specific resource by ID
  cleanup(id: string): void {
    const callback = this.cleanupCallbacks.get(id);
    if (callback) {
      callback();
      this.cleanupCallbacks.delete(id);
    }
  }
  
  // Clean up all registered resources
  cleanupAll(): void {
    // Revoke all object URLs
    this.objectUrls.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.objectUrls.clear();
    
    // Run all cleanup callbacks
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    });
    this.cleanupCallbacks.clear();
  }
  
  // Get memory usage stats
  getStats(): { objectUrls: number; cleanupCallbacks: number } {
    return {
      objectUrls: this.objectUrls.size,
      cleanupCallbacks: this.cleanupCallbacks.size
    };
  }
}

// Global memory manager instance
export const memoryManager = new MemoryManager();

// Utility function to create a managed object URL
export const createManagedObjectUrl = (blob: Blob): string => {
  const url = URL.createObjectURL(blob);
  return memoryManager.registerObjectUrl(url);
};

// Cleanup hook for React components
export const useMemoryCleanup = () => {
  const cleanupRef = React.useRef<string[]>([]);
  
  const addCleanup = React.useCallback((id: string, callback: () => void) => {
    memoryManager.registerCleanup(id, callback);
    cleanupRef.current.push(id);
  }, []);
  
  React.useEffect(() => {
    return () => {
      cleanupRef.current.forEach(id => {
        memoryManager.cleanup(id);
      });
    };
  }, []);
  
  return { addCleanup };
};
