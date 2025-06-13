// pages/_app.tsx
import Head from "next/head";
import '@/styles/globals.css';
import MainLayout from '@/components/Layout/MainLayout';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1462ff"/>
        <link rel="icon" href="/logo-icon.png" />
        <link rel="apple-touch-icon" href="/logo-icon.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

