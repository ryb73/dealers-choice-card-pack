"use strict";

const q = require("q");

function Free() {
  function play(gameData, choiceProvider, player) {
    player.buyInsurance(gameData.insuranceDeck.pop(), 0);
    return q();
  }
  this.play = play;

  function canPlay(player, gameData) {
    return gameData.insuranceDeck.remaining > 0;
  }
  this.canPlay = canPlay;
}

module.exports = Free;