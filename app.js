const express = require('express');
const app = express();

app.use(express.static(__dirname + "/public"));
const server = app.listen(8000);

const io = require('socket.io')(server);

let users = [];
let messages = [];

io.on('connect', function(socket){
    socket.emit('connection', {msg: "Connection Successful"});
    socket.on('new_user', function(data) {
        users.push({id: this.id, username: data});
        io.emit('update', users);
        io.emit('update_messages', messages);
    });

    socket.on('new_message', function(data) {
        var message = data;
        let user = users.find(u => u.id === this.id);
        messages.push({user: user["username"], message: message});
        io.emit('update_messages', messages);
    })

    socket.on('disconnect', function(socket){
        let username;
       for(let i = 0; i < users.length; i++) {
           if(users[i]["id"] == this.id)
           {
               //username = users[i].username;
               users.splice(i, 1);
               break;
           }
       }
       io.emit('update', users);
    });
});