import React from "react";

const userContext = React.createContext({
  user: {},
  updateUser: (newUser: object) => {},
});

export { userContext as UserContext };
