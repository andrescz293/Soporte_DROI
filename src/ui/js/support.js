const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote


document.addEventListener("DOMContentLoaded", function(event) {
  
  /* ESCUCHAS OPCIONES SOPORTE */
  document.getElementById("info").addEventListener("click", function (e) {
    load_content("info" , document.getElementById('support_selected').value )
  });
  document.getElementById("evo").addEventListener("click", function (e) {
    load_content("evo" , document.getElementById('support_selected').value )
  });
  document.getElementById("chat").addEventListener("click", function (e) {
    load_content("chat" , document.getElementById('support_selected').value )
  });
  /* FIN ESCUCHAS OPCIONES SOPORTE */

    
  /* CONTROL DE BOTONES DE VENTANA */

  document.getElementById("min-btn").addEventListener("click", function (e) {
    ipcRenderer.send('Main_Channel' , {action:'Minimize_Support'});
  });

  document.getElementById("max-btn").addEventListener("click", function (e) {
    ipcRenderer.send('Main_Channel' , {action:'Maximize_Support'});
    if ( document.getElementsByClassName("header_title")[0].classList.contains('block_drag') ) {
      document.getElementsByClassName("header_title")[0].classList.remove('block_drag');
      document.getElementsByClassName('header_title')[0].setAttribute('draggable', true);
    } else {
      document.getElementsByClassName("header_title")[0].classList.add('block_drag');
      document.getElementsByClassName('header_title')[0].setAttribute('draggable', false);
    }
  });

  document.getElementById("close-btn").addEventListener("click", function (e) {
    ipcRenderer.send('Main_Channel' , {action:'Close_Support'});
  }); 

  /* CONTROL DE BOTONES DE VENTANA */

});

ipcRenderer.on('Support_Channel' , (event , arg) => {
  Search_Id = Support_List.map(element => element.Id_Support)
  if (Search_Id.includes(arg.data) == false) {
    Support_List.push({Id_Support: arg.data })    
    console.log(Support_List);
    list_supports();
    document.getElementById('support_selected').value = arg.data
  }
})

function list_supports(){
  let List= ""
  if(Support_List.length !== 0 ){
    Support_List.forEach(element => {
    Search_Id = Support_List.map(element => element.Id_Support)
    Search_Id = Search_Id.indexOf(element.Id_Support)
    List += `
    <div class="content-block">
      <div class="content-icon" onclick="delete_support(${Search_Id})">
        <i class="fas fa-times-circle"></i>
      </div>
      <div class="content-text" onclick="select_support(${element.Id_Support})">
        <p> ${element.Id_Support} </p>
      </div>
    </div>
    `
    });
  }else{
    var window = remote.getCurrentWindow();
    window.hide();
    document.getElementsByClassName('info-support')[0].style.display = 'none'
    document.getElementsByClassName('evo-support')[0].style.display = 'none'
    document.getElementsByClassName('chat-support')[0].style.display = 'none'
  }

  document.getElementById('nav_list').innerHTML = List

}

function select_support(Id){
  document.getElementById('support_selected').value = Id

  if (document.getElementsByClassName('info-support')[0].style.display == 'block') {
    load_content('info' , Id);
  }
  if (document.getElementsByClassName('evo-support')[0].style.display == 'block') {
    load_content('evo' , Id);
  }
  if (document.getElementsByClassName('chat-support')[0].style.display == 'block') {
    load_content('chat' , Id);
  }
  
}

function load_content ( type , id ){
  if (type == "info") {
    Getinfo()
    document.getElementsByClassName('info-support')[0].style.display = 'block'
    document.getElementsByClassName('evo-support')[0].style.display = 'none'
    document.getElementsByClassName('chat-support')[0].style.display = 'none'
  }
  if (type == "evo") {
    Getinfo()
    document.getElementsByClassName('info-support')[0].style.display = 'none'
    document.getElementsByClassName('evo-support')[0].style.display = 'block'
    document.getElementsByClassName('chat-support')[0].style.display = 'none'
  }
  if (type == "chat") {
    Getinfo()
    document.getElementsByClassName('info-support')[0].style.display = 'none'
    document.getElementsByClassName('evo-support')[0].style.display = 'none'
    document.getElementsByClassName('chat-support')[0].style.display = 'block'
  }
}

function delete_support( index ){
  Support_List.splice( index, 1 );
  list_supports();
}


/* API LOGIN */
const Getinfo = async () => {

  console.log('Support info');

  let data_login = {
    id_support:document.getElementById('support_selected').value,
  }
  
  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/info" , {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data_login)
  })
  .then( res => res.json())
  .then( jsonResponse =>{
    if (jsonResponse.response.status == "success") {
      console.log(jsonResponse.response);
      document.getElementById('Business_info').innerHTML = '<kbd>'+jsonResponse.response.data.Id_Business+'</kbd>' 
      document.getElementById('License_info').innerHTML = jsonResponse.response.data.Id_Licence
      document.getElementById('Representative_info').innerHTML = jsonResponse.response.data.Representative
      document.getElementById('Phone_info').innerHTML = jsonResponse.response.data.Phone
      document.getElementById('Date_info').innerHTML = jsonResponse.response.data.Date
      document.getElementById('Type_info').innerHTML = jsonResponse.response.data.Type
      document.getElementById('Priority_info').innerHTML = jsonResponse.response.data.Priority
      document.getElementById('DaysDelivery_info').innerHTML = jsonResponse.response.data.Days_Delivery
      document.getElementById('Subject_info').innerHTML = jsonResponse.response.data.Subject
      document.getElementById('Adviser_info').innerHTML = jsonResponse.response.data.Adviser
      document.getElementById('Description_info').innerHTML = jsonResponse.response.data.Description

      // localStorage.setItem('user_data' , JSON.stringify(data.response.data))
      // document.getElementById('response_login').innerHTML = ` <div class="alert alert-success" style="width: 80%;left: 10%;"> iniciando sesión </div>`
    }else{
      // document.getElementById('response_login').innerHTML = ` <div class="alert alert-danger" style="width: 80%;left: 10%;"> ${data.response.text} </div>`
      console.log(data);
    }

  } )

  return false;
};
/* API LOGIN */


/* API LOGIN */
const GetEvo = async () => {

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


/* API LOGIN */
const GetChat = async () => {

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
