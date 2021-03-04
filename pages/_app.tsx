import { AppProps } from 'next/app'
import '../styles/globals.css'  

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