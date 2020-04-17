const uuid = require('uuid');

export interface IRecommendation {
    type: RecommendationType,
    title: string,
    additionalNotes?: string,
};

export interface IRecommendationsByTypeRequest {
    type: RecommendationType
}

export class Recommendation implements IRecommendation {

    id: string;
    type: RecommendationType;
    title: string;
    additionalNotes: string;

    constructor(type: RecommendationType, title: string, additionalNotes: string = "") {
        this.id = uuid.v5();
        this.type = type;
        this.title = title;
        this.additionalNotes = additionalNotes;
    }
}

export enum RecommendationType {
    movie = "MOVIE",
    tvShow = "TVSHOW",
    book = "BOOK",
    song = "SONG"
};