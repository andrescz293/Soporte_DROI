const ipcRenderer = require('electron').ipcRenderer;
let data_user
let Array_Pendings = [];
let Array_LastConsult = [];
let total_pendings = 0;


document.addEventListener("DOMContentLoaded", function(event) {
  if ( localStorage.getItem('user_data')  == null || localStorage.getItem('user_data')  ==  "" ) {
    console.log('sin usuario');
    ipcRenderer.send('Main_Channel' , {action:'Login_window'});
  }else{
    load_user();
  }

    /* CONTROL DE BOTONES DE VENTANA */

    document.getElementById("min-btn").addEventListener("click", function (e) {
      ipcRenderer.send('Main_Channel' , {action:'Minimize_Index'});
    });
  
    // document.getElementById("max-btn").addEventListener("click", function (e) {
    //   ipcRenderer.send('Main_Channel' , {action:'Maximize_Index'});
    //   if ( document.getElementsByClassName("header_title")[0].classList.contains('block_drag') ) {
    //     document.getElementsByClassName("header_title")[0].classList.remove('block_drag');
    //     document.getElementsByClassName('header_title')[0].setAttribute('draggable', true);
    //   } else {
    //     document.getElementsByClassName("header_title")[0].classList.add('block_drag');
    //     document.getElementsByClassName('header_title')[0].setAttribute('draggable', false);
    //   }
    // });
  
    document.getElementById("close-btn").addEventListener("click", function (e) {
      ipcRenderer.send('Main_Channel' , {action:'Close_Index'});
    }); 

    document.getElementById("check_All").addEventListener('change' , function (e) {
      GetPendingSupports(data_user.Code_Adviser , 0);
  })
  
    /* CONTROL DE BOTONES DE VENTANA */
});


ipcRenderer.on('Index_Channel' , (event , arg) => {
  if (arg == 'Login_Success') {
    load_user();
  }
})

const GetPendingSupports = async (Id_Advisor , notify = 1) => {
  console.log("Getting data pending...")

  let list_all = document.getElementById("check_All").checked;
  let data_login = { Id: Id_Advisor , Check_All: list_all }

  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/supports/pendings" , {
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(data_login)
  })
  .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
  
  if (request.status == 502) {
    GetPendingSupports(data_user.Code_Adviser);
  }

  const data = await request.json()
  Array_Pendings = data

  if (JSON.stringify(Array_LastConsult) !== JSON.stringify(Array_Pendings)) {
    console.log('Nuevos datos');
    Total_News = Object.keys(data).length - Object.keys(Array_LastConsult).length
    Array_LastConsult = data

    if (notify === 1) {
      notifyMe("New_Support" , {Body: "..." , Title: "Nuevo soporte, Soportes: "+Total_News })
    }
    if ( Array.isArray(Array_Pendings) ) {
      List_PendingSupports();
      
    }else{
      document.getElementById('list_pendings').innerHTML = Array_Pendings.status.text
    }

  }else{
    Array_LastConsult = data
  }


  

};

function closeSession (){
  localStorage.removeItem('user_data');
  ipcRenderer.send('Main_Channel' , {action:'Login_window'});
  // setTimeout(() => {
  //   ipcRenderer.send('Main_Channel' , {action:'login_Validation'});  
  // }, 1000)
}

function load_user(){
  data_user = JSON.parse(localStorage.getItem('user_data'));
  document.getElementById('user_name').innerHTML = data_user.Treatment +" "+ data_user.First_Name +" "+ data_user.Surname;
  document.getElementById('user_rol').innerHTML = data_user.Name_Roll;
  
  if (Array_Pendings.length === 0) {
    document.getElementById('list_pendings').innerHTML = '<div style=" text-align:center"><i style="font-size:30px;" class="fas fa-spinner fa-spin"></i></div>';
  }
  // Reload de soportes pendientes 
  setInterval(() => {
    GetPendingSupports(data_user.Code_Adviser);
  }, 5000)
  
}

function List_PendingSupports (){
  let info_show = "";
  let state_show = "";
  Array_Pendings.forEach(element => {

    moment.locale('es')
    
    Description = ( element.Description.length > 100 ) ?  element.Description.substr(0,100)+'...' : element.Description ;

    switch (element.State) {
      case 'Finalized':
        state_show = "Finalizado";
        break;
      case 'Pending':
        state_show = "Pendiente";
        break;
      case 'Delayed':
        state_show = "Retrasado";
        break;
      case 'Paused':
        state_show = "Pausado";
        break;
    }

    TimeShow = moment.unix( element.Date );
    // total_pendings = (element.State !== "Finalized") ? total_pendings++ : total_pendings ;
    info_show = info_show+`

    <div class="container-blocks pendings-block container-${element.State} " onclick="load_Window_Support(${element.Id})">

        <div class="row div_block">
          <div class="p-block-business">
            <span> ${element.Business_Name.toUpperCase()} </span>
          </div>
          <div class="p-block-state ${element.State}">
            <li > <span>${state_show} </span> </li>
          </div>
        </div>

        <div class="row div_block">
          <div class="p-block-2">
            <p> <b>  ${Description} </b> </p>
          </div>
        </div>

        <div class="row div_block">
          <div class="p-block-id">
            <span class="" > ID: <b>${element.Id}</b> </span>
          </div>
          <div class="p-block-date">
            <span class="" > ${TimeShow.fromNow()} </span>
          </div>
        </div>

      </div>
  `;  
  });

  document.getElementById('list_pendings').innerHTML = info_show;
  // notifyMe( 'New_Support' , {Title:'Soportes sin finalizar ' + total_pendings , Body:'' }  )
  
}

function load_Window_Support( Id_Support ){
  // Support_List.push({Id_Support: Id_Support})
  ipcRenderer.send('Main_Channel' , {action:'Window_Support' , data:Id_Support });
}



