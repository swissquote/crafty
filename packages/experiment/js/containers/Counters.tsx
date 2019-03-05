import * as React from "react";
import Counter from "../components/Counter";

export default function() {
    return <div>
        <Counter increment={5} />
        <Counter increment={1} />
    </div>;
}