import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    boxShadow: "none"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  btnStyle: {
    color: "rgba(0, 0, 0, 0.5)",
    textDecoration: "none"
  }
}));

export default function Navbar({ user, logout }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar
        position="sticky"
        style={{ background: "#f8f9fa", color: "black" }}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ textDecoration: "none" }}>
              Yelpcamp
            </Link>
            <Link
              to="/campgrounds"
              style={{ textDecoration: "none" }}
              className={`ml-3 ${classes.btnStyle}`}
            >
              Campgrounds
            </Link>
          </Typography>

          {!user.hasOwnProperty("username") && (
            <Fragment>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button className={classes.btnStyle}>Login</Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button className={classes.btnStyle}>Signup</Button>
              </Link>
            </Fragment>
          )}
          {user.hasOwnProperty("username") && (
            <Fragment>
              <Button className={classes.btnStyle}>
                Welcome {user.username}
              </Button>

              <Button className={classes.btnStyle} onClick={logout}>
                Logout
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
