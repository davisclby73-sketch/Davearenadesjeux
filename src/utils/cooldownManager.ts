/**
 * Cooldown & Signal Persistence Manager
 * Ensures that cooldown timers and active signals remain strictly synchronized
 * even when the user navigates between the menu and game SAS.
 */

const memoryCooldowns = new Map<string, number>();
const memorySignals = new Map<string, any>();

export const cooldownManager = {
  getRemainingCooldown(gameId: string): number {
    try {
      const stored = localStorage.getItem(`cooldown_exp_${gameId}`);
      if (!stored) return 0;
      const expiry = parseInt(stored, 10);
      const remainingMs = expiry - Date.now();
      if (remainingMs <= 0) {
        localStorage.removeItem(`cooldown_exp_${gameId}`);
        return 0;
      }
      return Math.ceil(remainingMs / 1000);
    } catch {
      const expiry = memoryCooldowns.get(gameId);
      if (!expiry) return 0;
      const remainingMs = expiry - Date.now();
      if (remainingMs <= 0) {
        memoryCooldowns.delete(gameId);
        return 0;
      }
      return Math.ceil(remainingMs / 1000);
    }
  },

  startCooldown(gameId: string, durationSeconds: number): number {
    const expiry = Date.now() + durationSeconds * 1000;
    try {
      localStorage.setItem(`cooldown_exp_${gameId}`, expiry.toString());
    } catch {
      memoryCooldowns.set(gameId, expiry);
    }
    return durationSeconds;
  },

  clearCooldown(gameId: string): void {
    try {
      localStorage.removeItem(`cooldown_exp_${gameId}`);
    } catch {
      memoryCooldowns.delete(gameId);
    }
  },

  getSavedSignal<T>(gameId: string): T | null {
    try {
      const raw = localStorage.getItem(`signal_data_${gameId}`);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return (memorySignals.get(gameId) as T) || null;
    }
  },

  saveSignal<T>(gameId: string, signal: T): void {
    try {
      localStorage.setItem(`signal_data_${gameId}`, JSON.stringify(signal));
    } catch {
      memorySignals.set(gameId, signal);
    }
  },

  clearSavedSignal(gameId: string): void {
    try {
      localStorage.removeItem(`signal_data_${gameId}`);
    } catch {
      memorySignals.delete(gameId);
    }
  },
};
