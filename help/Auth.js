const authLevel3 = require("../config/authLevel3");
const authGM = require("../config/authGM");

module.exports = class Auth {
  constructor(message) {
    this.message = message;
  }

  checkGM() {
    if (this.message.author.id == this.message.guild.id) return true;
  }

  noBot() {
    if (this.message.author.bot == false) return true;
  }

  noDM() {
    if (this.message.channel.type === "text") return true;
  }

  validationChannel() {}

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
