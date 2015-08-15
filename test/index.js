"use strict";
/* jshint mocha: true */

const chai                    = require("chai"),
      q                       = require("q"),
      dcEngine                = require("dc-engine"),
      Player                  = dcEngine.Player,
      GameData                = dcEngine.GameData,
      Insurance               = dcEngine.Insurance,
      Car                     = dcEngine.Car,
      BlueBook                = dcEngine.BlueBook,
      cardPack                = require(".."),
      Attack                  = cardPack.Attack,
      BuyFromAutoExchangeForN = cardPack.BuyFromAutoExchangeForN,
      Free                    = cardPack.Free,
      SellForBlueBookPlusN    = cardPack.SellForBlueBookPlusN,
      SellForListPlusN        = cardPack.SellForListPlusN;

const assert = chai.assert;

describe("Attack", function() {
  describe("canPlay", function() {
    it("returns true when opponents have cars", function() {
      let me = { cars: [] }; // and I don't
      let gameData = {
        players: [
          me,
          { cars: [ "edsel" ] }
        ]
      };
      assert.ok(new Attack().canPlay(me, gameData));
    });

    it("returns false when opponents don't have cars", function() {
      let me = { cars: [ "lincoln" ] }; // but I do
      let gameData = {
        players: [
          me,
          { cars: [] }
        ]
      };
      assert.notOk(new Attack().canPlay(me, gameData));
    });
  });

  describe("attack", function() {
    it("revokes the selected car if not blocked", function(done) {
      let victim = new Player(0);
      let me = new Player(0);

      let theCar = new Car(1, 1);
      victim.buyCar(theCar, 0);

      let gameData = new GameData([ victim, me ], emptyDecks());

      let choiceProvider = {
        chooseOpponentCar: function() { return q(theCar); },
        allowBlockAttack: function() { return q(false); }
      };

      new Attack().play(gameData, choiceProvider, me)
        .then(function() {
          assert.notOk(victim.hasCar(theCar));
          done();
        })
        .catch(done);
    });

    it("makes the attacker pay list price if blocked", function(done) {
      let carPrice = 100;
      let victim = new Player(0);
      let me = new Player(carPrice);

      let theCar = new Car(1, carPrice);
      victim.buyCar(theCar, 0);

      let gameData = new GameData([ victim, me ], emptyDecks());

      let choiceProvider = {
        chooseOpponentCar: function() { return q(theCar); },
        allowBlockAttack: function() { return q(true); }
      };

      new Attack().play(gameData, choiceProvider, me)
        .then(function() {
          assert.ok(victim.hasCar(theCar));
          assert.equal(victim.money, carPrice);
          assert.equal(me.money, 0);
          done();
        })
        .catch(done);
    });
  });
});

describe("BuyFromAutoExchangeForN", function() {
  describe("canPlay", function() {
    it("can't be played without enough money", function() {
      let cost = 100;
      let me = new Player(cost - 1);
      let gameData = {
        carDeck: { remaining: 1 }
      };

      let card = new BuyFromAutoExchangeForN(cost);
      assert.notOk(card.canPlay(me, gameData));
    });

    it("can't be played if there are no cars", function() {
      let me = new Player(1000000);
      let gameData = {
        carDeck: { remaining: 0 }
      };

      let card = new BuyFromAutoExchangeForN(1);
      assert.notOk(card.canPlay(me, gameData));
    });

    it("can be played with enough money and a car", function() {
      let cost = 100;
      let me = new Player(cost);
      let gameData = {
        carDeck: { remaining: 1 }
      };

      let card = new BuyFromAutoExchangeForN(cost);
      assert.ok(card.canPlay(me, gameData));
    });
  });

  describe("play", function() {
    it("gives the player the top car and debit accordingly", function(done) {
      let cost = 100;
      let me = new Player(cost);
      let car = new Car(1, 1);
      let gameData = {
        carDeck: {
          pop: function() { return car; }
        }
      };

      let card = new BuyFromAutoExchangeForN(cost);
      card.play(gameData, null, me)
        .then(function() {
          assert.ok(me.hasCar(car));
          assert.equal(me.money, 0);
          done();
        })
        .catch(done);
    });
  });
});

