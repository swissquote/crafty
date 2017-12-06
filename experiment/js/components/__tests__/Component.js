import React from "react";
import { shallow, mount, render } from "enzyme";

import Component from "../Component";

it('should be selectable by class "foo"', function() {
  expect(shallow(<Component />).is(".foo")).toBe(true);
});

it("should mount in a full DOM", function() {
  expect(mount(<Component />).find(".foo").length).toBe(1);
});

it("should render to static HTML", function() {
  expect(render(<Component />).text()).toEqual("Hey");
});

it("simulates click events", () => {
  const wrapper = mount(<Component />);

  expect(wrapper.state().clicked).toBe(false);

  wrapper.find("div").simulate("click");

  expect(wrapper.state().clicked).toBe(true);
});
