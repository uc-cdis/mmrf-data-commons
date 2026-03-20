import {
  COOKIE_CONSENT_ACCEPTED_KEY,
  COOKIE_CONSENT_SESSION_DISMISSED_KEY,
  acceptCookieConsent,
  dismissCookieConsentForSession,
  getCookieConsentState,
} from './cookieConsent';

describe('cookieConsent utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('returns pending when no consent has been recorded', () => {
    expect(getCookieConsentState()).toBe('pending');
  });

  it('persists accepted consent across visits', () => {
    acceptCookieConsent();

    expect(window.localStorage.getItem(COOKIE_CONSENT_ACCEPTED_KEY)).toBe(
      'accepted',
    );
    expect(getCookieConsentState()).toBe('accepted');
  });

  it('stores dismissals in session storage only', () => {
    dismissCookieConsentForSession();

    expect(
      window.sessionStorage.getItem(COOKIE_CONSENT_SESSION_DISMISSED_KEY),
    ).toBe('true');
    expect(window.localStorage.getItem(COOKIE_CONSENT_ACCEPTED_KEY)).toBeNull();
    expect(getCookieConsentState()).toBe('dismissed');
  });

  it('clears the session dismissal when consent is accepted', () => {
    dismissCookieConsentForSession();

    acceptCookieConsent();

    expect(
      window.sessionStorage.getItem(COOKIE_CONSENT_SESSION_DISMISSED_KEY),
    ).toBeNull();
    expect(getCookieConsentState()).toBe('accepted');
  });
});
