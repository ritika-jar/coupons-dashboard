import { Provider } from "react-redux";
import { store } from "@/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { setCredentials } from "@/store/slices/authSlice";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && accessToken !== 'undefined' && refreshToken && refreshToken !== 'undefined') {
      store.dispatch(setCredentials({ token: accessToken, refreshToken: refreshToken }));
    }
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;