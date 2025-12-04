import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={"1013655881021-tcomudqh074u1n5884bkv20oh8hlq682.apps.googleusercontent.com"}>
    <App />
  </GoogleOAuthProvider>
);
