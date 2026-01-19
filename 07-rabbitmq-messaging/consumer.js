const amqp = require('amqplib');

async function consumeMessages() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  const queue = 'messages';
  await channel.assertQueue(queue);
  console.log('Waiting for messages...');
  channel.consume(queue, (msg) => {
    console.log('Received:', msg.content.toString());
    channel.ack(msg);
  });
}

consumeMessages();