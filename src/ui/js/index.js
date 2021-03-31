const ipcRenderer = require('electron').ipcRenderer;
let data_user
let Array_Pendings = [];

document.addEventListener("DOMContentLoaded", function(event) {
  GetPendingSupports();
  // localStorage.setItem('User_Code' , "Prueba") ;
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
  
    document.getElementById("max-btn").addEventListener("click", function (e) {
      ipcRenderer.send('Main_Channel' , 'Maximize_Index');
      if ( document.getElementsByClassName("header_title")[0].classList.contains('block_drag') ) {
        document.getElementsByClassName("header_title")[0].classList.remove('block_drag');
        document.getElementsByClassName('header_title')[0].setAttribute('draggable', true);
      } else {
        document.getElementsByClassName("header_title")[0].classList.add('block_drag');
        document.getElementsByClassName('header_title')[0].setAttribute('draggable', false);
      }
    });
  
    document.getElementById("close-btn").addEventListener("click", function (e) {
      ipcRenderer.send('Main_Channel' , 'Close_Index');
    }); 
  
    /* CONTROL DE BOTONES DE VENTANA */
});

ipcRenderer.on('Index_Channel' , (event , arg) => {
  if (arg == 'Login_Success') {
    load_user();
    GetPendingSupports();
    console.log(Array_Pendings);
  }
})


const GetPendingSupports = async () => {
  console.log("Getting data pending...");
  const request = await fetch("https://www.gesadmin.co/licenses/apidroi/public/apr/supports/pendings");
  const data = await request.json();
  Array_Pendings = data;
  List_PendingSupports();
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
}

function List_PendingSupports (){
  Array_Pendings.forEach(element => {
    document.getElementById('list_pendings').innerHTML = `
    <div class="card-body">
      <span class="card-date"> ${moment(parseInt(element.Date)*1000).format('D/M/Y - H:mm')} </span>
      <h4 class="card-title">Empresa </h4>
  
      <div class="form-group">
        <label for="" class="control-label"> <strong>Asunto:</strong> Logo impresora </label>
      </div>
  
      <div class="form-group">
        <label for="" class="control-label "> <strong>Estado:</strong> </label>
        <div class="" >
          <select name="" id="" class="form-control">
            <option value="Pending">Pendiente</option>
            <option value="Pending">Finalizado</option>
          </select>  
        </div>
        
        <br>
  
        <button type="button"  id="new_window">Launch modal</button>
      </div>   
  `;  
  });
  
}

