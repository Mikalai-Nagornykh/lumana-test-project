import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storageSignals: Map<string, WritableSignal<any>> = new Map();

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      this.getOrCreateSignal<T>(key).set(value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getItem<T>(key: string): WritableSignal<T | null> {
    return this.getOrCreateSignal<T>(key);
  }

  private getOrCreateSignal<T>(key: string): WritableSignal<T | null> {
    if (!this.storageSignals.has(key)) {
      const storedValue = this.loadFromLocalStorage<T>(key);
      // Create a new signal with the current localStorage value
      const signalValue = signal<T | null>(storedValue);
      this.storageSignals.set(key, signalValue);
    }
    return this.storageSignals.get(key) as WritableSignal<T | null>;
  }

  private loadFromLocalStorage<T>(key: string): T | null {
    try {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) {
        return null;
      }
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  }
}
