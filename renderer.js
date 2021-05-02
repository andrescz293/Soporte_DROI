// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// const { ipcRenderer } = require('electron')

//validar usuario


// document.getElementById('new_window').addEventListener('click', function (e) {
//   ipcRenderer.send('asynchronous-message' , 'new_window');
// });

// document.getElementById('new_children').addEventListener('click', function (e) {
//   ipcRenderer.send('asynchronous-message' , '');
// });
let Support_List = [];

function  notifyMe(Type_Alert , data_Alert)  {  
  console.log('test');
  let Body = data_Alert.Body;
  let Tittle = data_Alert.Title;
  let icon = (Type_Alert == 'Login') ? (__dirname)+"/img/ProfileDefault.png" : (__dirname)+"/src/ui/img/ProfileDefault.png" ;
	if  (!("Notification"  in  window))  {   
		alert("Este navegador no soporta notificaciones de escritorio");  
	}  
  else  if  (Notification.permission  ===  "granted")  {
		var  options  =   {
			body:   Body,
			icon:   icon,
			// dir :   "ltr"
		};	
		var  notification  =  new  Notification(Tittle, options);
  }
    

}



