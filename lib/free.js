"use strict";

var q = require("q");

function Free() {
  function play(player, gameData, choiceProvider) {
    player.gain(gameData.insuranceDeck.pop());
    return q();
  }
  this.play = play;

  function canPlay(player, gameData) {
    return gameData.insuranceDeck.remaining > 0;
  }
  this.canPlay = canPlay;
}

module.exports = Free;