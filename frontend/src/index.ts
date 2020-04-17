import 'bootstrap';
import './main.scss';
import { CardInfo } from './CardInfo';
import { PageData } from './PageData';

const indexData: PageData = {
    cards: [
        {
            title: "something1",
            header: "something1",
            content: "something1",
            color: "secondary"
        },
        {
            title: "something2",
            header: "something2",
            content: "something2",
            color: "warning"
        }
    ],
    progressColor: "danger"
};

const somethingElseData: PageData = {
    cards: [
        {
            title: "something3",
            header: "something3",
            content: "something3",
            color: "danger"
        },
        {
            title: "something4",
            header: "something4",
            content: "something4",
            color: "primary"
        }
    ],
    progressColor: "primary"
};

const pageData = document.title === "Index" ? indexData : somethingElseData;

function createCardElement(card: CardInfo) {
    const cardElement = document.createElement('div');
    cardElement.className = `card text-white bg-${card.color} mb-3`;

    const cardHeader = document.createElement('div');
    cardHeader.className = "card-header";
    cardHeader.innerText = card.header;

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title";
    cardTitle.innerText = card.title;

    const cardText = document.createElement('p');
    cardText.className = "card-text";
    cardText.innerText = card.content;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    cardElement.appendChild(cardHeader);
    cardElement.appendChild(cardBody);

    return cardElement;
}

const cardsElement = document.getElementById("cards")!;
pageData.cards.map((cardData) => {
    cardsElement.appendChild(createCardElement(cardData));
});

const progressBarElement = document.getElementById("progressBar")!;
progressBarElement.classList.add(`bg-${pageData.progressColor}`);

let progress = 0;

const clicker = document.getElementById("clicker")!;
clicker.onclick = () => {
    progress ++;
    if (progress < 100) {
        progressBarElement.setAttribute('aria-valuenow',progress.toString());
        progressBarElement.setAttribute('style','width:'+Number(progress)+'%');
    }
}