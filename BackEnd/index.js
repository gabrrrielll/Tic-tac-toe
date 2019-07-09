
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = 4000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
var users = []
io.on("connection", socket => {
    // console.log(io);
    console.log("Client connected");
    users.push({ id: socket.id, nickname: "" });
    // console.log(io.sockets)
    io.emit("users", users);
    socket.on("request", data => {
        io.to(data).emit("request", users.filter(user => user.id === socket.id)[0]);
    })
    socket.on("request_response", data => {
        if (data.response) {
            var room_id = data.id + socket.id;
            io.sockets.connected[data.id].alegere = false;
            socket.alegere = false;
            io.sockets.connected[data.id].room = room_id;
            socket.room = room_id;
            io.sockets.connected[data.id].join(socket.room)
            socket.join(socket.room);
            console.log("S-a creat o camera");
        }
        io.to(data.id).emit("request_response", data.response)
    })
    socket.on("game_response", data => {
        socket.alegere = data;
        // console.log(io.sockets.clients(socket.room));
        io.of("/").in(socket.room).clients((err, data) => {
            console.log(data);
            raspunsuri = data.map(s => {
                if (io.sockets.connected[s].alegere !== false) {
                    s.alegere = io.sockets.connected[s].alegere;
                }
                return s;
            });
            console.log(raspunsuri);
            if (raspunsuri.length === 2) {
                if (raspunsuri[0].alegere === "foarfeca") {
                    if (raspunsuri[1].alegere === "foarfeca") {
                        io.to(socket.room).emit("result", "egalitate");
                    } else if (raspunsuri[1].alegere === "piatra") {
                    } else if (raspunsuri[1].alegere === "foaie") {
                    }
                }
            } else {
            }
        })
    })
    socket.on("new_nick", data => {
        users = users.map(user => {
            if (user.id === socket.id) {
                user.nickname = data;
            }
            return user;
        })
        io.emit("users", users);
    })
    socket.on("disconnect", () => {
        users = users.filter(x => x.id !== socket.id);
        console.log(users);
        io.emit("users", users);
        console.log("Client disconnected")
    });
});
server.listen(port);