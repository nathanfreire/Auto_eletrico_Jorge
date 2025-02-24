console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu } = require('electron')

// Janela principal
let win
const createWindow = () => {
  // a linha abaixo define o tema (claro ou escuro)
  nativeTheme.themeSource = 'dark' //(dark ou light)
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    // minimizable: false,
    resizable: false
  })

  // menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))


  win.loadFile('./src/views/index.html')
}

// Janela sobre 
function aboutwindows() {
  nativeTheme.themeSource = 'light'
  // a linha abaixo obtem a janela principal
  const main = BrowserWindow.getFocusedWindow()
  let about 
  // Estabelece uma relação hierárquica entre janelas
  if (main) {
    // Criar a janela sobre
    about = new BrowserWindow({
      width: 360,
      height: 200,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: main,
      modal: true
    })
  }
  // Carregar o documento html na janela
  about.loadFile('./src/views/sobre.html')
}

// Iniciar a aplicação 
app.whenReady().then(() => {
  createWindow()

  app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})

// Reduzir logs não criticos
app.commandLine.appendSwitch('log-level', '3')

// Template do menu
const template = [
  {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Dados da Oficina'
      },
      {
        label: 'Dados do Clientes'
      },
      {
        label: 'Dados do Veículo'
      },
      {
        label: 'Descrição do serviço'
      },
      {
        label: 'OS'
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        click: () => app.quit(),
        accelerator: 'Alt+F4'
      }
    ]
  },
  
  {
    label: 'Relatórios',
    submenu: [ 
    {
      label: "Clientes"
    },
    {
      label: "OS abertas"
    },
    {
      label: "OS concluídas"
    }
  ]
  },

  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut',
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: 'toggleDevTools'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Sobre',
        click: () => aboutwindows()
      }
    ]
  }
]

