const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron; 

let mainWindow;

//listen for the app to be ready

app.on('ready', function(){
    //create new window
    mainWindow = new BrowserWindow({});
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //quit app when closed
    mainWindow.on('close', function(){
        app.quit();
    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); 
    //insert menu
    Menu.setApplicationMenu(mainMenu);
}); 

// handle sign in
function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Sign In'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'signIn.html'),
        protocol: 'file:',
        slashes: true
    }));
    //garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}


//catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});
//create menu template

const mainMenuTemplate = [

    { 
        label: 'File',  
        submenu: [
        {   
        label: 'Sign In', //sign in to your account
        click: () => createSignInWindow(),
        },

         { 
         label: 'Sign Out', //Jump out of current account
         accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        },

            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
} 
