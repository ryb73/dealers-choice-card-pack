"use strict";

var needsCar = require("./mixins/needs-car");

function SellForListPlusN(n) {
  function play(player, gameData, choiceProvider) {
    return choiceProvider.chooseOwnCar(gameData, player)
      .then(sellCar.bind(null, player));
  }
  this.play = play;

  function sellCar(player, car) {
    if(!car) return; // user cancelled/no car chosen

    player.credit(car.listPrice + n);
    player.lose(car);
  }

  var canPlay = needsCar;
  this.canPlay = needsCar;
}

module.exports = SellForListPlusN;