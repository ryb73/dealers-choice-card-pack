"use strict";

const _ = require("lodash");

module.exports = function canPlay(player, gameData) {
  return _.size(player.cars) > 0;
};
