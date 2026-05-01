import React, { useEffect, JSX } from 'react';
import Script from 'next/script';

export const GA_PLACEHOLDER_LOG_MESSAGE =
  'GA placeholder: consent accepted, analytics would initialize here';

declare global {
  interface Window {
    __mmrfGaPlaceholderLogged?: boolean;
  }
}

interface GoogleAnalyticsLoaderProps {
  enabled: boolean;
  gaMeasurementId?: string;
}

const GoogleAnalyticsLoader = ({
  enabled,
  gaMeasurementId,
}: GoogleAnalyticsLoaderProps): JSX.Element | null => {
  const measurementId = gaMeasurementId?.trim();

  useEffect(() => {
    if (!enabled || measurementId) return;
    if (typeof window === 'undefined' || window.__mmrfGaPlaceholderLogged) return;

    console.log(GA_PLACEHOLDER_LOG_MESSAGE);
    window.__mmrfGaPlaceholderLogged = true;
  }, [enabled, measurementId]);

  if (!enabled || !measurementId) return null;

  return (
    <>
      <Script
        id="google-analytics-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalyticsLoader;
