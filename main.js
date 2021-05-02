// Modules to control application life and create native browser window
const electron = require('electron')
const {app, BrowserWindow, ipcMain , Tray , Menu } = electron
const path = require('path')
require('electron-reload')(__dirname)

let mainWindow
let login
let supportWindow = {}
let num_window = 0;
let tray;

function createWindow (  ) {

   // Crea la ventana principal.
    mainWindow = new BrowserWindow({
    width: 400,
    resizable: false,
    height: 728,
    icon: path.join(__dirname, "/src/ui/img/ProfileDefault.png"),
    title: "Soportes DROI",
    fullscreen: false,
    frame: false,
    backgroundColor: "#dedede",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Escucha // Evita cerrar el programa
  mainWindow.on('close', e => {
    e.preventDefault();
    mainWindow.hide();
  });

  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

function createWindowLogin (  ) {

  // Crea la ventana principal.
  login = new BrowserWindow({ parent: mainWindow, modal: true, show: false , frame: false, 
    resizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }  })

    login.loadFile(__dirname+`/src/ui/login.html`);
    login.once('ready-to-show', () => {
      login.show();      

      // Open the DevTools.
      login.webContents.openDevTools()

    })
}

// Listeners de los renders principal y secundarios
ipcMain.on('asynchronous-message', (event, arg) => {

})

ipcMain.on('Main_Channel' , (event, arg) => {
  console.log(arg);
  if (arg.action == "Login_window") {
    if (num_window == 0){

      // Oculta la ventana principal mientras este abierto el login
      mainWindow.hide();
      
      createWindowLogin();

      num_window++;
    }
  }

  if (arg.action == "Window_Support") {
    
    if ( Object.entries(supportWindow).length === 0 ) {
      supportWindow = new BrowserWindow({  modal: true, show: false , frame: false, 
      resizable: true,
      width: 980,
      height: 650,
      movable: true,
      icon: path.join(__dirname, "/src/ui/img/ProfileDefault.png"),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      }  })

      supportWindow.loadFile(__dirname+`/src/ui/support.html`);
      supportWindow.once('ready-to-show', () => {
      supportWindow.show();
        

          // Open the DevTools.
        supportWindow.webContents.openDevTools()

      })
    }else{
      supportWindow.show();
    }

    supportWindow.webContents.send('Support_Channel' , { data: arg.data });

  }

  if (arg.action == "login_Validation") {
    mainWindow.show();
    login.hide();
    mainWindow.webContents.send('Index_Channel' , 'Login_Success');
    num_window = 0;
  }

  /* Botones index.html */
  if (arg.action == 'Minimize_Index') {
    mainWindow.minimize(); 
  }
  if (arg.action == 'Maximize_Index') {
    if (!mainWindow.isMaximized()) {
      mainWindow.maximize();          
    } else {
      mainWindow.unmaximize();
    }
  }
  if (arg.action == 'Close_Index') {
    mainWindow.hide();
  }

  /* Botones support.html */

  if (arg.action == 'Minimize_Support') {
    supportWindow.minimize(); 
  }
  if (arg.action == 'Maximize_Support') {
    if (!supportWindow.isMaximized()) {
      supportWindow.maximize();          
    } else {
      supportWindow.unmaximize();
    }
  }
  if (arg.action == 'Close_Support') {
    supportWindow.hide();
  }

  /* Botones login.html */

  if (arg.action == 'Minimize_Login') {
    login.minimize(); 
  }
  if (arg.action == 'Maximize_Login') {
    if (!login.isMaximized()) {
      login.maximize();          
    } else {
      login.unmaximize();
    }
  }
  if (arg.action == 'Close_Login') {
    mainWindow.destroy();
    login.destroy();
    app.quit();
  }
  
  // if( arg.action == "Close_Session"){
  //   mainWindow.show();
  //   num_window = 0;
  // }

})


app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('ready', () => {
  appIcon = new Tray('src/ui/img/ProfileDefault.png');

  appIcon.on("double-click", function () {
    mainWindow.show();
  });

  const contextMenu = Menu.buildFromTemplate([
      { label: 'Show', click: () => mainWindow.show() },
      { label: 'Quit', click: () => {
          mainWindow.destroy();
          app.quit();
      }}
  ]);

  appIcon.setContextMenu(contextMenu);
});



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// mainWindow.on("close", function (evt) {
//   evt.preventDefault();
//   mainWindow.hide();
//   tray = new Tray("./src/ui/img/ProfileDefault.png");
// });




app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
