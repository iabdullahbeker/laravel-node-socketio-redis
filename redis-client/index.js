require('dotenv').config();
const Redis = require("ioredis");
const redis_configs = require("./config");
const http = require("http");
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express({});
const publisher_redis = new Redis(redis_configs);
const subscriber_redis = new Redis(redis_configs);
const SendMessage = require('./scripts/sendMessage');
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

server.listen(PORT, () => {
    console.log(`listening on port ${PORT} `);
});

const sendMessage = new SendMessage({io,publisher_redis});



subscriber_redis.subscribe("redis-app-send-message-to-client");
subscriber_redis.on("message", (channel, data) => {
    console.log('redis', channel, data);
    if (channel === "redis-app-send-message-to-client") {
        const { socket_id, message } = JSON.parse(data);
        sendMessage.sendDataToClient({socket_id, message});
        // io.to(socket_id).emit('request', message);
    }
});



sendMessage.init();