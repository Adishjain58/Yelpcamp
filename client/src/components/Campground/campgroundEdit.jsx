import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import Axios from "axios";

class campgroundEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: "",
      file: null,
      hidden: "",
      checked: false,
      updatedName: ""
    };
  }

  componentDidMount = () => {
    Axios.get(`/campgrounds/${this.props.match.params.id}"/edit`)
      .then(camp => {
        console.log(camp);
        this.setState({
          updatedName: camp.data.name,
          name: camp.data.name,
          description: camp.data.description,
          price: camp.data.price,
          hidden: camp.data.image
        });
      })
      .catch(err => console.log(err));
  };

  checkChecked = e => {
    if (e.target.checked) {
      this.setState({
        checked: true
      });
    } else {
      this.setState({
        checked: false
      });
    }
  };

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

    const formData = new FormData();

    formData.append("myImage", this.state.file);
    formData.append("hidden", this.state.hidden);
    formData.append("name", this.state.updatedName);
    formData.append("price", this.state.price);
    formData.append("description", this.state.description);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    Axios.put(`/campgrounds/${this.props.match.params.id}`, formData, config)
      .then(camp => {
        this.props.noty.success("Campground updated successfully");
        this.props.history.push(`/campgrounds`);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <h1 className="col-12 text-center mt-5">
            Editing CampGround {this.state.name}
          </h1>
          <div style={{ width: "30%", margin: "20px auto" }}>
            <form className="col-12" action="" onSubmit={this.handleSubmit}>
              <input
                type="hidden"
                name="hidden"
                id="hidden"
                defaultValue={this.state.hidden}
              />
              <div className="form-group">
                <label htmlFor="name">Enter name of Camp</label>
                <input
                  type="text"
                  name="updatedName"
                  defaultValue={this.state.updatedName}
                  id="name"
                  className="form-control"
                  placeholder="Name"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Enter Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="form-control"
                  placeholder="Price"
                  onChange={this.handleChange}
                  defaultValue={this.state.price}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor>
                  <input
                    type="checkbox"
                    name
                    id="check"
                    onChange={this.checkChecked}
                  />{" "}
                  Want to change image?
                </label>
              </div>
              <label htmlFor="inputGroupFile01">Select Image</label>

              <TextField
                type="file"
                className=" mb-4"
                id="outlined-basic"
                variant="outlined"
                name="myImage"
                onChange={this.handleImage}
                disabled={!this.state.checked}
                required={this.state.checked}
                min="0.4"
                fullWidth
              />

              <div className="form-group">
                <label htmlFor="description">Enter Description</label>
                <textarea
                  name="description"
                  id="description"
                  onChange={this.handleChange}
                  placeholder="Enter description"
                  cols={30}
                  rows={10}
                  className="form-control"
                  required
                  defaultValue={this.state.description}
                />
              </div>
              <div className="form-group">
                <button className="btn btn-outline-primary btn-block">
                  <i className="fa fa-paper-plane" /> Submit
                </button>
              </div>
            </form>
            <a href="/campgrounds/<%=camp._id%>">Go Back</a>
          </div>
        </div>
      </div>
    );
  }
}

export default campgroundEdit;
