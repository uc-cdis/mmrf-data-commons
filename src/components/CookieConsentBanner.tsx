import React, { JSX } from 'react';
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core';

export const COOKIE_CONSENT_BANNER_TEXT =
  'This site uses cookies and other tracking technologies to assist with navigation, enable feedback, and analyze how the site is used.';

export const COOKIE_CONSENT_PRIVACY_POLICY_URL =
  'https://themmrf.org/privacy-policy/';

const COOKIE_CONSENT_CLOSE_BUTTON_PROPS = {
  'aria-label': 'Close cookie consent banner',
  'data-testid': 'cookie-consent-dismiss',
};

interface CookieConsentBannerProps {
  onAccept: () => void;
  onDismiss: () => void;
}

const CookieConsentBanner = ({
  onAccept,
  onDismiss,
}: CookieConsentBannerProps): JSX.Element => (
  <Modal
    centered
    closeButtonProps={COOKIE_CONSENT_CLOSE_BUTTON_PROPS}
    closeOnClickOutside={false}
    onClose={onDismiss}
    opened
    overlayProps={{
      backgroundOpacity: 0.45,
      blur: 2,
    }}
    padding="lg"
    radius="md"
    shadow="xl"
    size="lg"
    title="Cookies and tracking"
    withCloseButton
    data-testid="cookie-consent-banner"
    classNames={{
      header:
        'border-b-4 border-primary bg-base-max px-6 py-4 text-base-contrast-max',
      title: 'font-heading text-lg font-semibold text-base-contrast-max',
      body: 'bg-base-max px-6 py-5',
      content: 'border border-base-lighter bg-base-max',
      close:
        'text-base-contrast-max hover:bg-base-lightest focus-visible:outline-primary',
    }}
    zIndex={500}
  >
    <Stack gap="lg">
      <Text size="sm" className="leading-6 text-base-contrast-max">
        {COOKIE_CONSENT_BANNER_TEXT}
      </Text>
      <Group gap="sm" justify="flex-end">
        <Button data-testid="cookie-consent-accept" color="primary" onClick={onAccept}>
          Ok
        </Button>
        <Button
          data-testid="cookie-consent-privacy"
          component="a"
          href={COOKIE_CONSENT_PRIVACY_POLICY_URL}
          rel="noopener noreferrer"
          target="_blank"
          variant="default"
        >
          Privacy policy
        </Button>
      </Group>
    </Stack>
  </Modal>
);

export default CookieConsentBanner;
