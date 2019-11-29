import React, { Component, Fragment } from "react";
import {
  TextField,
  Container,
  Button,
  TextareaAutosize
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";

export default class campground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: "",
      image: "",
      description: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleImage = e => {
    this.setState({
      image: e.target.files[0]
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    console.log(this.state);
    axios
      .post("/campgrounds", this.state)
      .then(camp => console.log(camp))
      .catch(err => console.log(err));
  };
  render() {
    return (
      <Fragment>
        <Container maxWidth="sm" className="mt-5">
          <h1 className="text-center">Create new Camp</h1>
          <form
            action=""
            onSubmit={this.handleSubmit}
            encType="multipart/form-data"
          >
            <TextField
              className="mt-5 mb-4"
              id="outlined-basic"
              label="Enter Name Of Camp"
              variant="outlined"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              fullWidth
              required
            />
            <TextField
              type="number"
              className=" mb-4"
              id="outlined-basic"
              label="Enter Price"
              variant="outlined"
              name="price"
              value={this.state.price}
              onChange={this.handleChange}
              min="0.4"
              fullWidth
              required
            />
            <TextField
              type="file"
              className=" mb-4"
              id="outlined-basic"
              variant="outlined"
              name="image"
              onChange={this.handleImage}
              min="0.4"
              fullWidth
              required
            />
            <TextareaAutosize
              className="form-control mb-3"
              rows="5"
              rowsMax="6"
              name="description"
              placeholder="Enter Description"
              value={this.state.description}
              onChange={this.handleChange}
              required
            ></TextareaAutosize>
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
