/* global process, module */
import React from "react";
import loadable from "react-loadable";
import { hot } from "react-hot-loader";

import Loading from "../components/Loading";
import Counters from "../containers/Counters";

const Tabs = loadable({
  loader: () => import("../components/Tabs").then(it => {
    return it.default;
  }),
  loading: Loading
});

const App = () => (
  <div>
    <Tabs />

    <h1>Counter</h1>
    <Counters />
  </div>
);

// React Hot Loader 4 needs this to know declare
// the react tree as hot reloadable
export default hot(module)(App);