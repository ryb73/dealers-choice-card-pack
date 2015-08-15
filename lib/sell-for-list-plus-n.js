"use strict";

var needsCar = require("./mixins/needs-car");

function SellForListPlusN(n) {
  function play(gameData, choiceProvider, player) {
    return choiceProvider.chooseOwnCar(gameData, player)
      .then(sellCar.bind(null, player));
  }
  this.play = play;

  function sellCar(player, car) {
    if(!car) return; // user cancelled/no car chosen

    player.sellCar(car, car.listPrice + n);
  }

  var canPlay = needsCar;
  this.canPlay = canPlay;
}

module.exports = SellForListPlusN;