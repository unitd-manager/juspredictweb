import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toastStore = {
  listeners: [] as Array<(toasts: Toast[]) => void>,
  toasts: [] as Toast[],
  subscribe: function (listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
  notify: function (message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now().toString();
    this.toasts = [{ id, message, type }, ...this.toasts];
    this.listeners.forEach((listener) => listener(this.toasts));
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.listeners.forEach((listener) => listener(this.toasts));
    }, 3000);
  },
};

export const toast = {
  success: (message: string) => toastStore.notify(message, 'success'),
  error: (message: string) => toastStore.notify(message, 'error'),
  info: (message: string) => toastStore.notify(message, 'info'),
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  React.useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
            t.type === 'success'
              ? 'bg-primary/20 text-primary border border-primary/30'
              : t.type === 'error'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}
        >
          {t.message}
          <button
            onClick={() => {
              toastStore.toasts = toastStore.toasts.filter((x) => x.id !== t.id);
              toastStore.listeners.forEach((listener) => listener(toastStore.toasts));
            }}
            className="opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
