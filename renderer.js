// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipc = require('electron').ipcRenderer;
ipc.on('new CQ grid', (event, messages) => {
 // do something
 console.log("New CQ grid: "+messages);
 $("#map").prepend(messages);
})
