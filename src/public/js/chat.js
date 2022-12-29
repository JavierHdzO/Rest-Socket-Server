
const socket = io();

socket.on('connect', () => {
    console.log("connected");
});

socket.on('disconnect', () => {
    console.log("connected");
});

socket.on('message', ( payload ) => {
    console.log(payload);
});