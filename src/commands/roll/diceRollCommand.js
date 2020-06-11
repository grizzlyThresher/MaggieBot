module.exports = {
	func: function(arguments, message) {
	  if (arguments.length > 0) {
      let rolled = arguments[0].slice("");
      let numDice = "";
      let patt = /[0-9]/
      let i;
      for ( i = 0; i < rolled.length; i++) {
        if (patt.test(rolled[i])) {
          numDice += rolled[i];
        } else {
          break;
        }
      }
      if (i === 0) {
        numDice = "1";
      }
      if (rolled[i] !== "d") {
        message.channel.send("I'm sorry, could you try rewriting that as `^^roll [Number of Dice]d[Number of Sides]` ?");
      } else {
        i++;
        let numSides = "";
        let failed = false;
        for (i = i; i < rolled.length; i++) {
          if (patt.test(rolled[i])) {
            numSides += rolled[i];
          } else {
            failed = true;
            break;
          }
        }
        if (failed) {
          message.channel.send("I'm sorry, could you try rewriting that as `^^roll [Number of Dice]d[Number of Sides]` ?");
        } else {
          let dice = parseInt(numDice);
          let sides = parseInt(numSides);
        
          if (dice === 1) {
            message.channel.send(Math.ceil(Math.random() * sides).toString());
          } else {
            let curNum = Math.ceil(Math.random() * sides);
            let total = curNum;
            let printed = curNum.toString();
          
            for (let j = 1; j < dice; j++) {
              curNum = Math.ceil(Math.random() * sides);
              printed += " + " + curNum.toString();
              total += curNum;
            }

            message.channel.send(printed + " = " + total.toString());
          }
        }
      }
    } else {
      message.channel.send(":rice_ball:\n It's not Quite a roll, but it's the closest I've got!");
    }
	},
  help: function(arguments, message) {
    message.channel.send("For the gamblers or roleplayers among you, this command is used to roll dice! You can roll as many dice as you like with as many sides as you like, " +
          "but all dice in the same roll will have the same number of sides.\n" +
          "To use this command, type: `^^roll [Number of Dice]d[Number of Sides]`\n" +
          "An example of this would be: 2d20, 3d10, 2d6, 4d7, etc.\n" +
          "If you don't enter a number before the 'd', it will be assumed you only want to roll one die.\n" +
          "For example, if you typed: `^^roll d20`, I would give you a single value between 1 and 20!");
  }
}