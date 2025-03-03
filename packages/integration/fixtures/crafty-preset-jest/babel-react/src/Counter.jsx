import React from "react";

export default class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {count: 0};
      this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
      document.title = `You clicked ${this.state.count} times`;
    }
    componentDidUpdate() {
      document.title = `You clicked ${this.state.count} times`;
    }
    handleClick() {
      this.setState(state => ({
        count: state.count + 1,
      }));
    }
    render() {
      return (
        <div>
          <p role="alert">You clicked {this.state.count} times</p>
          <button onClick={this.handleClick}>
            Click me
          </button>
        </div>
      );
    }
  }