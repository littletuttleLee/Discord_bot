const mongoose = require('mongoose');
require('dotenv').config();

const { printlist , randomfood , makebuttom } = require('./foodlist');

async function connectMongoDB () {
  try {
      await mongoose.connect(process.env.dburl)
      console.log('Connected to MongoDB...')
  } catch (error) {
      console.log(error)
  }
}

connectMongoDB()

const todoSchema = new mongoose.Schema({
  id: Number,
  title: String,
  BusinessDay: String,
  BusinessHours:String,
  navigation:String,
});

const Todo = mongoose.model('discordfood', todoSchema);

const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    ChannelManager,
  } = require('discord.js');



  const client = new Client({
    intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent],
      partials:[
          Partials.Channel
      ]
  });

  client.once(Events.ClientReady, () => {
    console.log('Ready!');
  });

  // const channel = client.channels.cache.get('1178732339241697280');//1178712145190473868
  // channel.send('testmsg');
  let foodlistdata = [];
  let foodbuttomdata = "";

  client.on(Events.InteractionCreate, async (interaction) => {
    //console.log(interaction)
     //console.log(interaction.commandName)
    // console.log(interaction.customId)
    foodlistdata = await Todo.find();

    if(interaction.commandName === 'foodlist'){
      interaction.reply(printlist(foodlistdata));
    }
    if(interaction.commandName === 'test'){
      console.log((new Date()).getDay());
      //await interaction.reply(JSON.stringify(testdata));
    }
    if(interaction.commandName === 'foodrandom'){
      //console.log((new Date).getDay())
      
      foodbuttomdata = await randomfood(foodlistdata)
      
      interaction.reply(await makebuttom(foodbuttomdata))
    }
    if(interaction.commandName === 'pushnewdata'){
      await interaction.reply("分別輸入:店名/營業星期/營業時間/導航連結");
    }

    if(interaction.customId=="click_one"){
      const tododata = await Todo.find({title:`${foodbuttomdata}`});

      //console.log(tododata);

      await interaction.reply(`${tododata[0]["title"]}\n營業星期 : ${tododata[0]["BusinessDay"]}\n營業時間 : ${tododata[0]["BusinessHours"]}\n直接導航 : ${tododata[0]["navigation"]}`);
      // await interaction.channel.send(`營業星期 : ${tododata["BusinessDay"]}`);
      // await interaction.channel.send(`營業時間 : ${tododata["BusinessHours"]}`);
      // await interaction.channel.send(`直接導航 : ${tododata["navigation"]}`);

    }else if(interaction.customId=="click_cancel"){
      foodbuttomdata = await randomfood(foodlistdata)
      
      interaction.reply(await makebuttom(foodbuttomdata))
    }else if(interaction.customId=="class_select_foodlist"){
      await interaction.message.delete();
      const tododata = await Todo.find({title:`${interaction.values[0]}`});
      await interaction.reply(`${tododata[0]["title"]}\n營業星期 : ${tododata[0]["BusinessDay"]}\n營業時間 : ${tododata[0]["BusinessHours"]}\n直接導航 : ${tododata[0]["navigation"]}`);
      await interaction.channel.send(printlist(foodlistdata));
    }
  })


  let test = 0;
  let testdata = [];
  client.on(Events.MessageCreate, async (interaction) =>{
    if((interaction.content).indexOf("維尼小熊")!=-1){
      interaction.delete();
    }
    if(interaction.author.bot && interaction.content=="輸入一變數"){
      test = 1;
      testdata=[];
    }
    if(interaction.author.username=="littletuttle"){
      if(test>=1 && test!=5){testdata[test-1]=interaction.content; test+=1;}
      else if(test==5){
        if(interaction.content=="push"){
        test=0;
        const todo = new Todo({
              id: new Date().getTime(),
              title: testdata[0],
              BusinessDay: testdata[1],
              BusinessHours:testdata[2],
              navigation:testdata[3],
            });
        await todo.save();
        console.log("新增成功!!");
        await interaction.channel.send("新增成功~")
        }else if(interaction.content=="show"){
          await interaction.channel.send(JSON.stringify(testdata))
        }
      }
            
          
    }
  })

  client.login(process.env.discordid);
