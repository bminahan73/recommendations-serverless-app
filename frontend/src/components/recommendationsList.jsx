import React, { Component } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return { recommendations: state.recommendations };
};

class RecommendationsList extends Component {
  state = {
    recommendations: this.props.recommendations,
  };
  render() {
    return (
      <List>
        {() =>
          this.props.recommendations.map((recommendation) => (
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`${recommendation.title} (recommendation.type)`}
                secondary={
                  <React.Fragment>
                    {recommendation.additionalNotes}
                  </React.Fragment>
                }
              />
            </ListItem>
          ))
        }
      </List>
    );
  }
}

export default connect(mapStateToProps)(RecommendationsList);
