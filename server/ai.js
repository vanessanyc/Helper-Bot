
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const mongoose = require("mongoose");
const Mafunds = require('./models/Mafunds');

//Location Entities
manager.addNamedEntityText('location', 'queens', ['en'], ['Queens']);
manager.addNamedEntityText('location', 'bronx', ['en'], ['Bronx']);
manager.addNamedEntityText('location', 'brooklyn', ['en'], ['Brooklyn']);
manager.addNamedEntityText('location', 'manhattan', ['en'], ['Manhattan']);
manager.addNamedEntityText('location', 'staten island', ['en'], ['staten-island', 'Staten Island', 'Staten-Island', 'SI', 'si', 'S.I.', 's.i.']);

//Service Entities
manager.addNamedEntityText('service', 'food', ['en'], ['food']);
manager.addNamedEntityText('service', 'housing', ['en'], ['housing']);

//Group Entities
manager.addNamedEntityText('group', 'black', ['en'], ['black']);
manager.addNamedEntityText('group', 'latinx', ['en'], ['latinx']);
manager.addNamedEntityText('group', 'asian', ['en'], ['asian']);
manager.addNamedEntityText('group', 'indigenous', ['en'], ['indigenous']);
manager.addNamedEntityText('group', 'lgbtq', ['en'], ['lgbtq']);


manager.addDocument('en', 'hi', 'greeting.hello');
manager.addDocument('en', 'Hello my name is %name%', 'greeting.hello');
manager.addDocument('en', 'hey', 'greeting.hello');
manager.addDocument('en', 'good morning', 'greeting.hello');
manager.addDocument('en', 'how are you', 'greetings.howareyou');
manager.addDocument('en', 'what is your name', 'greetings.name');
manager.addDocument('en', 'Can you help me find a mutual aid fund?', 'begin.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location%?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in Queens?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location% that offer %service% services?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location% that are part of %group%?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location% that offer %service% services and are part of %group%?', 'find.mutualaid');


manager.train();


async function generateReply(message) {
  const result = await manager.process('en', message);
  const intent = result.intent;
  console.log(`Input message: ${message}, Intent: ${intent}`);

  switch (intent) {
    case 'greeting.hello':
      return 'Hello! How can I help you today?';
    case 'greetings.howareyou':
      return 'I am doing well, thank you for asking!';
    case 'greetings.name':
      return 'My name is Helper Bot. Nice to meet you!';
    case 'begin.mutualaid':
      return 'Sure! Can you provide me with more infomation about your location, the type of services your looking for, or if you are apart of any marginalized group?';
    case 'find.mutualaid':
      const { entities } = result;
      const location = entities.find(e => e.entity === 'location')?.option?.value;
      const groups = entities.filter(e => e.entity === 'group').map(e => e.option.value);
      const services = entities.filter(e => e.entity === 'service').map(e => e.option.value);
      
      const query = {
        location: new RegExp(location, 'i'),
        ...(groups.length && { groups: { $in: groups } }),
        ...(services.length && { services: { $in: services } })
      };
      
      const funds = await Mafunds.find(query);
      if (funds.length > 0) {
        const fundNames = funds.map((fund) => fund.name).join(', ');
        return `Here are some mutual aid funds in ${location} that might be able to help you: ${fundNames}`;
      } else {
        return `I'm sorry, I couldn't find any mutual aid funds in ${location} that match your search.`;
      }
      
    default:
      return "I'm sorry, I'm not sure I understand your message. Try asking me about mutual aid funds.";
  }
}


module.exports = {
  generateReply,
};
