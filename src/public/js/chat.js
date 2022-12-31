const url = ( window.location.hostname.includes('localhost'))
            ? 'http://localhost:3000/api/auth/'
            : '';

let user = null;
let socket = null;


// References HTML

const txtUid = document.getElementById('txtUid') ;
const txtMessage = document.getElementById('txtMessage');
const ulUsers = document.getElementById('ulUsers');
const ulMessages = document.getElementById('ulMessages')
const btnLogOut = document.getElementById('btnLogOut');


//Validate JWT for connecting to socket
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

    if( !ok && msg.length > 0){
        console.log('paso la validacion');
        localStorage.removeItem('token');
        window.location = 'index.html';
        console.error(msg);
    }

    const { user: usr , token: old_Token, refresh_token } = data;
    localStorage.setItem('token', refresh_token);
    user = usr;
    document.title = user.name;

    await connectSocket();
    return true;
}

// Emit and Listen sockets
const connectSocket = () => {
    socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('User connected');
    });

    socket.on('disconnect', () => {
        console.log('User Offline');
    });

    socket.on('recieve-message', () => {
        // Todo
    });

    socket.on('users-on', ( users ) => {
        // Todo
        
        drawUsers(users);
    });

    socket.on('private message', () => {
        // Todo
    });


}

const drawUsers = ( users ) => {

    ulUsers.replaceChildren([]);
    users.forEach( user => {
       const li = document.createElement('li');
       const h5 = document.createElement('h5');
       const span = document.createElement('span');

       h5.classList.add('text-success');
       h5.textContent = user.name;
       
       span.classList.add('fs-6');
       span.classList.add('text-muted');
       span.textContent = user.uid;

       li.appendChild(h5);
       li.appendChild(span);
       
       ulUsers.appendChild(li);
    });
}


const main = async() => {

   await validateJWT(); 
}


main();
 

