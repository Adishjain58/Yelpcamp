import React, { Component, Fragment } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import spinner from "../../lg.rotating-balls-spinner.gif";
import { TextField, Container, Button } from "@material-ui/core";

class commentEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      loading: false
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    Axios.get(
      `/campgrounds/${this.props.match.params.id}/comments/${this.props.match.params.commentId}/edit`
    )
      .then(comment => {
        this.setState({
          text: comment.data.text,
          loading: false
        });
      })
      .catch(err => {
        console.log(err.reponse);
      });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  editComment = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const comment = {
      text: this.state.text
    };
    Axios.put(
      `/campgrounds/${this.props.match.params.id}/comments/${this.props.match.params.commentId}`,
      comment
    )
      .then(comment => {
        this.setState({
          loading: false
        });
        this.props.noty.success("Comment updated successfully");
        this.props.history.push(`/campgrounds/${this.props.match.params.id}`);
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
            <h1 className=" text-center mt-5">Edit Comment</h1>
            <form className="col-12" action="" onSubmit={this.editComment}>
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
              <Button
                fullWidth
                type="submit"
                variant="outlined"
                color="primary"
                className="mb-4"
              >
                <i className="fa fa-paper-plane" />
                &nbsp;Submit
              </Button>
            </form>
            <Link to={`/campgrounds/${this.props.match.params.id}`}>
              Go Back
            </Link>
          </Container>
        )}
      </Fragment>
    );
  }
}

export default commentEdit;
