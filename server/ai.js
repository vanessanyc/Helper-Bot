
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

manager.addDocument('en', 'hi', 'hello', 'hey', 'yo', 'hiya', 'greetings.hello');
manager.addDocument('en', 'how are you', 'whats up', 'how ya doing', 'how are you doing', 'greetings.howareyou');
manager.addDocument('en', 'what is your name', 'whats your name', 'greetings.name');
manager.addDocument('en', 'Can you help me find a mutual aid fund?', 'find.mutualaid');
manager.addDocument('en', 'How can I find a mutual aid group near me?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in my area?', 'find.mutualaid');
manager.addDocument('en', 'I need help finding a mutual aid fund', 'find.mutualaid');

manager.train();


function generateReply(msg) {
  const result = manager.process('en', msg);
  const intent = result.intent;

  switch (intent) {
    case 'greetings.hello':
      return 'Hello! How can I help you today?';
    case 'greetings.howareyou':
      return 'I am doing well, thank you for asking! How about you?';
    case 'greetings.name':
      return 'My name is Helper Bot. Nice to meet you!';
    default:
      return 'I am sorry, I did not understand your message. Try asking me about mutual aid funds.';
  }
}


module.exports = {
  generateReply,
};
