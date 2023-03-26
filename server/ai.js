
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const Mafunds = require('./models/Mafunds');

manager.addDocument('en', 'hi', 'greeting.hello');
manager.addDocument('en', 'Hello my name is %name%', 'greeting.hello');
manager.addDocument('en', 'hey', 'greeting.hello');
manager.addDocument('en', 'good morning', 'greeting.hello');
manager.addDocument('en', 'how are you', 'greetings.howareyou');
manager.addDocument('en', 'what is your name', 'greetings.name');
//manager.addDocument('en', 'Can you help me find a mutual aid fund?', 'find.mutualaid');
//manager.addDocument('en', 'How can I find a mutual aid group near me?', 'find.mutualaid');
//manager.addDocument('en', 'What are some mutual aid funds in my area?', 'find.mutualaid');
//manager.addDocument('en', 'I need help finding a mutual aid fund', 'find.mutualaid');


manager.train();


async function generateReply(message) {
  const result = await manager.process('en', message);
  const intent = result.intent;
  console.log(`Input message: ${message}, Intent: ${intent}`);

  switch (intent) {
    case 'greeting.hello':
      return 'Hello! How can I help you today?';
    case 'greetings.howareyou':
      return 'I am doing well, thank you for asking! How about you?';
    case 'greetings.name':
      return 'My name is Helper Bot. Nice to meet you!';
    /*case 'find.mutualaid':
      const funds = await Mafunds.find({});
      if (funds.length > 0) {
        const fundNames = funds.map((fund) => fund.name).join(', ');
        return `Here are some mutual aid funds that might be able to help you: ${fundNames}`;
      } else {
        return "I'm sorry, I couldn't find any mutual aid funds that match your search.";
      }
    */
    default:
      return "I'm sorry, I'm not sure I understand your message. Try asking me about mutual aid funds.";
  }
}


module.exports = {
  generateReply,
};
