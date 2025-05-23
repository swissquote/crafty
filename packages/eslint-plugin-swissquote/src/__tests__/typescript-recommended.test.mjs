import test from "node:test";
import { expect } from "expect";
import initSnapshot from "@onigoetz/ntr-expect-snapshot";

import { prepareESLint } from "../../test_utils.js";

initSnapshot(import.meta.url);

const lint = prepareESLint("recommended");

test("Warns on console.log", async t => {
  const result = await lint(
    `
const foo = window;

// Use a TypeScript 3.7 feature to make sure it works
if (foo?.bar?.baz) {
  console.log(foo.bar.baz);
}
`,
    "file.ts"
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(1);
  expect(result.errorCount).toEqual(0);
});

test("Uses sonar plugin", async t => {
  const result = await lint(
    `
/* global openWindow, closeWindow, moveWindowToTheBackground */

function changeWindow(param: number) {
  if (param === 1) {
    openWindow();
  } else if (param === 2) {
    closeWindow();
  } else if (param === 1) {
    // Noncompliant    ^
    moveWindowToTheBackground();
  }
}
`,
    "file.ts"
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(1);
});

test("Works with complex types", async t => {
  const result = await lint(
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
  props: Record<string, unknown>;
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

  ref = node => {
    this.target = getElement(node);
    assignRef(this.target, this.props.innerRef);
  };

  render(trigger) {
    const { trigger } = this.props;
    if (typeof trigger !== "function") {
      return (
        <button type="button" ref={this.ref}>
          {trigger}
        </button>
      );
    }

    return (trigger as triggerFunction)({
      props: { innerRef: this.ref },
      isOpen: this.state.open,
      caret: <span className={this.props.classes("Caret")} />
    });
  }
}
`,
    "Component.tsx"
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(0);
});
