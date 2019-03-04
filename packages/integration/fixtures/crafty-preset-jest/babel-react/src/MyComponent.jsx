import React from "react";

import Foo from "./Foo";

export default function MyComponent({children}) {
    return <>
        <i className="icon-star" />
        <Foo />
        <Foo />
        <Foo />
        {children}
    </>
}