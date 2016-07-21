"use strict";

const DcCard           = require("dc-engine").DcCard,
      opponentNeedsCar = require("./mixins/opponent-needs-car");

function Attack(attackType) {
  DcCard.call(this);

  function play(gameData, choiceProvider, player) {
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
    gameData.getPlayerWithCar(car).sellCar(car, 0);
  }

  function penalize(attacker, car, gameData) {
    let victim = gameData.getPlayerWithCar(car);
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