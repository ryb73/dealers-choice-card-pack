"use strict";

const needsCar = require("./mixins/needs-car"),
      DcCard   = require("dc-engine").DcCard;

function SellForListPlusN(n) {
  DcCard.call(this);

  function play(gameData, choiceProvider, player) {
    return choiceProvider.chooseOwnCar(player)
      .then(sellCar.bind(null, player));
  }
  this.play = play;

  function sellCar(player, car) {
    player.sellCarToBank(car, car.listPrice + n);
  }

  const canPlay = needsCar;
  this.canPlay = canPlay;
}

module.exports = SellForListPlusN;