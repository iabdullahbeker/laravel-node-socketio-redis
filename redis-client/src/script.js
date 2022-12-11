const socket = io("ws://localhost:3000/quotation_list");


socket.emit('send','test_data');

// receive a message from the server
socket.on("request", (...args) => {
  console.log(args);
});
