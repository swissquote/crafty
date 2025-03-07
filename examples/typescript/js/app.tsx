import React from "react";
import { createRoot } from "react-dom/client";

import App from "./containers/App";
import "../css/overrides.scss";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
