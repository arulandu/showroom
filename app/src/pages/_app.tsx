import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext } from 'react';
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/components/ToastProvider';

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </SessionProvider>
  );
}
export default MyApp
