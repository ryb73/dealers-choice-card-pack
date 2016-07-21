"use strict";

const needsCar = require("./mixins/needs-car"),
      DcCard   = require("dc-engine").DcCard;

function SellForListPlusN(n) {
  DcCard.call(this);

  function play(gameData, choiceProvider, player) {
    return choiceProvider.chooseOwnCar(gameData, player)
      .then(sellCar.bind(null, player));
  }
  this.play = play;

  function sellCar(player, car) {
    if(!car) return; // user cancelled/no car chosen

    player.sellCar(car, car.listPrice + n);
  }

  const canPlay = needsCar;
  this.canPlay = canPlay;
}

module.exports = SellForListPlusN;