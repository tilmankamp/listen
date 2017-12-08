const {BrowserWindow, app, Menu} = require('electron')

app.on('ready', () => {
    var win = new BrowserWindow({
        width: 320,
        height: 600,
        icon: 'assets/listen_128x128.png'
    })
    win.setMenu(null);
    win.show()
})