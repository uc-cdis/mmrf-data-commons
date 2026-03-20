export type CookieConsentState = 'pending' | 'accepted' | 'dismissed';

export const COOKIE_CONSENT_ACCEPTED_KEY = 'mmrf-cookie-consent';
export const COOKIE_CONSENT_SESSION_DISMISSED_KEY =
  'mmrf-cookie-consent-dismissed';

const readStorageValue = (
  storage: Storage | undefined,
  key: string,
): string | null => {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

export const getCookieConsentState = (): CookieConsentState => {
  if (typeof window === 'undefined') return 'pending';

  if (
    readStorageValue(window.localStorage, COOKIE_CONSENT_ACCEPTED_KEY) ===
    'accepted'
  ) {
    return 'accepted';
  }

  if (
    readStorageValue(
      window.sessionStorage,
      COOKIE_CONSENT_SESSION_DISMISSED_KEY,
    ) === 'true'
  ) {
    return 'dismissed';
  }

  return 'pending';
};

export const acceptCookieConsent = (): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(COOKIE_CONSENT_ACCEPTED_KEY, 'accepted');
    window.sessionStorage.removeItem(COOKIE_CONSENT_SESSION_DISMISSED_KEY);
  } catch {
    // Ignore storage failures and fall back to in-memory state.
  }
};

export const dismissCookieConsentForSession = (): void => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(
      COOKIE_CONSENT_SESSION_DISMISSED_KEY,
      'true',
    );
  } catch {
    // Ignore storage failures and fall back to in-memory state.
  }
};
