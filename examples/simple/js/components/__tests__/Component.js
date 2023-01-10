import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import Component from "../Component";

let container = null;
let root = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);

  root = createRoot(container)
});

afterEach(() => {
  act(() => {
    root.unmount();
  });

  container.remove();
  container = null;
  root = null;
});

it('should be selectable by button type', function() {
  act(() => {
    root.render(<Component />);
  });

  expect(container.querySelectorAll("button")).toHaveLength(1);
});

it("should render to static HTML", function() {
  act(() => {
    root.render(<Component />);
  });
  expect(container.textContent).toEqual("Please Click Me");
});

it("simulates click events", () => {
  act(() => {
    root.render(<Component />);
  });

  expect(container.textContent).toEqual("Please Click Me");

  const button = container.querySelector("button");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(container.textContent).toEqual("Clicked");
});
