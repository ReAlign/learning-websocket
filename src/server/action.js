const Action = {
    pushMsg(io) {
        io.emit('pushMsg', {
            title: 'pushMsg',
            content: 'content'
        });

        console.log('push');
    }
};

module.exports = Action;