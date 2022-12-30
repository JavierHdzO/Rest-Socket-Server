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


const connectSocket = () => {
    socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });
}


const main = async() => {

   await validateJWT(); 
}


main();
 

