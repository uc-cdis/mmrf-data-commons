import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import TopNavigation from '@/components/Navigation/TopNavigation';
import Footer from '@/components/Navigation/Footer';
import mantinetheme from '../mantineTheme';
import MainNavigation from '@/components/Navigation/MainNavigation';

export default function Document() {
  return (
    <Html lang="en" {...mantineHtmlProps}>
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body className="flex flex-col min-h-screen">
        <MantineProvider theme={mantinetheme}>
          <main id="main-content" className="flex-grow">
            <Main />
          </main>
          <Footer />
          <NextScript />
        </MantineProvider>
      </body>
    </Html>
  );
}
