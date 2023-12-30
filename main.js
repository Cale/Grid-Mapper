// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const electron = require('electron')
const fetch = require('node-fetch')
const os = require('os')
const fs = require('fs'),
  readline = require('readline')
const ipc = electron.ipcMain
const { once } = require('node:events');
Tail = require('tail').Tail
var platform = os.platform()
var homedir = os.homedir()
var callingcq = false
var cqarr = []
var gridsworked = []
var mycallsign
var mygridsquare
var workingcallsign
var workinggrid
var inipath
var logfile
var qsolog

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  // Determine OS type, find WSJT-X ini file, set callsign, grid, and log directory.
  if (platform == "win32" ) {
    inipath = homedir+"/AppData/Local/WSJT-X/WSJT-X.ini"
  } else {
    inipath = homedir+"/.config/WSJT-X.ini"
  }

  async function drawWorkedGrids() {
    try {
      function removeDuplicates(value, index, array) {
        return array.indexOf(value) === index;
      }
      var uniqueGridsWorked = gridsworked.filter(removeDuplicates);
      uniqueGridsWorked.forEach((grid) => mainWindow.webContents.send('draw worked grid', grid))
      mainWindow.webContents.send('draw my grid', mygridsquare)
    } catch (err) {
      console.log(err)
    }
  }

  async function processLogFile() {
    try {
      // Map QSOs from wsjtx_log.adi.
      var log = readline.createInterface({
        input: fs.createReadStream(qsolog)
      })

      log.on('line', function(line) {
        if (line.includes("<gridsquare:4>")) {
          var grid = line.match(/gridsquare:4>(.*)/)[1].substring(0,4)
          var calllength = Number(line.match(/<call:(.*)/)[1].substring(0,1))
          var call = line.match(/<call:(.*)/)[1].substring(2,calllength+2)
          gridsworked.push(grid)
        }
      })
      tail = new Tail(logfile);

      tail.on("line", function(data) {
        var qso = data.split(" ");
        qso = qso.filter(item => item !== "");
        //For development debugging
        // if (qso.includes(mycallsign)) {
        //   console.log(qso);
        // }
    
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
          // My second transmit after calling CQ. Grab station's callsign.
          workingcallsign = qso[8];
          console.log("My second transmit after calling CQ. Working "+ workingcallsign);
          callingcq = false;
          // Get Ham's info.
          gethaminfo(workingcallsign);
        } else if (qso.includes(mycallsign) && qso.includes(workingcallsign) && (qso[9].includes("-") || qso[9].includes("+") || qso[9].includes("R"))) {
          // Received report or report received.
          console.log("Exchanging report with "+workingcallsign);
          callingcq = false;
          // Get Ham's info.
          gethaminfo(workingcallsign);
        } else if (qso.includes(mycallsign) && (qso.includes("R"))) {
          // Received report or report received Field Day
          workingcallsign = qso[8];
          console.log("R FD with "+workingcallsign);
          callingcq = false;
          // Get Ham's info.
          gethaminfo(workingcallsign);
        } else if (qso.includes(mycallsign) && qso.includes(workingcallsign) && qso[9].includes("73")) {
          // QSO is ending.
          callingcq = false;
          workingcallsign = "";
          console.log("QSO is ending.");
          mainWindow.webContents.send('clear working grid')
          if (gridsworked.includes(workinggrid)) {
            console.log("Already worked this grid.");
          } else {
            mainWindow.webContents.send('draw worked grid', workinggrid, workingcallsign)
            gridsworked.push(workinggrid)
          }
        } else if (qso.includes(mycallsign) && (qso[9].includes("73") == false)) {
          // I'm working a station, but not sure of the context. Probably Field Day.
          workingcallsign = qso[8];
          gethaminfo(workingcallsign);
          console.log("Working a station out of context: "+workingcallsign);
        } else if (qso.includes("CQ")) {
            var gridsquare;
            gridsquare = qso[qso.length-1];
            // Check whether gridsquare is 4 characters long.
            if (gridsquare.length == 4) {
              //console.log("New grid square. Sending message. "+gridsquare);
              var gridcolor
              if (gridsworked.includes(gridsquare)) {
                gridcolor = "#f9f502"
              } else {
                gridcolor = "#f707c3"
              }
              mainWindow.webContents.send('new CQ grid', gridsquare, gridcolor)
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

      await once(log, 'close')
      mainWindow.webContents.once('dom-ready', () => {
        drawWorkedGrids()
        // Open the DevTools: mainWindow.webContents.openDevTools()
      })
    } catch (err) {
      console.log(err)
    }
  }

  async function processConfigFile() {
    try {
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
        }
      })
      await once(rd, 'close')
      console.log("config file done")
      console.log("qsolog: "+qsolog)

      processLogFile()
      
    } catch (err) {
      console.log(err)
    }
  }

  processConfigFile()

  // Open links in OS default browser.
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  gethaminfo = function(callsign) {
    let url = "http://api.hamdb.org/v1/"+callsign+"/json/k4hck-gridmapper";
    let settings = { method: "Get" };

    fetch(url, settings).then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Something went wrong getting HamDB JSON.')
    })
    .then((json) => {
      if (json["hamdb"]["messages"]["status"] != "NOT_FOUND") {
        workinggrid = json["hamdb"]["callsign"]["grid"].slice(0,4);
      }
      mainWindow.webContents.send('get ham info', json)
    })
    .catch((error) => {
      console.log(error)
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

})

trimcqarray = function(arr) {
  if (arr.length > 15) {
    cqarr.splice(0, arr.length - 15);
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// app.on('activate', function () {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) createWindow()
// })
