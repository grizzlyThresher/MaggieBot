const answers = require('./answers.json');

module.exports = {
  func: function(arguments, message) {
    let responses = answers.eight_ball_answers;
    if (arguments.length > 0) {
      // At least 50% of the time, any question will be responded to with "Hmmm, maybe!"
      if (Math.floor(Math.random() * 10) <= 4) {
        message.channel.send(responses[0]);
        // The rest of the time, it randomly chooses an answer from the given list of responses.
      } else {
        let response = Math.floor(Math.random() * (responses.length - 1));
        message.channel.send(responses[response + 1]);
      }
    } else {
      message.channel.send("Hey there " + message.author.toString() + "! Did you have a question for me?");
    }
  },
  help: function(arguments, message) {
    message.channel.send("Oh, I like this command! 8ball is where I do my best to answer your non-Maggie related questions!" +
         " I don't know about a lot of things that aren't me though, so most of my answers are likely to be \"Maybe\" :sweat_smile:\n" +
         "To ask a question, just type: `^^8ball [Question]`");
  }
};