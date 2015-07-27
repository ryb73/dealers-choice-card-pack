"use strict";

const q = require("q");

function Free() {
  function play(gameData, choiceProvider, player) {
    player.gainInsurance(gameData.insuranceDeck.pop());
    return q();
  }
  this.play = play;

  function canPlay(player, gameData) {
    return gameData.insuranceDeck.remaining > 0;
  }
  this.canPlay = canPlay;
}

module.exports = Free;