import React, { Component } from "react";
import {
  FormControl,
  Select,
  TextField,
  InputLabel,
  Button,
  CssBaseline,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { addRecommendation } from "../state/actions";
import { connect } from "react-redux";

class RecommendationForm extends Component {
  state = {
    title: "",
    type: "",
    additionalNotes: "",
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Card variant="outlined">
          <CardContent>
            <TextField
              inputProps={{
                name: "title",
                id: "title",
              }}
              id="title"
              label="Title"
              placeholder="enter title..."
              variant="outlined"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <br />
            <br />
            <FormControl variant="outlined">
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select
                native
                label="Type"
                inputProps={{
                  name: "type",
                  id: "type",
                }}
                value={this.state.type}
                onChange={this.handleChange}
              >
                <option aria-label="None" value="" />
                <option value="MOVIE">Movie/Film</option>
                <option value="TVSHOW">TV Show</option>
                <option value="BOOK">Book</option>
                <option value="SONG">Song</option>
              </Select>
            </FormControl>
            <br />
            <br />
            <TextField
              inputProps={{
                name: "additionalNotes",
                id: "additionalNotes",
              }}
              id="additionalNotes"
              label="Additional Notes"
              placeholder="enter notes here..."
              multiline
              rows={4}
              variant="outlined"
              value={this.state.additionalNotes}
              onChange={this.handleChange}
            />
            <br />
            <br />
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => this.props.addRecommendation(this.state)}
            >
              Make Recommendation
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addRecommendation: (recommendation) =>
    dispatch(addRecommendation(recommendation)),
});

export default connect(null, mapDispatchToProps)(RecommendationForm);
