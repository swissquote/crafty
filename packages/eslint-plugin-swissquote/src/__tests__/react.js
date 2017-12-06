/* global describe, it, expect */

const { prepareCLIEngine, lint } = require("../../test_utils");
const engine = prepareCLIEngine(require("../es6"), require("../react"));

function wrap(body) {
  return `
import React from 'react';

export default class MyComponent extends React.Component {
/* eslint no-empty-function: 0, class-methods-use-this: 0 */
${body}
}
`;
}

describe("jsx-no-duplicate-props", () => {
  it("works with different props", () => {
    const result = lint(
      engine,
      `
import * as React from "react";

function SomeComponent() { return <div id="" className="" />;  }
`
    );

    expect(result.messages).toEqual([], "no messages");
    expect(result.warningCount).toBe(0, "no warnings");
    expect(result.errorCount).toBe(0, "no errors");
  });

  it("works fails with the same prop", () => {
    const result = lint(
      engine,
      `
import * as React from "react";

function SomeComponent() { return  <div id="" id="" />;  }
`
    );

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0, "no warnings");
    expect(result.errorCount).toBe(1, "one error");
  });
});

describe("no-did-mount-set-state", () => {
  it("fails with setState in componentDidMount", () => {
    const result = lint(
      engine,
      `${wrap(`
    componentDidMount() {
      this.setState({
        name: this.props.name.toUpperCase()
      });
    }
    render() {
      return <div>Hello {this.state.name}</div>;
    }
    `)}
    MyComponent.propTypes = {
      name: PropTypes.string.isRequired,
    }`
    );

    expect(result.messages).toMatchSnapshot();
    expect(result.warningCount).toBe(0, "no warnings");
    expect(result.errorCount).toBe(1, "no errors");
  });
});
