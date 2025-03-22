import test from "node:test";
import { expect } from "expect";
import initSnapshot from "@onigoetz/ntr-expect-snapshot";

import { prepareESLint } from "../../test_utils.js";

initSnapshot(import.meta.url);

const lint = prepareESLint("recommended");

test("Warns on console.log", async t => {
  const result = await lint(`console.log("Yeah");\n`);

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(1);
  expect(result.errorCount).toEqual(0);
});

test("Uses sonar plugin", async t => {
  const result = await lint(
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
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(1);
});

test("Works fine with ES6 code", async t => {
  const result = await lint(
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
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(22);
});

test("jsx-no-duplicate-props: works with different props", async t => {
  const result = await lint(
    `
export default function SomeComponent() {
  return <div id="" className="" />;
}
`
  );

  expect(result.messages.length).toEqual(0);
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(0);
});

test("jsx-no-duplicate-props: works fails with the same prop", async t => {
  const result = await lint(
    `
export default function SomeComponent() {
  return <div id="" id="" />;
}
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(1);
  expect(result.errorCount).toEqual(0);
});

test("no-did-mount-set-state: fails with setState in componentDidMount", async t => {
  const alternateLint = prepareESLint("recommended", {
    settings: { react: { version: "16.0.0" } }
  });
  const result = await alternateLint(
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
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(2);
});

test("Incorrect usage of hooks: fails with setState in componentDidMount", async t => {
  const result = await lint(
    `
import { useState, useEffect } from "react";

export default function MyComponent() {
  // 1. Use the name state variable
  const [name, setName] = useState("Mary");

  // 2. Use an effect for persisting the form
  if (name !== null) {
    useEffect(() => {
      localStorage.setItem("formData", name);
    });
  }

  // 3. Use the surname state variable
  const [surname, setSurname] = useState("Poppins");

  // 4. Use an effect for updating the title
  useEffect(() => {
    document.title = \`\${name} \${surname}\`;
  });

  return <div>{name}</div>;
}
`
  );

  expect(result.messages).toMatchSnapshot();
  expect(result.warningCount).toEqual(0);
  expect(result.errorCount).toEqual(3);
});
