import React, { Suspense } from "react";

import Loading from "../components/Loading";
import Counters from "../containers/Counters";
import Component from "../components/Component";

const Tabs = React.lazy(() => import("../components/Tabs"));

const App = () => (
  <div>
    <Suspense fallback={<Loading />}>
      <Tabs />
    </Suspense>

    <h1>Counter</h1>
    <Counters />

    <h1>Component</h1>
    <Component />
  </div>
);

export default App;
