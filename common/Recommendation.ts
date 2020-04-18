import { v1 as uuidv1 } from 'uuid';

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
        this.id = uuidv1();
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