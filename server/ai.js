const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: true } });
const Mafunds = require('./models/Mafunds');
const { randomInt } = require('crypto');

//Location Entities
manager.addNamedEntityText('location', 'Queens', ['en'], ['Queens', 'queens']);
manager.addNamedEntityText('location', 'Online', ['en'], ['online', 'on the web']);
manager.addNamedEntityText('location', 'Bronx', ['en'], ['Bronx', 'bronx', 'BX', 'bx']);
manager.addNamedEntityText('location', 'Brooklyn', ['en'], ['Brooklyn', 'brooklyn', 'BK', 'bk']);
manager.addNamedEntityText('location', 'Manhattan', ['en'], ['Manhattan', 'manhattan']);
manager.addNamedEntityText('location', 'Staten island', ['en'], ['staten-island', 'Staten Island', 'Staten-Island', 'SI', 'si', 'S.I.', 's.i.']);

//Service Entities
manager.addNamedEntityText('service', 'food', ['en'], ['food']);
manager.addNamedEntityText('service', 'immigration', ['en'], ['immigration']);
manager.addNamedEntityText('service', 'legal', ['en'], ['legal','forms']);
manager.addNamedEntityText('service', 'housing', ['en'], ['housing','homeless','shelter']);
manager.addNamedEntityText('service', 'education', ['en'], ['education','school','learning','college']);
manager.addNamedEntityText('service', 'child-care', ['en'], ['child-care','child care', 'babysitting']);
manager.addNamedEntityText('service', 'mental health', ['en'], ['mental health', 'anxiety','psychosis', 'bipolar','depression', 'burn out', 'burn-out']);
manager.addNamedEntityText('service', 'immigrant support', ['en'], ['language', 'translation', 'immigrant']);

//Group Entities
manager.addNamedEntityText('group', 'black', ['en'], ['black', 'african-american', 'african american', 'african-american', 'african american', 'black-american', 'black american']);
manager.addNamedEntityText('group', 'women', ['en'], ['women', 'woman', 'girls', 'ladies', 'trans-women', 'trans-woman', 'trans woman', 'trans women']);
manager.addNamedEntityText('group', 'latinx', ['en'], ['latinx', "latino", "latina", "latinos", "latinas"]);
manager.addNamedEntityText('group', 'asian', ['en'], ['Asian', 'asian', 'asian-american', 'asian american']);
manager.addNamedEntityText('group', 'muslim', ['en'], ['muslim', 'islam', 'islamic', 'muslims', 'islamic']);
manager.addNamedEntityText('group', 'arab', ['en'], ['Arab','arab']);
manager.addNamedEntityText('group', 'indigenous', ['en'], ['indigenous', 'native-american']);
manager.addNamedEntityText('group', 'immigrant', ['en'], ['immigrant']);
manager.addNamedEntityText('group', 'lgbtq', ['en'], ['lgbtq', 'gay', 'lesbian', 'non-binary', 'trans', 'transgender', 'trans-gender', 'trans-women', 'trans-woman', 'trans woman', 'trans women']);
manager.addNamedEntityText('group', 'All', ['en'], ['all', 'everyone', 'anyone', 'anybody', 'anyone', 'anyone', 'anybody', 'anybody', 'anyone']);

//Greeting Intents
manager.addDocument('en', 'hi', 'greeting.hello');
manager.addDocument('en', 'hiya', 'greeting.hello');
manager.addDocument('en', 'Hello my name is %name%', 'greeting.hello');
manager.addDocument('en', 'hey', 'greeting.hello');
manager.addDocument('en', 'good morning', 'greeting.hello');

//How Are You Intents
manager.addDocument('en', 'how are you', 'greetings.howareyou');

//Name Intents
manager.addDocument('en', 'what is your name', 'greetings.name');
manager.addDocument('en', 'whats your name', 'greetings.name');

//When the user is vague
manager.addDocument('en', 'Can you help me find a mutual aid fund?', 'begin.mutualaid');
manager.addDocument('en', 'What are some mutual aid funds?', 'begin.mutualaid');
manager.addDocument('en', 'What are some ma funds?', 'begin.mutualaid');
manager.addDocument('en', 'I need to find mutual aid funds', 'begin.mutualaid');
manager.addDocument('en', 'I need to find an ma fund', 'begin.mutualaid');
manager.addDocument('en', 'help', 'begin.mutualaid');
manager.addDocument('en', 'help me', 'begin.mutualaid');

//Find Mutual Aid Fund Intents
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
manager.addDocument('en', 'Can you help me find mutual aid funds that provide %service%', 'find.mutualaid');


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
      return 'Can you provide me with more infomation about your location, the type of services your looking for, or if you are apart of any marginalized group?';

    case 'find.mutualaid':
      const { entities } = result;
      console.log('Entities:', entities);
      const location = entities.find(e => e.entity === 'location')?.option;
      console.log('Location:', location);
      const groups = entities.filter(e => e.entity === 'group').map(e => e.option);
      console.log('Groups:', groups);
      const services = entities.filter(e => e.entity === 'service').map(e => e.option);
      console.log('Services:', services);

      const query = {};

      if (location) {
        query.location = location;
      }

      if (groups.length > 0) {
        query.groups = { $in: groups };
        //query.groups = { $in: [...groups, 'All'] };
      }

      if (services.length > 0) {
        query.services = { $in: services };
      }

      console.log('Mafunds model:', Mafunds); //prints out the MaFunds model
      console.log('Query:', query);

      const fund = await Mafunds.find(query);
      console.log('Result of Mafunds.find(query):', fund); //print the result of the find operation
      console.log('Fund:', fund);

      if (fund && fund.length > 0) {
        const randomIndex = randomInt(fund.length);
        const randomFund = fund[randomIndex];
        let response = "Here's a mutual aid fund that might be able to help you:\n";
        response += `${randomFund.name}\n`;
        response += `Description: ${randomFund.description}\n`;
        response += `Website: ${randomFund.website}\n`;
        response += `Contact: ${randomFund.contact}\n\n`;

        return response;
      } 
      else {
        return `I'm sorry, I couldn't find any mutual aid funds that match your search.`;
      }
      
    default:
      return "I'm sorry, I'm not sure I understand your message. Try asking me about mutual aid funds in NYC.";
  }  
}


module.exports = {
  generateReply,
};


