"use client";
import { ConsentConfig, ConsentManagerProvider } from "@consentry/next";
import ConsentManager from "@consentry/ui";

const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const gtag = "G-XXXXXXXXXX";

  // Google Analytics pre-configured.
  // Add the gtag above.
  const consentConfig: ConsentConfig = {
    defaults: {
      functional: true,
      performance: false,
      advertising: false,
      social: false,
    },
    scripts: [
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
        <ConsentManager mode="bottom" dark={false} />
        {children}
      </ConsentManagerProvider>
    </>
  );
};

export default ConsentProvider;
