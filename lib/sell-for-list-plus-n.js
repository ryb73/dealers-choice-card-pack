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

    player.credit(car.listPrice + n);
    player.loseCar(car);
  }

  var canPlay = needsCar;
  this.canPlay = canPlay;
}

module.exports = SellForListPlusN;