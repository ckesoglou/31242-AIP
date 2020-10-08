import React from "react";
import { Route, Redirect } from "react-router-dom";

// kudos to https://codesandbox.io/s/react-router-redirects-typescript-ozv7n?autoresize=1&fontsize=14&view=editor&file=/src/index.tsx:762-774
const ProtectedRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        Authentication.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

// mock authentication - this should be an api call to check whether cookie exists - this should be in another file too i think
const Authentication = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    this.isAuthenticated = true;
    setTimeout(cb, 3000); // fake async
  },
  signout(cb: () => void) {
    this.isAuthenticated = false;
    setTimeout(cb, 3000);
  },
};

export { Authentication, ProtectedRoute };
