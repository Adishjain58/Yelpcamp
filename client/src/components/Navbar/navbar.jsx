import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    boxShadow: "none",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  btnStyle: {
    color: "rgba(0, 0, 0, 0.5)",
    textDecoration: "none",
  },
}));

const Navbar = ({ state, logout, props }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getMyCampgrounds = () => {
    Axios.get(
      `/user/${JSON.parse(localStorage.getItem("user"))._id}/userCamps`,
    ).then((camps) => {
      console.log(camps.data, props);
      props.history.push("/");
    });
  };

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
              to="/ui/campgrounds"
              style={{ textDecoration: "none" }}
              className={`ml-3 ${classes.btnStyle}`}
            >
              Campgrounds
            </Link>
          </Typography>

          {!state.user.hasOwnProperty("username") && (
            <Fragment>
              <Link to="/ui/login" style={{ textDecoration: "none" }}>
                <Button className={classes.btnStyle}>Login</Button>
              </Link>
              <Link to="/ui/signup" style={{ textDecoration: "none" }}>
                <Button className={classes.btnStyle}>Signup</Button>
              </Link>
            </Fragment>
          )}
          {state.user.hasOwnProperty("username") && (
            <Fragment>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className={classes.btnStyle}
              >
                Welcome {state.user.username}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={getMyCampgrounds}>My Campgrounds</MenuItem>
                <MenuItem onClick={handleClose}>My Profile</MenuItem>
              </Menu>
              <Button className={classes.btnStyle} onClick={logout}>
                Logout
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Navbar;
