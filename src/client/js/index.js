/*按钮点击效果*/
$('.send').mousedown(function () {
    $(this).css({
        'background': "#007aff",
        'color': "#ffffff"
    });
})
$('.send').mouseup(function () {
    $(this).css({
        'background': "#e8e8e8",
        'color': "#ffffff"
    });
})
/*socket*/
window.onload = function () {
    var username = prompt('请输入您的姓名');
    if (!username) {
        alert('姓名必填');
        history.go(0);
    }
    //          username="子木";
    userId = genUid();

    var userInfo = {
        'userid': userId,
        'username': username
    };
    //连接socket后端服务器
    socket = io.connect("ws://127.0.0.1:4000");
    //通知用户有用户登录
    socket.emit('login', userInfo);
    //监听新用户登录
    socket.on('login', function (o) {
        updateMsg(o, 'login');
    });

    //监听新用户登录
    socket.on('pushMsg', function (o) {
        console.log(o);
    });

    //监听用户退出
    socket.on('logout', function (o) {
        updateMsg(o, 'logout');
    });
    //发送消息
    socket.on('message', function (obj) {
        if (obj.userid == userId) {
            var MsgHtml = '<section class="user clearfix">' +
                '<span>' + obj.username + '</span>' +
                '<div>' + obj.content + '</div>' +
                '</section>';
        } else {
            var MsgHtml = '<section class="server clearfix">' +
                '<span>' + obj.username + '</span>' +
                '<div>' + obj.content + '</div>' +
                '</section>';
        }
        $('.main-body').append(MsgHtml);
        $('.main-body').scrollTop(99999);
    })
    $('.send').click(function () {
        sendMsgEvt(userId, username);
    });

    $(document).keyup(function(event) {
        if(event.keyCode == 13){
          sendMsgEvt(userId, username);
        }
    });

    // var app = new Vue({
    //     el: '#app',
    //     data: {
    //         message: 'Hello Vue!'
    //     }
    // });
}

function sendMsgEvt(userId, username) {
    var content = $('input[name="msg"]').val();
    if (content) {
        var obj = {
            'userid': userId,
            'username': username,
            'content': content
        }
        socket.emit('message', obj);
        $('input[name="msg"]').val("");
    }
}

/*用户id生成*/
function genUid() {
    return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
}

function logout() {
    socket.disconnect();
    location.reload();
}
/*监听函数*/
function updateMsg(o, action) {
    //当前在线列表
    var onlineUser = o.onlineUser;
    //当前在线数
    var onlineCount = o.onlineCount;
    //新加用户
    var user = o.user;
    //更新在线人数
    var userList = '';
    var separator = '';
    for (key in onlineUser) {
        userList += separator + onlineUser[key];
        separator = '、';
    }
    //跟新房间信息
    $('.chatNum').text(onlineCount);
    $('.chatList').text(userList);
    //系统消息
    if (action == 'login') {
        var sysHtml = '<section class="chatRoomTip"><div>' + user.username + '进入聊天室</div></section>';
    }
    if (action == "logout") {
        var sysHtml = '<section class="chatRoomTip"><div>' + user.username + '退出聊天室</div></section>';
    }
    $(".main-body").append(sysHtml);
    $('.main-body').scrollTop(99999);
}