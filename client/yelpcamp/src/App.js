import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Styles from "./components/Navbar/style";
import Login from "./components/Login/login";
import CampGround from "./components/Campground/campground";
import Landing from "./components/Landing/landing";
import Campgrounds from "./components/Campgrounds/campgrounds";
import Show from "./components/Campgrounds/show";
import Signup from "./components/Signup/signup";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentWillMount = () => {
    if (localStorage.getItem("user")) {
      this.setState({
        user: JSON.parse(localStorage.getItem("user")).data
      });
    }
  };

  render() {
    return (
      <Router>
        <Route render={props => <Styles auth={this.state.user} {...props} />} />
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
      </Router>
    );
  }
}

export default App;
