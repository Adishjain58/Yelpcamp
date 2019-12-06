import React, { Component, Fragment } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";
import { Container, TextField } from "@material-ui/core";

class commentNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      camp: {},
      text: "",
      loading: false
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    Axios.get(`/campgrounds/${this.props.match.params.id}`).then(camp => {
      this.setState({
        camp: camp.data,
        loading: false
      });
    });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const comment = {
      text: this.state.text
    };
    Axios.post(`/campgrounds/${this.state.camp._id}/comments`, comment)
      .then(comment => {
        this.setState({
          loading: false
        });
        this.props.noty.success("Comment added successfully");
        this.props.history.push(`/campgrounds/${this.state.camp._id}`);
      })
      .catch(err => console.log(err));
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
            <h1 className="col-12 text-center mt-5">
              ADD new Comment to {this.state.camp.name}
            </h1>
            <form className="col-12" onSubmit={this.handleSubmit}>
              <TextField
                className="mt-5 mb-4"
                id="outlined-basic"
                label="Enter Text for comment"
                variant="outlined"
                name="text"
                value={this.state.text}
                onChange={this.handleChange}
                fullWidth
                required
              />
              <button
                type="submit"
                className="btn btn-outline-primary btn-block mb-4"
              >
                <i className="fa fa-paper-plane" /> Submit
              </button>
            </form>
            <Link to={`/campgrounds/${this.state.camp._id}`}>Go Back</Link>
          </Container>
        )}
      </Fragment>
    );
  }
}

export default commentNew;
