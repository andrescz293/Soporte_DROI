const ipcRenderer = require('electron').ipcRenderer;

document.addEventListener("DOMContentLoaded", function(event) {

});


/* CONTROL DE BOTONES DE VENTANA */
// const remote = require('electron').remote;

// document.getElementById("min-btn").addEventListener("click", function (e) {
//   var window = remote.getCurrentWindow();
//   window.minimize(); 
// });

// document.getElementById("max-btn").addEventListener("click", function (e) {
//   var window = remote.getCurrentWindow();
//   if (!window.isMaximized()) {
//     window.maximize();          
//   } else {
//     window.unmaximize();
//   }
// });

// document.getElementById("close-btn").addEventListener("click", function (e) {
//   var window = remote.getCurrentWindow();
//   window.close();
// }); 

/* CONTROL DE BOTONES DE VENTANA */


/* API LOGIN */
const ValidateUser = async () => {

  console.log('validando datos...');

  if ( document.getElementById('User').value == ""  ) {
    alert('Debe ingresar un nombre de usuario');
    return false;
  }
  if ( document.getElementById('Password').value == ""  ) {
    alert('Debe ingresar una conatraseña');
    return false;
  }

  let data_login = {
    user:document.getElementById('User').value,
    password:document.getElementById('Password').value
  }
  
  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/login" , {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data_login)
  })
  .then( res => res.json())
  .then( data =>{
    if (data.response.status == "success") {
      localStorage.setItem('user_data' , JSON.stringify(data.response.data))
      document.getElementById('response_login').innerHTML = ` <div class="alert alert-success" style="width: 80%;left: 10%;"> iniciando sesión </div>`
      setTimeout(() => {
        ipcRenderer.send('Main_Channel' , 'login');
      }, 1500)
      

    }else{
      document.getElementById('response_login').innerHTML = ` <div class="alert alert-danger" style="width: 80%;left: 10%;"> ${data.response.text} </div>`
      console.log(data);
    }

  } )

  return false;
};


/* API LOGIN */
