declare global {
  interface Window {
    trackEvent: (action: string, category: string, label: string, value: number) => void;
  }
}

export {};
