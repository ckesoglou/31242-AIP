// import React from "react";
// import { shallow, mount } from "enzyme";

// import SignUp from "./signup";
// import { MemoryRouter, Route } from "react-router-dom";

// const testProps = {
//   history: {} as any,
//   location: {} as any,
//   match: {} as any,
// };

// describe("SignUp", () => {
//   it("should render correctly", () => {
//     const component = shallow(
//       <SignUp
//         history={testProps.history}
//         location={testProps.location}
//         match={testProps.match}
//       />
//     );

//     expect(component).toMatchSnapshot();
//   });

//   it("navigates to next page for successful sign up", () => {
//     const wrapper = mount(
//       <MemoryRouter initialEntries={["/signup"]}>
//         <Route path="/signup" component={SignUp} />
//         <Route path="/home">
//           <h1>Hello</h1>
//         </Route>
//       </MemoryRouter>
//     );

//     let signUpComponent = wrapper.find("SignUp");
//     signUpComponent.setState({
//       username: "",
//       display_name: "",
//       password: "",
//       error: "",
//       successfulSignUp: true,
//     });

//     // @ts-ignore
//     expect(wrapper.find("Router").prop("history").location.pathname).toEqual(
//       "/home"
//     );
//   });

//   it("should handle sign up if button is clicked", () => {
//     const spy = jest.spyOn(SignUp.prototype, "handleSignUp");
//     const wrapper = mount(
//       <SignUp
//         history={testProps.history}
//         location={testProps.location}
//         match={testProps.match}
//       />
//     );

//     wrapper.find("button").simulate("click");

//     expect(spy).toHaveBeenCalledTimes(1);
//   });
// });
