import React from "react";
<<<<<<< HEAD
import { render } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
=======
import { shallow, mount } from "enzyme";
import App from "./App";

describe("<App />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<App />);
    
    expect(wrapper).toMatchSnapshot();
  });
>>>>>>> 13584228-login-front-end
});
