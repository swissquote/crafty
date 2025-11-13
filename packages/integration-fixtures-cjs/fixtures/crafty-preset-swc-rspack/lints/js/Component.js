/* global React */

export default class MyComponent extends React.Component {

  handleClick = () => {
    this.setState({hey: true
    });
  };

  render()
  {
    return  <div onClick={this.handleClick}>Hey {this.state.hey}</div>;
  }
}
