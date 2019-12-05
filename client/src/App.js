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

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path={/[^/]/} render={props => <Styles {...props} />} />
        <Route exact path="/" component={Landing} />
        <Route exact path="/campgrounds/new" component={CampGround} />
        <Route exact path="/campgrounds" component={Campgrounds} />
        <Route path="/login" component={Login}></Route>
        <Route path="/signup" component={Signup} />
        <Route
          exact
          path="/campgrounds/:id"
          render={props => <Show {...props} />}
        ></Route>
        <Route path="/campgrounds/:id/comments/new" component={Comment} />
        <Route
          path="/campgrounds/:id/comments/:commentId/edit"
          component={CommentEdit}
        />
      </Router>
    );
  }
}

export default App;
