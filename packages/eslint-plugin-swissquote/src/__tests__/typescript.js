/* global describe, it, expect, jest */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(
  require("../formatting"),
  require("../typescript"),
  { parser: require.resolve("@typescript-eslint/parser") }
);

it("Fails on badly formatted TypeScript code", () => {
  const result = lint(
    engine,
    `
module.exports = function initJS  (gulp, config: {}, watchers): string[] {
  const js = config.js,
     jsTasks: string[] = [];

  for (const name in js) {
    if (!js.hasOwnProperty(name)) {
      continue;
      }

    const taskName = \`js_\${name}\`;

    if (!compileWithWebpack(js[name])) {
      gulp.task(taskName, jsTaskES5(gulp, config, watchers, js[name]));
        watchers.add(js[name].watch || js[name].source, taskName);
    }

    jsTasks.push( taskName );
  }

  gulp.task("js", jsTasks);

  return ["js"];
};
`,
    "file.ts"
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(5);
});

it("Works with complex types", () => {
  const result = lint(
    engine,
    `
import * as React from "react";

type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

function assignRef<T>(ref: T, setter: React.Ref<T>) {
  if (!setter || !ref) {
    return;
  }

  if (typeof setter === "function") {
    setter(ref);
    return;
  }

  if (setter.hasOwnProperty("current")) {
    (setter as Writeable<React.RefObject<T>>).current = ref;
    return;
  }

  throw new Error(
    "Your ref must be a function or an object created with React.createRef"
  );
}

export type triggerFunction = (options: {
  isOpen: boolean;
  caret: React.ReactNode;
  props: object;
}) => React.ReactNode;

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: React.Ref<HTMLDivElement>;
}

export interface SplitButtonProps extends Omit<ButtonGroupProps, "innerRef"> {
  other: React.ReactNode;
  open?: boolean;
  trigger: React.ReactNode | triggerFunction;

  /**
   * Ref to get the component
   */
  innerRef?: React.Ref<HTMLElement>;
}

export interface SplitButtonState {
  open?: boolean;
}

export default class SplitButton extends React.Component<
  SplitButtonProps,
  SplitButtonState
> {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open || false
    };
  }

  private target: Element;

  handleRef = node => {
    this.target = getElement(node);
    assignRef(this.target, this.props.innerRef);
  };

  render(trigger) {
    const { trigger } = this.props;
    if (typeof trigger !== "function") {
      return <button innerRef={this.handleRef}>{trigger}</button>;
    }

    return (trigger as triggerFunction)({
      props: { innerRef: this.handleRef },
      isOpen: this.state.open,
      caret: <span className={this.props.classes("Caret")} />
    });
  }
}
`,
    "Component.tsx"
  );

  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(0);
});
