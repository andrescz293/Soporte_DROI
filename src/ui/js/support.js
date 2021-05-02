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

    document.getElementById('info').classList.remove('type-active')
    document.getElementById('evo').classList.remove('type-active')
    document.getElementById('chat').classList.remove('type-active')
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

    document.getElementById('info').classList.add('type-active')
    document.getElementById('evo').classList.remove('type-active')
    document.getElementById('chat').classList.remove('type-active')

    document.getElementsByClassName('info-support')[0].style.display = 'block'
    document.getElementsByClassName('evo-support')[0].style.display = 'none'
    document.getElementsByClassName('chat-support')[0].style.display = 'none'
    
  }
  if (type == "evo") {
    GetEvo()

    document.getElementById('info').classList.remove('type-active')
    document.getElementById('evo').classList.add('type-active')
    document.getElementById('chat').classList.remove('type-active')

    document.getElementsByClassName('info-support')[0].style.display = 'none'
    document.getElementsByClassName('evo-support')[0].style.display = 'block'
    document.getElementsByClassName('chat-support')[0].style.display = 'none'
  }
  if (type == "chat") {
    Getinfo()

    document.getElementById('info').classList.remove('type-active')
    document.getElementById('evo').classList.remove('type-active')
    document.getElementById('chat').classList.add('type-active')

    document.getElementsByClassName('info-support')[0].style.display = 'none'
    document.getElementsByClassName('evo-support')[0].style.display = 'none'
    document.getElementsByClassName('chat-support')[0].style.display = 'block'
  }
}

function delete_support( index ){
  Support_List.splice( index, 1 );
  list_supports();
}


/* API INFORMACION SOPORTE */
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

      const {Id_Business, Id_Licence, Representative, Phone, Date, Type, Priority, Days_Delivery, Subject, Adviser, Description } = jsonResponse.response.data;

      document.getElementById('Business_info').innerHTML = Id_Business 
      document.getElementById('License_info').innerHTML = Id_Licence
      document.getElementById('Representative_info').innerHTML = Representative
      document.getElementById('Phone_info').innerHTML = Phone
      document.getElementById('Date_info').innerHTML = moment.unix(Date).format("DD/MM/YY h:m A")
      document.getElementById('Type_info').innerHTML = Type
      document.getElementById('Priority_info').innerHTML = Priority
      document.getElementById('DaysDelivery_info').innerHTML = Days_Delivery
      document.getElementById('Subject_info').innerHTML = Subject
      document.getElementById('Adviser_info').innerHTML = Adviser
      document.getElementById('Description_info').innerHTML = Description

    }else{
      console.log(jsonResponse);
    }

  } )

  return false;
};
/* API INFORMACION SOPORTE */


/* API EVOLUCIONES */
const GetEvo = async () => {

  let data_support = {
    id_support:document.getElementById('support_selected').value,
  }
  
  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/evo" , {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data_support)
  })
  .then( res => res.json())
  .then( jsonResponse =>{
    const { status , data } = jsonResponse.response
    let List_Evolutions = "";
    let num = 0;

    console.log(data);

    if (status == "success") {
      data.forEach(element => {
        
        List_Evolutions+= `
        <tr class="align-middle">
          <td>${++num}</td>
          <td>${element.Name}</td>
          <td>${element.Description}</td>
          <td>${moment.unix(element.Date).format("DD/MM/YY")} <br>  ${moment.unix(element.Date).format("h:m A")}   </td>
          <td class="file_download">
          <i class="fas fa-paperclip" onclick=""></i> ${element.Attached} Descargar
          </td>
        </tr>`

      });

      document.getElementById('response_evolutions').innerHTML = List_Evolutions


    }else if(status == "warning"){
      document.getElementById('response_evolutions').innerHTML = ` <tr> <td colspan="5"> ${data} </td> </tr> `
    }else{
      console.log(data);
    }

  } )

  return false;
};
/* API EVOLUCIONES */

/* API INFORMACION SOPORTE */
const insertEvo = async () => {

  var UserData = JSON.parse(localStorage.getItem('user_data'))
  

  let data_login = {
    Id_Ticket:document.getElementById('support_selected').value,
    Type_User: "Support" ,
    Id_User: UserData.Code_Adviser,
    Name: UserData.First_Name+' '+UserData.Surname,
    // Description:,
    Attached,
    Date,
    tate
  }
  
  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/evo/add" , {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data_login)
  })
  .then( res => res.json())
  .then( jsonResponse =>{
    if (jsonResponse.response.status == "success") {

    }else{
      console.log(jsonResponse);
    }

  } )

  return false;
};
/* API INFORMACION SOPORTE */


function openModal(Id_Modal , options = {} ){
  var modalVar = new bootstrap.Modal(document.getElementById('modal_NewEvo'), {keyboard:false,backdrop:'static'})
  modalVar.show();
}


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
