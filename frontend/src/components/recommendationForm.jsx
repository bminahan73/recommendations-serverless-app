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
import { addRecommendation, updateRecommendationForm } from "../state/actions";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { formContents: state.recommendationFormContents };
};

const mapDispatchToProps = { addRecommendation, updateRecommendationForm };

class RecommendationForm extends Component {
  /*handleChangeToTitle(event) {
    let newFormContents = this.props.formContents;
    newFormContents.title = event.target.value;
    this.props.updateRecommendationForm(newFormContents);
  }

  handleChangeToType(event) {
    let newFormContents = this.props.formContents;
    newFormContents.type = event.target.value;
    this.props.updateRecommendationForm(newFormContents);
  }

  handleChangeToAdditionalNotes(event) {
    let newFormContents = this.props.formContents;
    newFormContents.additionalNotes = event.target.value;
    this.props.updateRecommendationForm(newFormContents);
  }*/

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Card variant="outlined">
          <CardContent>
            <TextField
              id="title"
              label="Title"
              placeholder="enter title..."
              variant="outlined"
              value={this.props.formContents.title}
              //onChange={this.handleChangeToTitle}
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
                value={this.props.formContents.type}
                //onChange={this.handleChangeToType}
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
              id="additionalNotes"
              label="Additional Notes"
              placeholder="enter notes here..."
              multiline
              rows={4}
              variant="outlined"
              value={this.props.formContents.additionalNotes}
              //onChange={this.handleChangeToAdditionalNotes}
            />
            <br />
            <br />
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              //onClick={this.props.addRecommendation(this.props.formContents)}
              onClick={() =>
                this.props.addRecommendation({
                  title: "Lion King",
                  type: "MOVIE",
                  additionalNotes: "it was awesome!",
                })
              }
            >
              Make Recommendation
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationForm);
