// Analytics utility functions
export const analytics = {
  // Track custom events
  trackEvent: (action, category, label, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  },

  // Track page views
  trackPageView: (pagePath, pageTitle) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-PJTDK4S87B', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  },

  // Track user engagement
  trackEngagement: (action, details) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'engagement', {
        engagement_action: action,
        engagement_details: details
      });
    }
  },

  // Track downloads or external links
  trackOutboundLink: (url, linkText) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'outbound_link',
        event_label: url,
        transport_type: 'beacon'
      });
    }
  }
};

// Initialize scroll tracking
export const initScrollTracking = () => {
  let maxScrollDepth = 0;
  
  const trackScrollDepth = () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollDepth > maxScrollDepth && scrollDepth <= 100) {
      maxScrollDepth = scrollDepth;
      
      // Track every 25% of scroll
      if (scrollDepth % 25 === 0) {
        analytics.trackEvent('scroll', 'page_depth', `${scrollDepth}%`, scrollDepth);
      }
    }
  };

  document.addEventListener('scroll', trackScrollDepth);
};

// Initialize time tracking
export const initTimeTracking = () => {
  const startTime = Date.now();
  
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (timeOnPage > 5) { // Only track if more than 5 seconds
      analytics.trackEvent('engagement', 'time_on_page', document.title, timeOnPage);
    }
  });
};
