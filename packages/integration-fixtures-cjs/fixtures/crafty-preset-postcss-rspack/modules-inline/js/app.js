import "../css/style";
import * as style from "../css/app.module.css";

export default function app() {
    console.log(style.app);

    import(/* webpackChunkName: "subapp" */ "./subapp");
}
