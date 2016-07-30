"use strict";

const _ = require("lodash");

module.exports = function canPlay(actingPlayer, gameData) {
  return gameData.players.every(function(player) {
    return player === actingPlayer || _.size(player.cars) > 0;
  });
};
