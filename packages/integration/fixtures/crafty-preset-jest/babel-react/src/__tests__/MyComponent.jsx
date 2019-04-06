import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";

import Counter from "../Counter";
import MyComponent from "../MyComponent";
import Foo from "../Foo";

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find(Foo)).toHaveLength(3)
  });

  it('renders an `.icon-star`', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('.icon-star')).toHaveLength(1)
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <MyComponent>
        <div className="unique" />
      </MyComponent>
    ));
    expect(wrapper.contains(<div className="unique" />)).toEqual(true);
  });
});

describe('<Counter />', () => {
  let container;
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });
  
  it('can render and update a counter', () => {
    // Test first render and componentDidMount
    act(() => {
      ReactDOM.render(<Counter />, container);
    });
    const button = container.querySelector('button');
    const label = container.querySelector('p');
    expect(label.textContent).toBe('You clicked 0 times');
    expect(document.title).toBe('You clicked 0 times');
  
    // Test second render and componentDidUpdate
    act(() => {
      button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
    expect(label.textContent).toBe('You clicked 1 times');
    expect(document.title).toBe('You clicked 1 times');
  });
})