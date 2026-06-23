import { RouterProvider } from "react-router";
import { MotionConfig } from "motion/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <MotionConfig reducedMotion="never" transition={{ duration: 0.3, ease: "easeOut" }}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </MotionConfig>
    </AppProvider>
  );
}