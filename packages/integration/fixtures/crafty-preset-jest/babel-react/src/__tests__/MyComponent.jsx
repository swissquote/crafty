import React from "react";
import { createRoot } from "react-dom/client";
import { create, act } from "react-test-renderer";

import Counter from "../Counter";
import MyComponent from "../MyComponent";
import Foo from "../Foo";

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = create(<MyComponent />);
    expect(wrapper.root.findAllByType(Foo)).toHaveLength(3)
  });

  it('renders an `.icon-star`', () => {
    const wrapper = create(<MyComponent />);
    expect(wrapper.root.findByProps({className: 'icon-star'}).type).toEqual("i");
  });

  it('renders children when passed in', () => {
    const wrapper = create((
      <MyComponent>
        <div className="unique" />
      </MyComponent>
    ));
    expect(wrapper.root.findByType(MyComponent).children[4].props).toEqual({className: "unique"});
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
      const root = createRoot(container);
      root.render(<Counter />);
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