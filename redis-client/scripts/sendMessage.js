class SendMessage {
    constructor({ io, publisher_redis }) {
        this.io = io;
        this.publisher_redis = publisher_redis;
    }

    init() {
        this.io = this.io
            .of("/quotation_list")
            .use((socket, next) => {
                next();
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
                        'quotation_uuid': '1231231',
                        'socket_id': socket.id,
                    })
                    socket.emit('request', socket.id)

                });
                
                socket.on('disconnecting', function () {
                    // io.emit('chat.message', 'User has disconnected.');
                });

                socket.on('inquire.result', (messageData) => {
                    this.inquireForQuotations({
                        ...messageData,
                        socket_id: socket.id,
                    });
                });
            });
    }

    messageSender({quotation_uuid, socket_id}) {
        this.publisher_redis.publish("redis-app-send-test-from-js", JSON.stringify({
            quotation_uuid,
            socket_id,
        }));
    }

    sendDataToClient({socket_id,message}){
        console.log(socket_id,message)
        this.io.to(socket_id).emit('request',message);
    }
}

module.exports = SendMessage;