const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: true } });
const mongoose = require("mongoose");
const Mafunds = require('./models/Mafunds');

//Location Entities
manager.addNamedEntityText('location', 'Queens', ['en'], ['Queens', 'queens']);
manager.addNamedEntityText('location', 'Bronx', ['en'], ['Bronx', 'bronx', 'BX', 'bx']);
manager.addNamedEntityText('location', 'Brooklyn', ['en'], ['Brooklyn', 'brooklyn', 'BK', 'bk']);
manager.addNamedEntityText('location', 'Manhattan', ['en'], ['Manhattan', 'manhattan']);
manager.addNamedEntityText('location', 'Staten island', ['en'], ['staten-island', 'Staten Island', 'Staten-Island', 'SI', 'si', 'S.I.', 's.i.']);

//Service Entities
manager.addNamedEntityText('service', 'food', ['en'], ['food']);
manager.addNamedEntityText('service', 'housing', ['en'], ['housing']);

//Group Entities
manager.addNamedEntityText('group', 'black', ['en'], ['black']);
manager.addNamedEntityText('group', 'latinx', ['en'], ['latinx']);
manager.addNamedEntityText('group', 'asian', ['en'], ['Asian', 'asian', 'asian-american', 'asian american']);
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
manager.addDocument('en', 'Are there any mutual aid funds in %location%?', 'find.mutualaid');
manager.addDocument('en', 'Are there any mutual aid funds for %group%?', 'find.mutualaid');
manager.addDocument('en', 'Are there any mutual aid funds that offer %service%?', 'find.mutualaid');
manager.addDocument('en', 'Are there any mutual aid funds that give %service%?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location% that offer %service% services?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location% that are part of %group%?', 'find.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds in %location% that offer %service% services and are part of %group%?', 'find.mutualaid');
manager.addDocument('en', 'Are there any ma funds in %location%?', 'find.mutualaid');
manager.addDocument('en', 'Any mutual aid funds in %location%?', 'find.mutualaid');
manager.addDocument('en', 'Can you find mutual aid funds in %location%?', 'find.mutualaid');
manager.addDocument('en', 'Show me mutual aid funds in %location%', 'find.mutualaid');
manager.addDocument('en', 'In %location%?', 'find.mutualaid');


manager.train({ epochs: 50 });


async function generateReply(message) {
  const result = await manager.process('en', message);
  const intent = result.intent;
  console.log(`Input message: ${message}, Intent: ${intent}`);
  console.log('Entities:', result.entities);

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
      console.log('Entities:', entities);
      const location = entities.find(e => e.entity === 'location')?.option;
      console.log('Location:', location);
      const groups = entities.filter(e => e.entity === 'group').map(e => e.option);
      console.log('Groups:', groups);
      const services = entities.filter(e => e.entity === 'service').map(e => e.option);
      console.log('Services:', services);

      const query = {
        location: entities.find(e => e.entity === 'location')?.option
      };

      console.log('Mafunds model:', Mafunds); //prints out the MaFunds model
      console.log('Query:', query);

      const fund = await Mafunds.find(query);
      console.log('Result of Mafunds.find(query):', fund); //print the result of the find operation
      console.log('Fund:', fund);
      if (fund) {
        return `Here is a mutual aid fund in ${location} that might be able to help you: ${fund[0].name}`;
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


