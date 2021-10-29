const { app, BrowserWindow, Menu, clipboard} = require('electron');
const path = require('path');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function boot() {
    const modalPath = path.join('file://', __dirname, 'index.html')
    const dialog = require('electron').dialog;
    // Menu.setApplicationMenu(false);
    let win = new BrowserWindow({ minWidth: 1100, minHeight: 700, icon: __dirname + "/assets/Icon.ico", webPreferences: { nodeIntegration: true } })
    win.loadURL(modalPath)
    win.maximize()
    win.show()
    win.on('close', () => { win = null })
    // dialog.showMeGssageBox(win, {message: 'im in index.js'});
}
app.on('ready', boot);
app.on('window-all-closed', () => {
  app.quit()
});