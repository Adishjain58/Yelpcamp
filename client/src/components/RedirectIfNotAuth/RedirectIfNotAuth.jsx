import React from "react";
import { Route, Redirect } from "react-router-dom";
const RedirectIfNotAuth = ({ path, props, component: Component }) => {
  return (
    <Route
      path={path}
      render={routerProps => {
        if (localStorage.getItem("user")) {
          return <Component {...props} {...routerProps} />;
        }

        return <Redirect to="/login" />;
      }}
    />
  );
};

export default RedirectIfNotAuth;
