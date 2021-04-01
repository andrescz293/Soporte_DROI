const ipcRenderer = require('electron').ipcRenderer;
let data_user
let Array_Pendings = [];
let Array_LastConsult = [];

document.addEventListener("DOMContentLoaded", function(event) {
  if ( localStorage.getItem('user_data')  == null || localStorage.getItem('user_data')  ==  "" ) {
    console.log('sin usuario');
    ipcRenderer.send('Main_Channel' , 'Login_window');
  }else{
    load_user()
  }

    /* CONTROL DE BOTONES DE VENTANA */

    document.getElementById("min-btn").addEventListener("click", function (e) {
      ipcRenderer.send('Main_Channel' , 'Minimize_Index');
    });
  
    // document.getElementById("max-btn").addEventListener("click", function (e) {
    //   ipcRenderer.send('Main_Channel' , 'Maximize_Index');
    //   if ( document.getElementsByClassName("header_title")[0].classList.contains('block_drag') ) {
    //     document.getElementsByClassName("header_title")[0].classList.remove('block_drag');
    //     document.getElementsByClassName('header_title')[0].setAttribute('draggable', true);
    //   } else {
    //     document.getElementsByClassName("header_title")[0].classList.add('block_drag');
    //     document.getElementsByClassName('header_title')[0].setAttribute('draggable', false);
    //   }
    // });
  
    document.getElementById("close-btn").addEventListener("click", function (e) {
      ipcRenderer.send('Main_Channel' , 'Close_Index');
    }); 
  
    /* CONTROL DE BOTONES DE VENTANA */
});

ipcRenderer.on('Index_Channel' , (event , arg) => {
  if (arg == 'Login_Success') {
    load_user();
  }
})


const GetPendingSupports = async (Id_Advisor) => {
  console.log("Getting data pending...")

  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/supports/pendings/"+Id_Advisor)
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
    Array_LastConsult = data
    Array_Pendings = data

    notifyMe("New_Support" , {Body: "..." , Tittle: "Nuevo soporte"})

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
  ipcRenderer.send('Main_Channel' , 'Login_window');
  // setTimeout(() => {
  //   ipcRenderer.send('Main_Channel' , 'login_Validation');  
  // }, 1000)
}

function load_user(){
  data_user = JSON.parse(localStorage.getItem('user_data'));
  document.getElementById('user_name').innerHTML = data_user.Treatment +" "+ data_user.First_Name +" "+ data_user.Surname;
  document.getElementById('user_rol').innerHTML = data_user.Name_Roll;

  // Reload de soportes pendientes 
  setInterval(() => {
    GetPendingSupports(data_user.Code_Adviser);
  }, 5000)
  
}

function List_PendingSupports (){
  let info_show = "";
  Array_Pendings.forEach(element => {
     info_show = info_show+`

    <div class="container-blocks pendings-block">
        <div class="p-block-1">
          <span class="" > <kbd>${element.Id}</kbd> </span>
        </div>
        <div class="p-block-2">
          <p> ${element.Business_Name} </p>
          <p> <b>  ${element.Description} </b> </p>
        </div>
        <div class="p-block-3">
          <i class="fas fa-arrow-circle-right"></i>
        </div>
      </div>
  `;  
  });

  document.getElementById('list_pendings').innerHTML = info_show;
  
}

function  notifyMe(Type_Alert , data_Alert)  {  
  let Tittle = "";
  let Body = "";
  if (Type_Alert == 'New_Support') {
    Body = data_Alert.Body;
    Tittle = data_Alert.Tittle;
  }
  if  (!("Notification"  in  window))  {   
      alert("Este navegador no soporta notificaciones de escritorio");  
  }  
  else  if  (Notification.permission  ===  "granted")  {
      var  options  =   {
          body:   Body,
          icon:   (__dirname)+"/src/ui/img/ProfileDefault.png",
          // dir :   "ltr"
      };
      var  notification  =  new  Notification(Tittle, options);
  }
    

}

