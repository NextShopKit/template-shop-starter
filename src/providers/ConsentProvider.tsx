"use client";
import { ConsentConfig, ConsentManagerProvider } from "@consentry/next";
import ConsentManager from "@consentry/ui";

/**
 * Consent management provider for the NextShopKit starter template
 * Handles GDPR/privacy compliance with cookie consent management
 * Pre-configured for Google Analytics integration
 */
const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const gtag = "G-XXXXXXXXXX"; // Replace with your Google Analytics ID

  /**
   * Consent configuration with default settings
   * Functional cookies enabled by default, others require user consent
   * Includes commented Google Analytics setup for easy activation
   */
  const consentConfig: ConsentConfig = {
    defaults: {
      functional: true, // Essential cookies - always enabled
      performance: false, // Analytics cookies - requires consent
      advertising: false, // Marketing cookies - requires consent
      social: false, // Social media cookies - requires consent
    },
    scripts: [
      // Uncomment and configure these scripts for Google Analytics
      //   {
      //     id: "gtag-js",
      //     category: "functional",
      //     consentRequired: false,
      //     strategy: "afterInteractive",
      //     src: `https://www.googletagmanager.com/gtag/js?id=${gtag}`,
      //   },
      //   {
      //     id: "gtag-init",
      //     category: "functional",
      //     consentRequired: false,
      //     strategy: "afterInteractive",
      //     content: `
      //       window.dataLayer = window.dataLayer || [];
      //       function gtag(){dataLayer.push(arguments);}
      //       gtag('js', new Date());
      //       gtag('config', '${gtag}', { send_page_view: true });
      //       gtag('set', 'ads_data_redaction', true);
      //       gtag('set', 'url_passthrough', true);
      //       gtag('consent', 'default', {
      //         analytics_storage: 'denied',
      //         ad_storage: 'denied',
      //         ad_user_data: 'denied',
      //         ad_personalization: 'denied'
      //       });
      //     `,
      //   },
    ],
  };

  return (
    <>
      <ConsentManagerProvider config={consentConfig}>
        {/* Consent banner UI - positioned at bottom, light theme */}
        <ConsentManager mode="bottom" dark={false} />
        {children}
      </ConsentManagerProvider>
    </>
  );
};

export default ConsentProvider;
