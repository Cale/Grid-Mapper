// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const electron = require('electron')
const fetch = require('node-fetch')
const os = require('os')
const fs = require('fs'),
  readline = require('readline')
const ipc = electron.ipcMain
Tail = require('tail').Tail
var platform = os.platform()
var homedir = os.homedir()
var callingcq = false
var cqarr = []
var mycallsign
var mygridsquare
var workingcallsign
var inipath
var logfile
var qsolog

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Send message when DOM is ready.
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('draw my grid', mygridsquare)

    // Map QSOs from wsjtx_log.adi.
    var log = readline.createInterface({
        input: fs.createReadStream(qsolog)
    })

    log.on('line', function(line) {
      if (line.includes("<gridsquare:4>")) {
          var grid = line.match(/gridsquare:4>(.*)/)[1].substring(0,4)
          var calllength = Number(line.match(/<call:(.*)/)[1].substring(0,1))
          var call = line.match(/<call:(.*)/)[1].substring(2,calllength+2)
          mainWindow.webContents.send('draw worked grid', grid, call)
      }
    })
  });

  // Open links in OS default browser.
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  gethaminfo = function(callsign) {
    let url = "http://api.hamdb.org/v1/"+callsign+"/json/k4hck-gridmapper";
    let settings = { method: "Get" };

    fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        mainWindow.webContents.send('get ham info', json)
      });
  }

  trimcqarray = function(arr) {
    if (arr.length > 15) {
      cqarr.splice(0, arr.length - 15);
    }
  }

  tail = new Tail(logfile);

  tail.on("line", function(data) {
    var qso = data.split(" ");
    qso = qso.filter(item => item !== "");

    if (qso.includes(mycallsign) && qso[7].includes("CQ")) {
      // I'm calling CQ / first call.
      console.log("I'm Calling CQ.");
      callingcq = true;
    } else if (qso.includes(mycallsign) && qso.includes(mygridsquare)) {
      // I'm responding to a CQ call. Grab station's callsign.
      workingcallsign = qso[7];
      callingcq = false;
      console.log("I'm working callsign "+ workingcallsign);
      gethaminfo(workingcallsign);
    } else if (qso.includes(mycallsign) && callingcq) {
      // My second transmit aftter calling CQ. Grab station's callsign.
      workingcallsign = qso[8];
      console.log("My second transmit after calling CQ. Working "+ workingcallsign);
      callingcq = false;
      // Get Ham's info.
      gethaminfo(workingcallsign);
    } else if (qso.includes(mycallsign) && qso.includes(workingcallsign) && (qso[9].includes("R-") || qso[9].includes("R+") || qso[9].includes("RRR"))) {
      // Received report or report recieved.
      console.log("R or RRR with "+workingcallsign);
      callingcq = false;
      // Get Ham's info.
      gethaminfo(workingcallsign);
    } else if (qso.includes(mycallsign) && qso.includes(workingcallsign) && qso[9].includes("73")) {
      // QSO is ending.
      callingcq = false;
      workingcallsign = "";
      console.log("QSO is ending.");
      mainWindow.webContents.send('clear working grid')
    } else if (qso.includes("CQ")) {
        var gridsquare;
        gridsquare = qso[qso.length-1];
        // Check whether gridsquare is 4 characters long.
        if (gridsquare.length == 4) {
          //console.log("New grid square. Sending message. "+gridsquare);
          mainWindow.webContents.send('new CQ grid', gridsquare)
          cqarr.push(qso);
          trimcqarray(cqarr);
          testjson = { "hamdb":
            { "version": "1",
             "callsign":
              { "call": "KG5EM",
                "class": "E",
                "expires": "07/30/2029",
                "status": "A",
                "grid": "EM16bk",
                "lat": "36.4222780",
                "lon": "-97.9149160",
                "fname": "EDWARD",
                "mi": "F",
                "name": "MURPHY",
                "suffix": "",
                "addr1": "2802 SCISSORTAIL LANE",
                "addr2": "ENID",
                "state": "OK",
                "zip": "73703",
                "country": "United States" },
             "messages": { "status": "K" } } };
          //mainWindow.webContents.send('get ham info', testjson);
        } else {
          //console.log("New grid square is irregular: "+gridsquare);
        }
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// app.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  // Determine OS type, find WSJT-X ini file, set callsign, grid, and log directory.
  if (platform == "win32" ) {
    inipath = homedir+"/AppData/Local/WSJT-X/WSJT-X.ini"
  } else {
    inipath = homedir+"/.config/WSJT-X.ini"
  }

  var rd = readline.createInterface({
      input: fs.createReadStream(inipath)
  })

  rd.on('line', function(line) {
    if (line.includes("MyCall=")) {
        mycallsign = line.substring(7)
    } else if (line.includes("MyGrid=")) {
        mygridsquare = line.substring(7,11)
    } else if (line.includes("AzElDir=")) {
        logfile = line.substring(8)+"/ALL.TXT"
        qsolog = line.substring(8)+"/wsjtx_log.adi"
        createWindow()
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
