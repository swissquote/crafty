import React from "react";
import ReactDOM from "react-dom";

import App from "./containers/App";

import "../css/overrides.scss";

// TODO :: switch to createRoot : https://reactjs.org/link/switch-to-createroot
ReactDOM.render(<App />, document.getElementById("root"));