describe("Free", function() {
  describe("canPlay", function() {
    it("can't be played if there are no insurances", function() {
      let gameData = {
        insuranceDeck: { remaining: 0 }
      };

      assert.notOk(new Free().canPlay({}, gameData));
    });

    it("can be played if there are insurances", function() {
      let gameData = {
        insuranceDeck: { remaining: 1 }
      };

      assert.ok(new Free().canPlay({}, gameData));
    });
  });

  describe("play", function() {
    it("gives the player an insurance", function(done) {
      let me = new Player(0);
      let insurance = new Insurance();
      let gameData = {
        insuranceDeck: {
          pop: function() { return insurance; }
        }
      };

      new Free().play(gameData, null, me)
        .then(function() {
          assert.ok(me.hasInsurance(insurance));
          done();
        })
        .catch(done);
    });
  });
});

describe("SellForListPlusN", function() {
  describe("play", function() {
    let price, plus, me, gameData, car;

    beforeEach(function() {
      price = 100;
      plus = 50;
      me = new Player(0);
      gameData = {};

      car = new Car(1, price);
      me.buyCar(car, 0);
    });

    it("takes car from player, gives $$$", function(done) {
      let choiceProvider = {
        chooseOwnCar: function(pGameData, pPlayer) {
          assert.equal(pGameData, gameData);
          assert.equal(pPlayer, me);
          return q(car);
        }
      };

      new SellForListPlusN(plus)
        .play(gameData, choiceProvider, me)
        .then(function() {
          assert.notOk(me.hasCar(car));
          assert.equal(me.money, price + plus);
          done();
        })
        .catch(done);
    });

    it("doesn't take car or give money if I cancel", function(done) {
      let choiceProvider = {
        chooseOwnCar: function(pGameData, pPlayer) {
          assert.equal(pGameData, gameData);
          assert.equal(pPlayer, me);
          return q(null);
        }
      };

      new SellForListPlusN(plus)
        .play(gameData, choiceProvider, me)
        .then(function() {
          assert.ok(me.hasCar(car));
          assert.equal(me.money, 0);
          done();
        })
        .catch(done);
    });
  });

  describe("canPlay", function() {
    it("can be played if the player has a car", function() {
      let me = new Player(0);
      let car = new Car(1, 1);
      me.buyCar(car, 0);
      assert.ok(new SellForListPlusN(0).canPlay(me, {}));
    });

    it("can't be played if the player don't have a car", function() {
      let me = new Player(0);
      assert.notOk(new SellForListPlusN(0).canPlay(me, {}));
    });
  });
});

describe("SellForBlueBookPlusN", function() {
  describe("play", function() {
    let price, plus, gameData, car, me;

    beforeEach(function() {
      price = 100;
      plus = 50;

      gameData = {};
      car = new Car(1, 999);

      let carPrices = {};
      carPrices[car.id] = price;
      let blueBook = new BlueBook(carPrices);

      me = new Player(0);
      me.blueBook = blueBook;
      me.buyCar(car, 0);
    });

    it("takes car from player, gives $$$", function(done) {
      let choiceProvider = {
        chooseOwnCar: function(pGameData, pPlayer) {
          assert.equal(pGameData, gameData);
          assert.equal(pPlayer, me);
          return q(car);
        }
      };

      new SellForBlueBookPlusN(plus)
        .play(gameData, choiceProvider, me)
        .then(function() {
          assert.notOk(me.hasCar(car));
          assert.equal(me.money, price + plus);
          done();
        })
        .catch(done);
    });

    it("doesn't take care or pay out if I cancel", function(done) {
      let choiceProvider = {
        chooseOwnCar: function(pGameData, pPlayer) {
          assert.equal(pGameData, gameData);
          assert.equal(pPlayer, me);
          return q();
        }
      };

      new SellForBlueBookPlusN(plus)
        .play(gameData, choiceProvider, me)
        .then(function() {
          assert.ok(me.hasCar(car));
          assert.equal(me.money, 0);
          done();
        })
        .catch(done);
    });
  });

  describe("canPlay", function() {
    it("can be played if the player has a car", function() {
      let me = new Player(0);
      let car = new Car(1, 1);
      me.buyCar(car, 0);
      assert.ok(new SellForBlueBookPlusN(0).canPlay(me, {}));
    });

    it("can't be played if the player don't have a car", function() {
      let me = new Player(0);
      assert.notOk(new SellForBlueBookPlusN(0).canPlay(me, {}));
    });
  });
});

function emptyDecks() {
  return {
    dcDeck: [],
    insuranceDeck: [],
    carDeck: []
  };
}