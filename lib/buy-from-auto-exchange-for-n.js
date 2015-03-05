"use strict";

var q = require("q");

function BuyFromAutoExchangeForN(n) {
  function play(player, gameData, choiceProvider) {
    player.debit(n);
    player.gain(gameData.carDeck.pop());
    return q();
  }
  this.play = play;

  function canPlay(player, gameData) {
    return gameData.carDeck.remaining >= 1 && player.money >= n;
  }
  this.canPlay = canPlay;
}

module.exports = BuyFromAutoExchangeForN;