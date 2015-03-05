"use strict";

module.exports = function canPlay(actingPlayer, gameData) {
  return gameData.players.every(function(player) {
    return player === actingPlayer || player.cars.length > 0;
  });
};