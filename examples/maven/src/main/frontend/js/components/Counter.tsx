import * as React from "react";

interface CounterProps {
  increment: number;
}

interface CounterState {
  count: number;
}

export default class Counter extends React.Component<
  CounterProps,
  CounterState
> {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  tick = () => {
    this.setState(currentState => ({
      count: currentState.count + this.props.increment
    }));
  };

  componentDidMount() {
    setInterval(this.tick, 1000);
  }

  render() {
    return (
      <div>
        <strong>Counter</strong> ({this.props.increment}): {this.state.count}
      </div>
    );
  }
}
