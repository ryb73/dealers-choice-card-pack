"use strict";

let needsCar = require("./mixins/needs-car"),
    DcCard   = require("dc-engine").DcCard;

function SellForBlueBookPlusN(n) {
  DcCard.call(this);

  function play(gameData, choiceProvider, player) {
    return choiceProvider.chooseOwnCar(gameData, player)
      .then(sellCar.bind(null, player));
  }
  this.play = play;

  function sellCar(player, car) {
    if(!car) return; // user cancelled/no car chosen

    player.sellCarToBank(car, player.blueBook.getPrice(car) + n);
  }

  let canPlay = needsCar;
  this.canPlay = canPlay;
}

module.exports = SellForBlueBookPlusN;