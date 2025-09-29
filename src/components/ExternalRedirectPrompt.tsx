import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';

export const ExternalRedirectPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect if opened from external app
    const isFromExternalApp = () => {
      const userAgent = navigator.userAgent;
      const referrer = document.referrer;
      
      // Check if opened from Facebook, Messenger, WhatsApp, Instagram, etc.
      const externalAppPatterns = [
        /FBAN|FBAV/i, // Facebook App
        /Instagram/i, // Instagram
        /WhatsApp/i,  // WhatsApp
        /Line/i,      // Line
        /Telegram/i,  // Telegram
      ];
      
      const isExternalApp = externalAppPatterns.some(pattern => pattern.test(userAgent));
      const isFromSocialMedia = referrer && (
        referrer.includes('facebook.com') ||
        referrer.includes('instagram.com') ||
        referrer.includes('wa.me') ||
        referrer.includes('t.me')
      );
      
      return isExternalApp || isFromSocialMedia;
    };

    // Check if not running as PWA and is from external app
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebView = userAgent => /WebView|Android.*Version\/\d/i.test(userAgent);
    
    if (!isPWA && (isFromExternalApp() || isInWebView(navigator.userAgent))) {
      setShowPrompt(true);
    }
  }, []);

  const openInChrome = () => {
    const currentUrl = window.location.href;
    const chromeIntent = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
    
    // Try Chrome intent first (Android)
    window.location.href = chromeIntent;
    
    // Fallback to regular URL after a delay
    setTimeout(() => {
      window.open(currentUrl, '_blank');
    }, 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">সেরা অভিজ্ঞতার জন্য Chrome-এ খুলুন</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={openInChrome}
            variant="secondary"
            size="sm"
            className="bg-white/20 text-white hover:bg-white/30 border-white/30"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open in Chrome
          </Button>
          <Button
            onClick={() => setShowPrompt(false)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};