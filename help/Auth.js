const mongoose = require("mongoose");

const authLevel3 = require("../config/authLevel3");
const authGM = require("../config/authGM");

require("../model/Setting");
const Setting = mongoose.model("setting");

module.exports = class Auth {
  constructor(message) {
    this.message = message;
  }

  checkGM() {
    if (this.message.author.id == this.message.guild.owner.id) return true;
  }

  noBot() {
    if (this.message.author.bot != true) return true;
  }

  noDM() {
    if (this.message.channel.type === "text") return true;
  }

  async validationChannel() {
    let cont = 0;
    await Setting.findOne({ channel: this.message.channel.id }).then(
      (setting) => {
        if (setting) {
          if (setting.channel.length == 2) {
            for (let i = 0; i < setting.channel.length; i++) {
              if (this.message.channel.id == setting.channel[i]) {
                cont += 1;
              }
            }
          } else {
            if (this.message.channel.id == setting.channel) {
              cont += 1;
            }
          }
        }
      }
    );

    switch (cont) {
      case 0:
        return false;
        break;
      case 1:
        return true;
        break;
    }
  }

  validation() {
    if (this.noBot() == true && this.noDM() == true) return true;
  }

  opc() {
    if (this.validation() == true) {
      let command = this.message.content.toLowerCase();
      command = command.split(" ");
      let opc = [];
      opc = command;

      return opc;
    }
  }

  authLevel3() {
    for (let key in authLevel3) {
      if (this.message.author.id == authLevel3[key]) return true;
    }
  }
};
