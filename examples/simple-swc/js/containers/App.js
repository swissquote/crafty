/* global module */
import React from "react";
import loadable from "react-loadable";

import Loading from "../components/Loading";
import Counters from "../containers/Counters";

const Tabs = loadable({
  loader: () =>
    import("../components/Tabs").then(it => {
      return it.default;
    }),
  loading: Loading
});

export default function App() {
  return (
    <div>
      <Tabs />

      <h1>Counter</h1>
      <Counters />
    </div>
  );
}
