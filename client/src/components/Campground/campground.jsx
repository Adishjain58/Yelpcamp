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
      file: null,
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
      file: e.target.files[0]
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const ext = this.state.file.name
      .substring(this.state.file.name.indexOf("."))
      .toLowerCase();
    if (ext.match(/(.jpg)|(.jpeg)|(.png)|(gif)/)) {
      const formData = new FormData();
      formData.append("myImage", this.state.file);
      formData.append("name", this.state.name);
      formData.append("price", this.state.price);
      formData.append("description", this.state.description);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios
        .post("/campgrounds", formData, config)
        .then(camp => {
          this.props.noty.success("Campground created successfully");
          this.props.history.push(`/campgrounds`);
        })
        .catch(err => {
          // console.log(err.response.data.message);
          this.props.noty.error(err.response.data.message);
        });
    } else {
      this.props.noty.error("This is not a supported image format");
    }
  };

  render() {
    return (
      <Fragment>
        <Container maxWidth="sm" className="mt-5">
          <h1 className="text-center">Create new Camp</h1>
          <form action="" onSubmit={this.handleSubmit}>
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
              accept="image/*"
              className=" mb-4"
              id="outlined-basic"
              variant="outlined"
              name="myImage"
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
