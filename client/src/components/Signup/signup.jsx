import React, { Fragment, Component } from "react";
import { TextField, Container, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import spinner from "../../lg.rotating-balls-spinner.gif";

export default class signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    this.setState({
      loading: true,
    });
    e.preventDefault();
    axios
      .post("/register", this.state)
      .then((user) => {
        this.setState({
          loading: false,
        });
        this.props.noty.success("Registered Successfully");
        this.props.history.push("/ui/login");
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        this.props.noty.error(err.response.data.message);
      });
  };

  render() {
    return (
      <Fragment>
        {this.state.loading ? (
          <div className="text-center mt-5">
            <img src={spinner} alt="" />
          </div>
        ) : (
          <Container maxWidth="sm" className="mt-5">
            <h1 className="text-center">Signup Page</h1>
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
        )}
      </Fragment>
    );
  }
}
