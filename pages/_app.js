import "@/styles/globals.css";
import { Fragment } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />;
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={true}
        rtl={true}
        pauseOnHover
        theme="dark"
      />
    </Fragment>
  );
}
