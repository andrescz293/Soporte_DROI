// Modules to control application life and create native browser window
const electron = require('electron')
const {app, BrowserWindow, ipcMain , Tray , Menu } = electron
const path = require('path')
require('electron-reload')(__dirname)

let mainWindow
let child
let num_window = 0;
let tray;

function createWindow (  ) {

   // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.on('close', e => {
    e.preventDefault();
    mainWindow.hide();
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg == "new_window") {
    // event.returnValue = 'pong'
    let win = new BrowserWindow({width:1100, height:600})
    win.loadURL(`file://${__dirname}/src/ui/login.html`)  
  }else{
    console.log(num_window);
    if (num_window == 0){

      // Oculta la ventana principal mientras este abierto el login
      mainWindow.hide();
      
      child = new BrowserWindow({ parent: mainWindow, modal: true, show: false , frame: false, transparent: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        }  })

      child.loadFile(__dirname+`/src/ui/login.html`);
      child.once('ready-to-show', () => {
        child.show();      

        // Open the DevTools.
        child.webContents.openDevTools()

      })

      num_window++;
    }
  }
})

ipcMain.on('Main_Channel' , (event, arg) => {
  if (arg == "login") {
    child.close();
    mainWindow.webContents.send('Index_Channel' , 'Login_Success');
  }
  mainWindow.show();
  num_window = 0;
})


app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('ready', () => {
  appIcon = new Tray('src/ui/img/ProfileDefault.png');

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

// tray.on("double-click", function () {
//   mainWindow.show();
//   tray.destroy();
// });


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
