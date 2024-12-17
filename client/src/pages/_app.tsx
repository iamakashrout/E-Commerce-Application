// import "@/styles/globals.css";
// import type { AppProps } from "next/app";

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }

import { Provider } from 'react-redux';
import {store} from '../redux/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
