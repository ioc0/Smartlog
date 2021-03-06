'use strict';

// This is the main file that runs when electron starts.  It sets up the native OS menus and events and launches
// the UI by creating a BrowserWindow.

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const path = require('path');

let mainWindow, menu, template;

app.on('ready', () => {
    // create a browser window for the UI
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 728,
        'titleBarStyle': 'hidden-inset'
    });

    mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`);

    // open chrome debugger if --dev is specified
    // if (process.argv.indexOf('--dev') !== -1) {
    //     mainWindow.openDevTools();
    // }

    // Configure the native menus. Note that you need to specifically include menu options for common functions
    // such as cut, copy, paste, and quit for the usual shortcut keys to work.
    template = [
        require('./menus/main')(app),
        require('./menus/file')(mainWindow),
        require('./menus/edit'),
        require('./menus/view')(mainWindow)
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Create a tray icon, because we can
    const appIcon = new Tray(path.join(__dirname, '..', 'resources', 'tray.png'));
    appIcon.setToolTip('This is charmCity-electron!');
    appIcon.setContextMenu(Menu.buildFromTemplate([
        { label: 'Open File...', click: () => mainWindow.webContents.send('open') }
    ]))
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// handle open from recent files (in the dock)
app.on('open-file', (event, file) => {
    mainWindow.webContents.send('open', file)
});
