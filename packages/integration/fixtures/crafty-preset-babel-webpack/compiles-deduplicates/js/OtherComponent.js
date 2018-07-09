/* global React */

export default class OtherComponent extends React.Component {
  handleClick = () => {
    this.setState({hey: true});
  };

  render() {
    return <div onClick={this.handleClick}>Hey {this.state.hey}</div>;
  }
}
