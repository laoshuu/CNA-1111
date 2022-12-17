import React from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
import App from "./Containers/App";
import { BrowserRouter } from "react-router-dom";
// import "antd/dist/antd.min.css";
import { ChatProvider } from "./Hooks/useChat";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChatProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChatProvider>
  </React.StrictMode>
);

