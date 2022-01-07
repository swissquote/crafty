const test = require("ava");

const { prepareESLint, lint } = require("../../test_utils");

const engine = prepareESLint("recommended");

test("Warns on console.log", async t => {
  const result = await lint(engine, `console.log("Yeah");\n`);

  t.snapshot(result.messages);
  t.is(result.warningCount, 1);
  t.is(result.errorCount, 0);
});

test("Uses sonar plugin", async t => {
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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 2);
});

test("Works fine with ES6 code", async t => {
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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 22);
});

test("jsx-no-duplicate-props: works with different props", async t => {
  const result = await lint(
    engine,
    `
import * as React from "react";

export default function SomeComponent() {
  return <div id="" className="" />;
}
`
  );

  t.is(result.messages.length, 0);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 0);
});

test("jsx-no-duplicate-props: works fails with the same prop", async t => {
  const result = await lint(
    engine,
    `
import * as React from "react";

export default function SomeComponent() {
  return <div id="" id="" />;
}
`
  );

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 1);
});

test("no-did-mount-set-state: fails with setState in componentDidMount", async t => {
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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 1);
});

test("Incorrect usage of hooks: fails with setState in componentDidMount", async t => {
  const result = await lint(
    engine,
    `
import React, { useState, useEffect } from "react";

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

  t.snapshot(result.messages);
  t.is(result.warningCount, 0);
  t.is(result.errorCount, 3);
});
