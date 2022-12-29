const url = ( window.location.hostname.includes('localhost'))
            ? 'http://localhost:3000/api/auth/'
            : '';

let user = null;
let socket = null;

const validateJWT = async() => {

    const token = localStorage.getItem('token');

    if( token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('Token not found');
    }

    const resp = await fetch(url, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'x-token': token
        },
    });

    const { data, ok, msg } = await resp.json();

    if( !ok ){
        localStorage.removeItem('token');
        window.location = 'index.html';
        console.error(msg);
        return false;
    }

    const { user: usr , token: old_Token, refresh_token } = data;
    localStorage.setItem('token', refresh_token);
    user = usr;
    return true;
}


const main = async() => {

   await validateJWT(); 
}


main();
 socket = io();

socket.on('connect', () => {
    console.log("connected");
});

socket.on('disconnect', () => {
    console.log("connected");
});

socket.on('message', ( payload ) => {
    console.log(payload);
});