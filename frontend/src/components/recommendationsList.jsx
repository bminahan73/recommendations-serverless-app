import React from "react";
import { connect } from "react-redux";
import { List, ListItem, ListItemText } from "@material-ui/core";

const mapStateToProps = (state) => ({
  recommendations: state.recommendations,
});

const RecommendationsList = ({ recommendations }) => (
  <React.Fragment>
    <List>
      {recommendations.map((r) => (
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={`${r.title} (${r.type})`}
            secondary={r.additionalNotes}
          />
        </ListItem>
      ))}
    </List>
  </React.Fragment>
);

export default connect(mapStateToProps)(RecommendationsList);
