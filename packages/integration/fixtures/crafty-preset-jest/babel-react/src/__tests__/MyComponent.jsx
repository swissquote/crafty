import React from "react";
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom';

import Counter from "../Counter";
import MyComponent from "../MyComponent";

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', async () => {
    render(<MyComponent />);
    expect(await screen.findAllByText("Foo")).toHaveLength(3)
  });

  it('renders an `.icon-star`', async () => {
    render(<MyComponent />);
    expect(await screen.findByTitle("star")).toHaveAttribute('class', 'icon-star');
  });

  it('renders children when passed in', async () => {
    render((
      <MyComponent>
        <div className="unique">Child</div>
      </MyComponent>
    ));
    expect(await screen.findByText("Child")).toHaveAttribute("class", "unique");
  });
});

describe('<Counter />', () => {
  it('can render and update a counter', async () => {
    // Test first render and componentDidMount
    render(<Counter />);

    const label = await screen.findByRole('alert');
    expect(label).toHaveTextContent('You clicked 0 times');
    expect(document.title).toBe('You clicked 0 times');

    // Test second render and componentDidUpdate
    fireEvent.click(screen.getByText('Click me'));

    expect(label).toHaveTextContent('You clicked 1 times');
    expect(document.title).toBe('You clicked 1 times');
  });
})