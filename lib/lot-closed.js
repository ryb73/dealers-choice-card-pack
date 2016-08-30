"use strict";

const _            = require("lodash"),
      giveUniqueId = require("give-unique-id");

function LotClosed() {
    giveUniqueId(this);
  this.canPlay = _.constant(false);
}

module.exports = LotClosed;
