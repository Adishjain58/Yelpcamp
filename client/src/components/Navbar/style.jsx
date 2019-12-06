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

  UNSAFE_componentWillReceiveProps = () => {
    if (localStorage.getItem("user")) {
      this.setState({
        user: JSON.parse(localStorage.getItem("user"))
      });
    } else {
      this.setState({
        user: {}
      });
    }
  };

  componentDidMount = () => {
    if (localStorage.getItem("user")) {
      this.setState({
        user: JSON.parse(localStorage.getItem("user"))
      });
    } else {
      this.setState({
        user: {}
      });
    }
  };

  logout = () => {
    axios.get("/logout").then(() => {
      localStorage.removeItem("user");
      this.setState({
        user: {}
      });
      this.props.noty.success("Logged out successfully");
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
