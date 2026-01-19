const amqp = require('amqplib');

async function sendMessage() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  const queue = 'messages';
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from('Hello RabbitMQ!'));
  console.log('Message sent');
  setTimeout(() => conn.close(), 500);
}

sendMessage();