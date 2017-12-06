/* global process */
import React from "react";
import loadable from "react-loadable";

import Loading from "../components/Loading";

const SingleDatePicker = loadable({
  loader: () => import("../components/DatePickers").then(it => it.SingleDatePicker),
  loading: Loading
});

const DateRangePicker = loadable({
  loader: () => import("../components/DatePickers").then(it => it.DateRangePicker),
  loading: Loading
});

// When using Code Splitting, React Hot Loader doesn't work on routes that are split
// By requiring them statically, it ensures React Hot Loader works on them
if (process.env.NODE_ENV === "development") {
  require("../components/DatePickers");
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      focusedInput: null,
      clicked: false
    };
  }
  handleClick = () => {
    this.setState({clicked: true});
  };

  render() {
    return <div>
      <h1>Single</h1>
      <SingleDatePicker
        date={this.state.date} // momentPropTypes.momentObj or null
        onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
        focused={this.state.focused} // PropTypes.bool
        onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
      />

      <p>
        <strong>Date :</strong> { this.state.date && this.state.date.format("LL") }
      </p>

      <h1>Range</h1>
      <DateRangePicker
        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
        onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
      />

      <p>
        <strong>Start:</strong> { this.state.startDate && this.state.startDate.format("LL") } <br />
        <strong>End :</strong> { this.state.endDate && this.state.endDate.format("LL")}
      </p>

      <p>
        <strong>Clicked {this.state.clicked}</strong>
      </p>
    </div>;
  }
}
