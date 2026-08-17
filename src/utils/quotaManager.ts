/**
 * Quota & VIP Access Manager
 * Handles the 3-analysis free limit, VIP unlock code (1948), and reset code (1844).
 */

const VIP_STORAGE_KEY = 'dave_vip_unlocked';
const USAGE_STORAGE_KEY = 'dave_analyses_used';
export const FREE_QUOTA_LIMIT = 3;
export const SECRET_VIP_CODE = '1948';
export const SECRET_RESET_CODE = '1844';

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const quotaManager = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  isVip(): boolean {
    try {
      return localStorage.getItem(VIP_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  },

  getAnalysesUsed(): number {
    try {
      const val = localStorage.getItem(USAGE_STORAGE_KEY);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  getRemainingAnalyses(): number {
    if (this.isVip()) return 999;
    const used = this.getAnalysesUsed();
    return Math.max(0, FREE_QUOTA_LIMIT - used);
  },

  canPerformAnalysis(): boolean {
    if (this.isVip()) return true;
    return this.getRemainingAnalyses() > 0;
  },

  consumeAnalysis(): { success: boolean; remaining: number } {
    if (this.isVip()) {
      return { success: true, remaining: 999 };
    }
    const used = this.getAnalysesUsed();
    if (used >= FREE_QUOTA_LIMIT) {
      return { success: false, remaining: 0 };
    }
    const newUsed = used + 1;
    try {
      localStorage.setItem(USAGE_STORAGE_KEY, newUsed.toString());
    } catch {}
    notify();
    return { success: true, remaining: Math.max(0, FREE_QUOTA_LIMIT - newUsed) };
  },

  verifyAndApplyCode(code: string): 'vip_unlocked' | 'normal_reset' | 'invalid' {
    const clean = code.trim();
    if (clean === SECRET_VIP_CODE) {
      try {
        localStorage.setItem(VIP_STORAGE_KEY, 'true');
      } catch {}
      notify();
      return 'vip_unlocked';
    } else if (clean === SECRET_RESET_CODE) {
      try {
        localStorage.removeItem(VIP_STORAGE_KEY);
        localStorage.removeItem(USAGE_STORAGE_KEY);
      } catch {}
      notify();
      return 'normal_reset';
    }
    return 'invalid';
  },

  unlockVip(code: string): boolean {
    return this.verifyAndApplyCode(code) === 'vip_unlocked';
  },

  resetQuota(): void {
    try {
      localStorage.removeItem(VIP_STORAGE_KEY);
      localStorage.removeItem(USAGE_STORAGE_KEY);
    } catch {}
    notify();
  },
};
