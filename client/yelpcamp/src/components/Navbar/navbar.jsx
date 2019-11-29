import React from "react";
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
  }
}));

const styles = {
  textcolor: "rgba(0, 0, 0, 0.5)",
  textDecoration: "none"
};
export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="sticky"
        style={{ background: "#f8f9fa", color: "black" }}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Yelpcamp
          </Typography>
          <Button className={styles}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </Button>
          <Button className={styles}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Signup
            </Link>
          </Button>
          <Button className={styles}>
            <Link to="/campground/new" style={{ textDecoration: "none" }}>
              Camp
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
