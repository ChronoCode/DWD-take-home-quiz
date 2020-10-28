// used in multiple functions
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

const Deck = function () {
  this.cards = [];
}

Deck.prototype.initialize = function () {
  const cardNames = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
  const cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 15];

  suits.forEach((suit) => {
    for (let i = 0; i < cardNames.length; i++) {
      let card = {
        name: cardNames[i] + ' of ' + suit,
        suit: suit,
        value: cardValues[i]
      }
      this.cards.push(card);
    }
  });
}

Deck.prototype.shuffle = function () {
  // replaces each card (except last card) in position i with
  // a card that is in a later position
  for (let i = 0; i < this.cards.length - 2; i++) {
    let j = Math.floor(Math.random() * (this.cards.length - i)) + i;
    let temp = this.cards[i];
    this.cards[i] = this.cards[j];
    this.cards[j] = temp;
  }
}

const Player = function (name) {
  this.name = name;
  this.hand = [];
}

// takes a reference to the current deck
Player.prototype.drawCard = function (deck) {
  // note that the 'top card' of the deck is the last card in the cards array
  let newCard = deck.cards.pop();

  this.hand.push(newCard);

  // sort only if hand is full
  if (this.hand.length === 5) {
    this.hand.sort((a, b) => {
      let suitIndexA = suits.indexOf(a.suit);
      let suitIndexB = suits.indexOf(b.suit);

      if (suitIndexA < suitIndexB) {
        return -1;
      } else if (suitIndexA > suitIndexB) {
        return 1;
      } else {
        return a.value - b.value;
      }
    });
  }
}

Player.prototype.displayHand = function () {
  console.log(this.name + "'s hand: ");
  this.hand.forEach((card) => {
    console.log(card.name);
  });
}

Player.prototype.getTotal = function () {
  return this.hand.reduce((total, card) => {
    return total + card.value;
  }, 0);
}

let newDeck = new Deck();
newDeck.initialize();
newDeck.shuffle();

// generates random number from 2 to 6
let numOfPlayers = Math.floor(Math.random() * 5) + 2;


let players = [];
for (let i = 1; i <= numOfPlayers; i++) {
  let currentPlayer = new Player('Player ' + i);
  players.push(currentPlayer);
}

// players take turns drawing cards until they each have 5
for (let j = 0; j < 5; j++) {
  players.forEach((player) => {
    player.drawCard(newDeck);
  });
}

let winners = [];
let winningTotal = 0;

players.forEach((player) => {
  player.displayHand();

  let playerTotal = player.getTotal();

  if (playerTotal > winningTotal) {
    winners = [player.name];
    winningTotal = playerTotal;
  } else if (playerTotal === winningTotal) {
    winners.push(player.name);
  }

  console.log('Total: ' + playerTotal + '\n');
});

let randomWinnerNumber = Math.floor(Math.random() * winners.length);
console.log(winners[randomWinnerNumber] + ' Wins!')

/**
 * Specifications:
 *
 * Create a Deck:
 *
 * - The deck should contain 52 unique Cards.
 *
 * - Cards are standard poker cards.
 *
 * - Suit Order
 *    + Hearts, Diamonds, Clubs then Spades
 *
 * - Card Values
 *    + Aces are 15 points.
 *    + Face cards (Jack, Queen, King) are 10 points.
 *    + Numbered cards are worth the value on the card (i.e. a 5 is 5 points).
 *
 * - The Deck should be able to be shuffled
 *
 *
 * Create a Player:
 *
 * - The Player should have a Hand that can hold 5 Cards from the Deck.
 *
 * - The Player's Hand should be sorted by suit and then by point value
 *
 * - The Player's Hand should be able to be totaled by point value.
 *
 * - Players should be able to draw a card from the top of the deck.
 *
 * - Players should be able to print the cards in their hand to console
 *
 *
 * Program Flow
 *
 * - Initialize and Shuffle the Deck.
 *
 * - Create a random number of Player's between 2-6.
 *
 * - Allow each player to draw a Card from the Deck until all players have 5 cards.
 *
 * - Count the total points in each player's hand and print all players hands to console.
 *
 * - Print the Player with the most Point's (if there is a tie randomly pick one of the winning players).
 */