import React from "react";

export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    };
  }

  handleClick = () => {
    this.setState(state => ({ clicked: !state.clicked }));
  };

  render() {
    return (
      <button onClick={this.handleClick} className="foo">
        {this.state.clicked ? "Clicked" : "Please Click Me"}
      </button>
    );
  }
}
