import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'test-utils';
import CookieConsentBanner, {
  COOKIE_CONSENT_BANNER_TEXT,
  COOKIE_CONSENT_PRIVACY_POLICY_URL,
} from './CookieConsentBanner';

const CookieConsentHarness = (): JSX.Element => {
  const [consentState, setConsentState] = useState<
    'pending' | 'accepted' | 'dismissed'
  >('pending');

  return (
    <MantineProvider>
      {consentState === 'pending' ? (
        <CookieConsentBanner
          onAccept={() => setConsentState('accepted')}
          onDismiss={() => setConsentState('dismissed')}
        />
      ) : (
        <span data-testid="cookie-consent-state">{consentState}</span>
      )}
    </MantineProvider>
  );
};

describe('<CookieConsentBanner />', () => {
  it('renders the consent copy and privacy policy link', () => {
    render(<CookieConsentHarness />);

    expect(screen.getByTestId('cookie-consent-banner')).toBeInTheDocument();
    expect(screen.getByText(COOKIE_CONSENT_BANNER_TEXT)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute(
      'href',
      COOKIE_CONSENT_PRIVACY_POLICY_URL,
    );
  });

  it('hides the banner after clicking Ok', async () => {
    render(<CookieConsentHarness />);

    await userEvent.click(screen.getByRole('button', { name: 'Ok' }));

    expect(screen.queryByTestId('cookie-consent-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('cookie-consent-state')).toHaveTextContent(
      'accepted',
    );
  });

  it('hides the banner for the session after clicking close', async () => {
    render(<CookieConsentHarness />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Close cookie consent banner' }),
    );

    expect(screen.queryByTestId('cookie-consent-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('cookie-consent-state')).toHaveTextContent(
      'dismissed',
    );
  });
});
