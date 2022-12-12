class SendMessage {
    constructor({ io, publisher_redis,socket }) {
        this.io = io;
        this.publisher_redis = publisher_redis;
    }

    init() {
        this.io = this.io
            .of("/quotation_list")
            .use((socket, next) => {
                next();
                this.socket = socket;
                // console.log(socket.id);
                // const { quotation_uuid } = socket.handshake.query;


                // QuotationInquire.getInfo(quotation_uuid).then((quotation) => {
                //     next();
                //     this.inquireForQuotations({ socket_id: socket.id, quotation_uuid });

                // }).catch((error) => {
                //     console.log(error);
                //     next(new Error("we can't open socket for you some error occur.. " + error.message));
                // });
            })
            .on('connection', (socket) => {
                socket.on('send',(param) => {
                    this.messageSender({
                        'body': 'Hello from ' + socket.id,
                        'socket_id': socket.id,
                    })
                    socket.emit('request', socket.id)

                });

                socket.on('disconnecting', function () {
                    // io.emit('chat.message', 'User has disconnected.');
                });
            });
    }

    messageSender({body, socket_id}) {
        console.log('send')
        this.publisher_redis.publish("redis-app-send-test-from-js", JSON.stringify({
            body,
            socket_id,
        }));
    }

    sendDataToClient({socket_id,body}){
        // console.log(body)
        this.socket.broadcast.emit('request',body); // broadcast
        // this.socket.emit('request',message); // send to me
        // this.io.local.emit('request',message); // send to all
    }
}

module.exports = SendMessage;
