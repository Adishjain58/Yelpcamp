import React from "react";
import axios from "axios"
import { BrowserRouter as Router, Route } from "react-router-dom";
import Styles from "./components/Navbar/style";
import Login from "./components/Login/login";
import CampGround from "./components/Campground/campground";
import Landing from "./components/Landing/landing";
import Campgrounds from "./components/Campgrounds/campgrounds";
import Show from "./components/Campgrounds/show";
import Signup from "./components/Signup/signup";
// import Comment from "./components/Comment/commentNew";
// import CommentEdit from "./components/Comment/commentEdit";
import CampgroundEdit from "./components/Campground/campgroundEdit";
import RedirectIfAuth from "./components/RedirectIfAuth/redirectIfAuth";
import RedirectIfNotAuth from "./components/RedirectIfNotAuth/RedirectIfNotAuth";

class App extends React.Component {
  componentDidMount = () => {
    axios.get("/checkLogin").catch(err=>{
      if(err.response.status===401){
        if (localStorage.getItem("user")) {
          localStorage.removeItem("user");
          this.props.history.push("/");
        }
      }
    })
  };
  render() {
    return (
      <Router>
        <Route
          path={/[^/]/}
          render={props => <Styles {...props} noty={this.props.noty} />}
        />
        <Route exact path="/" component={Landing} />
        {/* <Route
          exact
          path="/campgrounds/new"
          render={props => <CampGround {...props} noty={this.props.noty} />}
        /> */}
        <RedirectIfNotAuth
          exact
          path="/ui/campgrounds/create/new"
          component={CampGround}
          props={{ noty: this.props.noty }}
        ></RedirectIfNotAuth>
        <Route exact path="/ui/campgrounds" component={Campgrounds} />
        {/* <Route
          path="/login"
          render={props => <Login {...props} noty={this.props.noty} />}
        ></Route> */}
        <RedirectIfAuth
          path="/ui/login"
          component={Login}
          props={{ noty: this.props.noty }}
        ></RedirectIfAuth>
        {/* <Route
          path="/signup"
          render={props => <Signup {...props} noty={this.props.noty} />}
        /> */}
        <RedirectIfAuth
          path="/ui/signup"
          component={Signup}
          props={{ noty: this.props.noty }}
        ></RedirectIfAuth>
        <Route
          exact
          path="/ui/campgrounds/:id"
          render={props => <Show {...props} noty={this.props.noty} />}
        ></Route>
        <Route
          exact
          path="/ui/campgrounds/:id/edit"
          render={props => <CampgroundEdit {...props} noty={this.props.noty} />}
        ></Route>
        {/* <RedirectIfNotAuth
          exact
          path="/campgrounds/:id/comments/new"
          component={Comment}
          props={{ noty: this.props.noty }}
        ></RedirectIfNotAuth> */}
        {/* <Route
          exact
          path="/campgrounds/:id/comments/new"
          render={props => <Comment {...props} noty={this.props.noty} />}
        /> */}
        {/* <RedirectIfNotAuth
          exact
          path="/campgrounds/:id/comments/:commentId/edit"
          component={CommentEdit}
          props={{ noty: this.props.noty }}
        ></RedirectIfNotAuth> */}
        {/* <Route
          exact
          path="/campgrounds/:id/comments/:commentId/edit"
          render={props => <CommentEdit {...props} noty={this.props.noty} />}
        /> */}
      </Router>
    );
  }
}

export default App;
