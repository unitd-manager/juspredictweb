import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            t.type === 'success'
              ? 'bg-primary text-black border border-transparent'
              : t.type === 'error'
                ? 'bg-red-600 text-white border border-transparent'
                : 'bg-blue-600 text-white border border-transparent'
          }`}
        >
          <span className="mr-3">{t.message}</span>
          <button
            onClick={() => {
              toastStore.toasts = toastStore.toasts.filter((x) => x.id !== t.id);
              toastStore.listeners.forEach((listener) => listener(toastStore.toasts));
            }}
            className="opacity-70 hover:opacity-100"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
