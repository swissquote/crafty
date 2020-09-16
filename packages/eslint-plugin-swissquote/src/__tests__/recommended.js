/* global describe, it, expect */

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("recommended");

it("Warns on console.log", async () => {
  const result = await lint(engine, `console.log("Yeah");\n`);

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(1);
  expect(result.errorCount).toBe(0);
});

it("Uses sonar plugin", async () => {
  const result = await lint(
    engine,
    `
/* global openWindow, closeWindow, moveWindowToTheBackground */

function changeWindow(param) {
  if (param === 1) {
    openWindow();
  } else if (param === 2) {
    closeWindow();
  } else if (param === 1) {
    // Noncompliant    ^
    moveWindowToTheBackground();
  }
}
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(2);
});

it("Works fine with ES6 code", async () => {
  const result = await lint(
    engine,
    `
class SkinnedMesh extends THREE.Mesh {
  constructor(geometry, materials) {
    super(geometry, materials);

    this.idMatrix = SkinnedMesh.defaultMatrix();
    this.bones = [];
    this.boneMatrices = [];
    //...
  }
  update(camera) {
    //...
    super.update();
  }
  get boneCount() {
    return this.bones.length;
  }
  set matrixType(matrixType) {
    this.idMatrix = SkinnedMesh[matrixType]();
  }
  static defaultMatrix() {
    return new THREE.Matrix4();
  }
}

const { op: a, lhs: { op: b }, rhs: c } = getASTNode();

const someString = \`In JavaScript this is
    not legal.\`;

const obj = {
    // __proto__
    __proto__: theProtoObj,
    // Shorthand for ‘someString: someString’
    someString,
    // Methods
    toString() {
     // Super calls
     return \`d \${  super.toString()}\`;
    },
    // Computed (dynamic) property names
    [\`prop_\${(() => 42)()}\`]: 42
};

`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toBe(0);
  expect(result.errorCount).toBe(22);
});

describe("jsx-no-duplicate-props", () => {
  it("works with different props", async () => {
    const result = await lint(
      engine,
      `
import * as React from "react";

export default function SomeComponent() {
  return <div id="" className="" />;
}
`
    );

    expect(result.messages).toEqual([], "no messages expected");
    expect(result.warningCount).toBe(0, "no warnings expected");
    expect(result.errorCount).toBe(0, "no errors expected");
  });

  it("works fails with the same prop", async () => {
    const result = await lint(
      engine,
      `
import * as React from "react";

export default function SomeComponent() {
  return <div id="" id="" />;
}
`
    );

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0, "no warnings expectec");
    expect(result.errorCount).toBe(1, "one error expected");
  });
});

describe("no-did-mount-set-state", () => {
  it("fails with setState in componentDidMount", async () => {
    const result = await lint(
      engine,
      `
import React from "react";
import PropTypes from "prop-types";

export default class MyComponent extends React.Component {
  componentDidMount() {
    this.setState({
      name: this.props.name.toUpperCase()
    });
  }
  render() {
    return <div>Hello {this.state.name}</div>;
  }
}

MyComponent.propTypes = {
  name: PropTypes.string.isRequired
};
`
    );

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0, "no warnings expected");
    expect(result.errorCount).toBe(1, "one errir expected");
  });
});
