import React, { Fragment, Component } from "react";
import { TextField, Container, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post("/login", this.state)
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user.data));
        this.props.noty.success("Logged in Successfully");
        this.props.history.push("/");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Fragment>
        <Container maxWidth="sm" className="mt-5">
          <h1 className="text-center">Login Page</h1>
          <form action="" onSubmit={this.handleSubmit}>
            <TextField
              className="mt-5 mb-4"
              label="Enter Username"
              variant="outlined"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              type="password"
              className=" mb-4"
              label="Enter Password"
              variant="outlined"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              className="p-2"
              onSubmit={this.handleSubmit}
            >
              Submit&nbsp;
              <SendIcon></SendIcon>
            </Button>
          </form>
        </Container>
      </Fragment>
    );
  }
}
