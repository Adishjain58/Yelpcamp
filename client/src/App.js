import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Styles from "./components/Navbar/style";
import Login from "./components/Login/login";
import CampGround from "./components/Campground/campground";
import Landing from "./components/Landing/landing";
import Campgrounds from "./components/Campgrounds/campgrounds";
import Show from "./components/Campgrounds/show";
import Signup from "./components/Signup/signup";
import Comment from "./components/Comment/commentNew";
import CommentEdit from "./components/Comment/commentEdit";
import CampgroundEdit from "./components/Campground/campgroundEdit";
import notification from "./Services/notifications";
class App extends React.Component {
  render() {
    return (
      <Router>
        <Route
          path={/[^/]/}
          render={props => <Styles {...props} noty={new notification()} />}
        />
        <Route exact path="/" component={Landing} />
        <Route
          exact
          path="/campgrounds/new"
          render={props => <CampGround {...props} noty={new notification()} />}
        />
        <Route exact path="/campgrounds" component={Campgrounds} />
        <Route
          path="/login"
          render={props => <Login {...props} noty={new notification()} />}
        ></Route>
        <Route
          path="/signup"
          render={props => <Signup {...props} noty={new notification()} />}
        />
        <Route
          exact
          path="/campgrounds/:id"
          render={props => <Show {...props} noty={new notification()} />}
        ></Route>
        <Route
          exact
          path="/campgrounds/:id/edit"
          render={props => (
            <CampgroundEdit {...props} noty={new notification()} />
          )}
        ></Route>
        <Route
          exact
          path="/campgrounds/:id/comments/new"
          render={props => <Comment {...props} noty={new notification()} />}
        />
        <Route
          exact
          path="/campgrounds/:id/comments/:commentId/edit"
          render={props => <CommentEdit {...props} noty={new notification()} />}
        />
      </Router>
    );
  }
}

export default App;
