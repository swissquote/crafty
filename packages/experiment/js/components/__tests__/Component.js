import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Component from "../Component";

let container = null;
beforeEach(() => {
  // met en place un élément DOM comme cible de rendu
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // nettoie en sortie de test
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('should be selectable by class "foo"', function() {
  act(() => {
    render(<Component />, container);
  });

  expect(container.querySelectorAll(".foo")).toHaveLength(1);
});

it("should render to static HTML", function() {
  act(() => {
    render(<Component />, container);
  });
  expect(container.textContent).toEqual("Please Click Me");
});

it("simulates click events", () => {
  act(() => {
    render(<Component />, container);
  });

  expect(container.textContent).toEqual("Please Click Me");

  const button = container.querySelector("button");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(container.textContent).toEqual("Clicked");
});
