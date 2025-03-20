import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import MainNavigation from '@/components/Navigation/MainNavigation';
import Footer from '@/components/Navigation/Footer/Footer';
import mantinetheme from '../mantineTheme';

export default function Document() {
  return (
    <Html lang="en" {...mantineHtmlProps}>
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body className="flex flex-col min-h-screen">
        <MantineProvider theme={mantinetheme}>
          <MainNavigation />
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
