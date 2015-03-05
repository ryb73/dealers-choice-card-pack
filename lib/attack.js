"use strict";

var _                = require("radysh"),
    needsCar         = require("./mixins/needs-car"),
    opponentNeedsCar = require("./mixins/opponent-needs-car");

function Attack(attackType) {
  function play(player, gameData, choiceProvider) {
    return choiceProvider.chooseOpponentCar(gameData, player)
      .then(tryAttack.bind(null, player, gameData, choiceProvider));
  }
  this.play = play;

  function tryAttack(attacker, gameData, choiceProvider, car) {
    return choiceProvider.allowBlockAttack(gameData, attackType, car)
      .then(function(blockAttack) {
        if(!blockAttack) attack(car, gameData);
        else penalize(attacker, car, gameData);
      });
  }

  function attack(car, gameData) {
    gameData.getPlayerWithCar(car).lose(car);
  }

  function penalize(attacker, car, gameData) {
    var victim = gameData.getPlayerWithCar(car);
    victim.credit(car.listPrice);
    attacker.debit(car.listPrice);
  }

  this.canPlay = opponentNeedsCar;
}

Attack.attackTypes = {
  fire: 1,
  theft: 2,
  collision: 3,
  rancidPopcorn: 4
};

module.exports = Attack;