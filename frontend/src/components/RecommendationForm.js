import React, { Component } from 'react'
import { FormControl, Select, TextField, InputLabel, Button, CssBaseline } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

export class RecommendationForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            recommendation: {
                title: "",
                type: "",
                additionalNotes: ""
            },
            submitted: false
        };

        this.handleChangeToTitle = this.handleChangeToTitle.bind(this);
        this.handleChangeToType = this.handleChangeToType.bind(this);
        this.handleChangeToAdditionalNotes = this.handleChangeToAdditionalNotes.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChangeToTitle(event) {
        const newState = this.state;
        newState.recommendation.title = event.target.value;
        this.setState(newState);
    }

    handleChangeToType(event) {
        const newState = this.state;
        newState.recommendation.type = event.target.value;
        this.setState(newState);
    }

    handleChangeToAdditionalNotes(event) {
        const newState = this.state;
        newState.recommendation.additionalNotes = event.target.value;
        this.setState(newState);
    }

    handleSubmit(event) {
        const newState = this.state;
        newState.submitted = true;
        this.setState(newState);
        console.info(`A recommendation was submitted: ${JSON.stringify(this.state.recommendation)}`);
        event.preventDefault();
    }

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
                            value={this.state.recommendation.title}
                            onChange={this.handleChangeToTitle}
                        />
                        <br /><br />
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="type">Type</InputLabel>
                            <Select
                                native
                                label="Type"
                                inputProps={{
                                    name: 'type',
                                    id: 'type',
                                }}
                                value={this.state.recommendation.type}
                                onChange={this.handleChangeToType}
                            >
                                <option aria-label="None" value="" />
                                <option value="MOVIE">Movie/Film</option>
                                <option value="TVSHOW">TV Show</option>
                                <option value="BOOK">Book</option>
                                <option value="SONG">Song</option>
                            </Select>
                        </FormControl>
                        <br /><br />
                        <TextField
                            id="additionalNotes"
                            label="Additional Notes"
                            placeholder="enter notes here..."
                            multiline
                            rows={4}
                            variant="outlined"
                            value={this.state.recommendation.additionalNotes}
                            onChange={this.handleChangeToAdditionalNotes}
                        />
                        <br /><br />
                    </CardContent>
                    <CardActions>
                        <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.handleSubmit}
                            >
                                Make Recommendation
                        </Button>
                    </CardActions>
                </Card>
            </React.Fragment>
        )
    }

}