import './styles.css';
import creepy from './Audio/creepy.mp3'
import flipy from './Audio/flip2.mp3'
import victory from './Audio/victory2.mp3'
import gameover from './Audio/gameOver2.mp3'
import match from './Audio/match2.mp3'

class AudioController {
    constructor() {
        this.bgMusic = new Audio(creepy);
        this.flipSound = new Audio(flipy);
        this.matchSound = new Audio(match);
        this.victorySound = new Audio(victory);
        this.gameOverSound = new Audio(gameover);
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic = () => this.bgMusic.play();
    flip = () => this.flipSound.play();
    match = () => this.matchSound.play();
    stopMusic = () => {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    victory = () => {
        this.stopMusic();
        this.victorySound.play();
    }
    gameover = () => {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.totalTime = totalTime;
        this.cardsArray = cards;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame = () => {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchCardsArray = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerHTML = this.timeRemaining;
        this.ticker.innerHTML = this.totalClicks;
    }
    hideCards = () => {
        this.cardsArray.forEach(card => {
            card.classList.remove("visible");
            card.classList.remove("matched");
        })
    }
    flipCard = (card) => {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerHTML = this.totalClicks;
            card.classList.add("visible");

            if (this.cardToCheck) {
                this.checkForCardMatch(card)
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch = (card) => {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardMisMatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }
    cardMatch = (card1, card2) => {
        this.matchCardsArray.push(card1);
        this.matchCardsArray.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchCardsArray.length === this.cardsArray.length) {
            this.victory();
        }
    }
    cardMisMatch = (card1, card2) => {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType = (card) => {
        return card.getElementsByClassName("card-value")[0].src;
    }
    startCountDown = () => {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerHTML = this.timeRemaining;
            if (this,this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }
    gameOver = () => {
        clearInterval(this.countDown);
        this.audioController.gameover();
        document.getElementById('game-over-text').classList.add("visible");
    }
    victory = () => {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add("visible");
        this.hideCards();
    }
    shuffleCards = () => {
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }
    canFlipCard = (card) => {
        return (!this.busy && !this.matchCardsArray.includes(card) && card !== this.cardToCheck);
    }
}

const ready = () => {
    let overlays = Array.from(document.getElementsByClassName("overlay-text"));
    let cards = Array.from(document.getElementsByClassName("card"));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}


