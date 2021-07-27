import React, { Component, Fragment } from "react";
import {
  TextField,
  Container,
  Button,
  TextareaAutosize,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import axios from "axios";
import spinner from "../../lg.rotating-balls-spinner.gif";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";

export default class campground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: "",
      description: "",
      loading: false,
      imageUrl: "",
      imageAlt: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // To upload image to cloudinary
  uploadImage = (result) => {
    this.setState({
      imageUrl: result.info.secure_url,
      imageAlt: `An image of ${result.info.original_filename}`,
    });
    this.props.noty.success("Image Uploaded Successfully");
  };

  // To submit data to create camp
  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.imageUrl) {
      this.props.noty.error("Please select an image for the camp");
    } else {
      this.setState({
        loading: true,
      });
      axios
        .post("/campgrounds", this.state)
        .then((camp) => {
          console.log(camp);
          this.setState({
            loading: false,
          });
          this.props.noty.success("Campground created successfully");
          this.props.history.push(`/ui/campgrounds`);
        })
        .catch((err) => {
          this.setState({
            loading: false,
          });
          // console.log(err.response.data.message);
          this.props.noty.error(err.response.data.message);
        });
    }
  };

  render() {
    return (
      <Fragment>
        <WidgetLoader />
        {this.state.loading ? (
          <div className="text-center mt-5">
            <img src={spinner} alt="" />
          </div>
        ) : (
          <Container maxWidth="sm" className="mt-5">
            <h1 className="text-center">Create new Camp</h1>
            <form action="">
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
            </form>
            <Widget
              sources={["local", "camera"]} // set the sources available for uploading -> by default
              resourceType={"image"} // optionally set with 'auto', 'image', 'video' or 'raw' -> default = 'auto'
              cloudName={`${process.env.REACT_APP_CLOUD_NAME}`} // your cloudinary account cloud name.
              // Located on https://cloudinary.com/console/
              uploadPreset={`${process.env.REACT_APP_UPLOAD_PRESET}`} // check that an upload preset exists and check mode is signed or unisgned
              buttonText={"Select Image for camp"} // default 'Upload Files'
              style={{
                border: "1px solid green",
                width: "100%",
                background: "none",
                borderRadius: "4px",
                color: "green",
                padding: "18.5px 14px",
                height: "auto",
                marginBottom: "25px",
              }} // inline styling only or style id='cloudinary_upload_button'
              folder={"Yelpcamp"} // set cloudinary folder name to send file
              cropping={false} // set ability to crop images -> default = true
              onSuccess={(result) => {
                this.uploadImage(result);
              }} // add success callback -> returns result
              // onFailure={failureCallBack} // add failure callback -> returns 'response.error' + 'response.result'
              logging={false} // logs will be provided for success and failure messages,
              // set to false for production -> default = true
              customPublicId={"sample"} // set a specific custom public_id.
              // To use the file name as the public_id use 'use_filename={true}' parameter
              eager={"w_400,h_300,c_pad|w_260,h_200,c_crop"} // add eager transformations -> deafult = null
              use_filename={false} // tell Cloudinary to use the original name of the uploaded
              // file as its public ID -> default = true,
            />
            <Button
              type="button"
              variant="outlined"
              color="primary"
              className="p-2"
              onClick={this.handleSubmit}
            >
              Submit&nbsp;
              <SendIcon></SendIcon>
            </Button>
          </Container>
        )}
      </Fragment>
    );
  }
}
