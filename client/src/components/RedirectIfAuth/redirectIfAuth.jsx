import React from "react";
import { Route, Redirect } from "react-router-dom";
const RedirectIfAuth = ({ path, props, component: Component }) => {
  return (
    <Route
      path={path}
      render={routerProps => {
        if (!localStorage.getItem("user")) {
          return <Component {...props} {...routerProps} />;
        }

        return <Redirect to="/" />;
      }}
    />
  );
};

export default RedirectIfAuth;
