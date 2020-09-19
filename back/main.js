const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const { fork } = require('child_process');
const log = require('electron-log');
const fixPath = require('fix-path');
fixPath();

let mainWindow;

//log.info(`${path.join(__dirname, './index.js')}`);
var james = fork("./index.js",[], { cwd: __dirname, silent: true });
 
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        show: true,
        resizable: true
    });
  const startUrl = `file://${path.join(__dirname, '../index.html')}`;
  //console.log("startURL: " + startUrl);
  /*
  const startUrl = url.format(
    {
       pathname: path.join(__dirname, '/../public/index.html'),
       protocol: 'file:',
       slashes: true
    });
    */
  //mainWindow.webContents.openDevTools()
    mainWindow.loadURL(startUrl);
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    //console.log(`${__dirname}/index.js`);

    /*const ls = exec(`node ${path.join(__dirname, './index')}`, function (error, stdout, stderr) {
      if (error) {
        log.info(error.stack);
        log.info('Error code: '+error.code);
        log.info('Signal received: '+error.signal);
      }
      log.info("exporting the child process works");
      log.info('Child Process STDOUT: '+stdout);
      log.info('Child Process STDERR: '+stderr);
    });
    
    ls.on('exit', function (code) {
      log.info('Child process exited with exit code '+code);
    });
*/
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

//closes server
app.on('quit', () =>{
  james.kill();
  process.exit(0);
})