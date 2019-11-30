import React, { Component } from "react";
import Navbar from "./navbar";
import axios from "axios";

export default class style extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.auth) {
      this.setState({
        user: this.props.auth
      });
    }
  };

  logout = () => {
    axios.get("/logout").then(() => {
      localStorage.removeItem("user");
      this.setState({
        user: {}
      });
      this.props.history.push("/");
    });
  };

  render() {
    return (
      <div>
        <Navbar user={this.state.user} logout={this.logout}></Navbar>
      </div>
    );
  }
}
