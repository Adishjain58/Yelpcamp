import React, { Component } from "react";
import { TextField, TextareaAutosize } from "@material-ui/core";
import Axios from "axios";
import spinner from "../../lg.rotating-balls-spinner.gif";

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
      updatedName: "",
      loading: false
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    Axios.get(`/campgrounds/${this.props.match.params.id}"/edit`)
      .then(camp => {
        this.setState({
          updatedName: camp.data.name,
          name: camp.data.name,
          description: camp.data.description,
          price: camp.data.price,
          hidden: camp.data.image,
          loading: false
        });
      })
      .catch(err => {
        this.props.noty.error(err.response.data.err);
        this.props.history.push("/login");
      });
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
    let ext;
    if (this.state.file) {
      ext = this.state.file.name
        .substring(this.state.file.name.indexOf("."))
        .toLowerCase();
    } else {
      ext = this.state.hidden
        .substring(this.state.hidden.indexOf("."))
        .toLowerCase();
    }
    if (ext.match(/(.jpg)|(.jpeg)|(.png)|(gif)/)) {
      this.setState({
        loading: true
      });
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
          this.setState({
            loading: false
          });
          this.props.noty.success("Campground updated successfully");
          this.props.history.push(`/campgrounds`);
        })
        .catch(err => {
          this.setState({
            loading: false
          });
          this.props.noty.error(err.response.data.message);
        });
    } else {
      this.props.noty.error("This is not a supported image format");
    }
  };

  render() {
    return (
      <div className="container">
        {this.state.loading ? (
          <div className="text-center mt-5">
            <img src={spinner} alt="" />
          </div>
        ) : (
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

                <TextField
                  className="mt-5 mb-4"
                  id="outlined-basic"
                  label="Enter Name Of Camp"
                  variant="outlined"
                  name="updatedName"
                  value={this.state.updatedName}
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
                  step="0.1"
                  fullWidth
                  required
                />
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="checkbox"
                      id="check"
                      onChange={this.checkChecked}
                    />{" "}
                    Want to change image?
                  </label>
                </div>

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

                <TextareaAutosize
                  className="form-control mb-3"
                  rows="5"
                  rowsMax="6"
                  name="description"
                  label="Enter Description"
                  placeholder="Enter Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  required
                ></TextareaAutosize>
                <div className="form-group">
                  <button className="btn btn-outline-primary btn-block">
                    <i className="fa fa-paper-plane" /> Submit
                  </button>
                </div>
              </form>
              <a href="/campgrounds/<%=camp._id%>">Go Back</a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default campgroundEdit;
