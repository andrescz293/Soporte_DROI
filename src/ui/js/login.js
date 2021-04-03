const ipcRenderer = require('electron').ipcRenderer;
const Alert = require("electron-alert");

document.addEventListener("DOMContentLoaded", function(event) {
    
  /* CONTROL DE BOTONES DE VENTANA */

  document.getElementById("min-btn").addEventListener("click", function (e) {
    ipcRenderer.send('Main_Channel' , {action:'Minimize_Login'});
  });

  document.getElementById("max-btn").addEventListener("click", function (e) {
    ipcRenderer.send('Main_Channel' , {action:'Maximize_Login'});
    if ( document.getElementsByClassName("header_title")[0].classList.contains('block_drag') ) {
      document.getElementsByClassName("header_title")[0].classList.remove('block_drag');
      document.getElementsByClassName('header_title')[0].setAttribute('draggable', true);
    } else {
      document.getElementsByClassName("header_title")[0].classList.add('block_drag');
      document.getElementsByClassName('header_title')[0].setAttribute('draggable', false);
    }
  });

  document.getElementById("close-btn").addEventListener("click", function (e) {
    ipcRenderer.send('Main_Channel' , {action:'Close_Login'});
  }); 

  /* CONTROL DE BOTONES DE VENTANA */

});




/* API LOGIN */
const ValidateUser = async () => {
  

  console.log('validando datos...');

  if ( document.getElementById('User').value == ""  ) {
    // alert('Debe ingresar un nombre de usuario');
    notifyMe( 'Login' , {Title:'Campo vacio' , Body:'Debe ingresar un nombre de usuario' }  )
    return false;
  }
  if ( document.getElementById('Password').value == ""  ) {
    // alert('Debe ingresar una contraseña');
    notifyMe( 'Login' , {Title:'Campo vacio' , Body:'Debe ingresar una contraseña' }  )

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
      console.log(data.response);
      localStorage.setItem('user_data' , JSON.stringify(data.response.data))
      document.getElementById('response_login').innerHTML = ` <div class="alert alert-success" style="width: 80%;left: 10%;"> iniciando sesión </div>`
      setTimeout(() => {
        ipcRenderer.send('Main_Channel' , {action:'login_Validation'});
      }, 1500)
    }else{
      document.getElementById('response_login').innerHTML = ` <div class="alert alert-danger" style="width: 80%;left: 10%;"> ${data.response.text} </div>`
      console.log(data);
    }

  } )

  return false;
};


/* API LOGIN */
