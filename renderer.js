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


function  notifyMe(Type_Alert , data_Alert)  {  
  console.log('test');
  let Tittle = "";
  let Body = "";
  // if (Type_Alert == 'New_Support') {
    Body = data_Alert.Body;
    Tittle = data_Alert.Title;
  // }
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



