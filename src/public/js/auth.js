const btn_SignOut = document.getElementById('google_signout');
const form_SignIn = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost'))
            ? 'http://localhost:3000/api/auth/'
            : '';

            //'http://localhost:3000/api/auth/google'
function handleCredentialResponse(response) {
    //response.credential
     const body = { idToken: response.credential};

     fetch(url+'google', {
         method: 'POST',
         headers:{
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(body)
         
     })
         .then( resp => resp.json() )
         .then( ({token}) => {
            //  console.log(resp);
            //  localStorage.setItem('email', resp.user.email);
             localStorage.setItem('token', token);
             // location.reload();
             // location.assign('chat.html');

         })
         .catch( console.warn )

    
 }


 form_SignIn.addEventListener('submit', ( event ) => {
     event.preventDefault();
     const formData = {};

     for( let element of form_SignIn.elements) {
        if( element.name.length > 0 )
            formData[element.name] =  element.value
     }

    fetch(url+'login', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then( resp => resp.json() )
    .then( ({ok, msg, data })=>{
        
        if(!ok){
            console.error(msg);
            return;
        }
        const { token } = data;
        localStorage.setItem('token', token);
        
    })
    .catch( console.log );
 });


 btn_SignOut.onclick = async()=>{

     console.log(google.accounts.id);
     google.accounts.id.disableAutoSelect();
     await google.accounts.id.revoke( localStorage.getItem('email'), ( done ) => {
         localStorage.clear(); 
         location.reload();
     });

 }