const readline = require('readline-sync');

const CARDS = [
    { value: 2, symbol: '2', },
    { value: 3, symbol: '3' },
    { value: 4, symbol: '4' },
    { value: 5, symbol: '5' },
    { value: 6, symbol: '6' },
    { value: 7, symbol: '7' },
    { value: 8, symbol: '8' },
    { value: 9, symbol: '9' },
    { value: 10, symbol: '10' },
    { value: 10, symbol: 'J' },
    { value: 10, symbol: 'Q' },
    { value: 10, symbol: 'K' },
    { value: 11, symbol: 'A' }          // 1
];

let currentTurn = 'player';
const lastAnswers = {
    player: true,
    dealer: true
};

class BasePlayer {
    constructor() {
        this.cards = [];
    }

    get points() {
        return this.cards
            .map(c => c.value)
            .reduce((sum, value) => sum + value, 0);
    }

    addCard(card)  {
        this.cards.push(card);
    }

    addCards(cards) {
        cards.forEach(c => this.addCard(c));
    }

    cardsForDisplay() {
        return [
            this.getFirstCardSymbol(),
            ...this.getOtherCardsForDisplay()
        ].join(' ');
    }

    getFirstCardSymbol() {
        return this.cards[0].symbol;
    }

    getOtherCardsForDisplay() {
        return this.cards.slice(1);
    }

    turn() {
        throw new Error('Unimplemented');
    }
}

class Player extends BasePlayer {
    getOtherCardsForDisplay() {
        return super.getOtherCardsForDisplay().map(c => c.symbol);
    }

    turn() {
        const answer = readline.question('Kérsz lapot? ');
        const result = answer.toLowerCase() === 'y';

        lastAnswers.player = result;
        return result;
    }
}

class Dealer extends BasePlayer {
    getOtherCardsForDisplay() {
        return super.getOtherCardsForDisplay().map(c => 'X')
    }

    turn() {
        let result = false;
        if (this.points === 20 ||  this.points === 21) result = false;

        if (this.points === 19) {
            result = Math.random() < 0.05 ? true : false;
        }

        if (this.points === 18) {
            result = Math.random() < 0.25 ? true : false;
        }

        if (this.points === 17) {
            result = Math.random() < 0.4 ? true : false;
        }

        if (this.points === 16) {
            result = Math.random() < 0.75 ? true : false;
        }

        if (this.points === 15) {
            result = Math.random() < 0.9 ? true : false;
        }

        if (this.points < 15) {
            result = true;
        }

        if (result) {
            console.log('Dealer requested a card');
        } else {
            console.log('Dealer NOT requested a card');            
        }

        lastAnswers.dealer = result;

        return result;
    }
}

function getRandomCard() {
    const r = Math.floor(Math.random() * CARDS.length);
    return CARDS[r];
}

function getRandomCards(n) {
    return Array(n).fill(0).map(_ => getRandomCard());
}

function initialDeal() {
    PLAYER.addCards(getRandomCards(2));
    DEALER.addCards(getRandomCards(2));
}

function displayState() {
    console.log('\r\n');
    console.log('Player points: ' + PLAYER.points);
    console.log('----');
    console.log('Player: ', PLAYER.cardsForDisplay());
    console.log('Dealer: ', DEALER.cardsForDisplay());
}

function nextTurn() {
    let needCard = false;
    console.log(currentTurn + ' turns');
    
    if (currentTurn === 'player') {
        needCard = PLAYER.turn();
    } else {
        needCard = DEALER.turn();
    }

    return needCard;
}

function flipTurn() {
    if (currentTurn === 'player') {
        currentTurn = 'dealer';
    } else {
        currentTurn = 'player';
    }
}

function dealCard() {
    const pl = currentTurn === 'player' ? PLAYER : DEALER;
    pl.addCard(getRandomCard());
}

function getWinner() {
    let winner = PLAYER.points > DEALER.points ? 'PLAYER' : 'DEALER';    
    if (DEALER.points > 21) {
        winner = 'PLAYER';
    }

    if (DEALER.points === PLAYER.points) {
        winner = 'NOBODY';
    }

    return winner;
}

function showDown() {
    console.log('\r\n');
    console.log('SHOW DOWN');

    console.log('Player: ' + PLAYER.cards.map(c => c.symbol).join(' '));
    console.log('Player Points: ' + PLAYER.points);

    console.log('---------------');

    console.log('Dealer: ' + DEALER.cards.map(c => c.symbol).join(' '));
    console.log('Dealer Points: ' + DEALER.points);


    console.log(getWinner() + ' WINS!!!');
}

function isGameOver() {
    if (PLAYER.points > 21) {
        return true;
    }

    return false;
}

const PLAYER = new Player();
const DEALER = new Dealer();

initialDeal();

while (true) {
    displayState();

    let res = nextTurn();
    if (res) {
        dealCard();
    }

    flipTurn();    

    if (isGameOver()) {
        break;
    }

    if (lastAnswers.dealer === false && lastAnswers.player === false) {
        break;
    }
}

if (isGameOver()) {
    displayState();
    console.log('GAME OVER');
} else {
    showDown();
}