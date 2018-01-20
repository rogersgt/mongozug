function Command(commandString='', ...args) {
  this.childArguments = args;
  this.value = commandString;
}

Command.prototype = Object.create(Command.prototype);
Command.prototype.constructor = Command;

module.exports = Command;
