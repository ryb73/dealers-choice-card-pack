"use strict";

const q      = require("q"),
      DcCard = require("dc-engine").DcCard;

function BuyFromAutoExchangeForN(n) {
  DcCard.call(this);

  function play(gameData, choiceProvider, player) {
    player.buyCar(gameData.carDeck.pop(), n);
    return q();
  }
  this.play = play;

  function canPlay(player, gameData) {
    return gameData.carDeck.remaining >= 1 && player.money >= n;
  }
  this.canPlay = canPlay;
}

module.exports = BuyFromAutoExchangeForN;