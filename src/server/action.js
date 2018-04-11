module.exports = Action = {
    pushMsg(io) {
        io.emit('pushMsg', {
            title: 'pushMsg',
            content: 'content'
        });

        console.log('push');
    }
};