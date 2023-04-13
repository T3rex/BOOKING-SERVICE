const amqplib = require('amqplib');
const {MESSAGE_BROKER_URL,EXCHANGE_NAME} = require('../config/serverConfig');


const createChannel = async () =>{
    try {
        const conn = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await conn.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'direct',false);
        return channel;           
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const subscribeMessage = async (channel,service, binding_key) =>{

    try {
        const applicationQueue = await channel.asserQueue("MAILING_QUEUE");
        channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);
    
         channel.consume(applicationQueue.queue,msg =>{
            console.log('received data');
            console.log(msg.content.toString());
            channel.ack(msg);
         });        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const publishMessage = async (channel,binding_key,message) =>{
    try {
        await channel.assertQueue("MAILING_QUEUE");
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports ={
    subscribeMessage,
    createChannel,
    publishMessage
}