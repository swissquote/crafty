import React from "react";

export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    };
  }
  handleClick = () => {
    this.setState({ clicked: true });
  };

  render() {
    return (
      <div onClick={this.handleClick} className="foo">
        Hey
      </div>
    );
  }
}
