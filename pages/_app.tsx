import { AppProps } from 'next/app'
import '../styles/globals.css'  
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: "https://37fbfa257a5249dca6246014cbcb4353@o544606.ingest.sentry.io/5666054",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

import { AuthProvider } from '../auth';
import 'firebase/auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;