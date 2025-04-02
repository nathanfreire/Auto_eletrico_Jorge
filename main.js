console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

// Esta linha esta relacionada ao preload.js
const path = require('node:path')

// Importação dos metodos conectar e desconectar (modulo de conexão)
const { conectar, desconectar } = require('./database')


// importar do Schema Clientes da camada model
const clientModel = require('./src/models/Clientes.js')

// importar do Schema Carro da camada model
const carroModel = require('./src/models/Carro.js')

// importar do Schema OS da camada model
const osModel = require('./src/models/Os.js')

// importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// importação d biblioteca fs (nativa do JS) para manipulação de arquivo
const fs = require('fs')

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
    resizable: false,
    // ativação do preload.js
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')

  // recebimento dos pedidos do renderizador para abertura de janelas (botoes)
  // autorizado no preload.js
  ipcMain.on('client-window', () => {
    clientWindow()
  })

  ipcMain.on('os-window', () => {
    osWindow()
  })

  ipcMain.on('carro-window', () => {
    carroWindow()
  })

  // ==========================================
  // == Clientes - CRUD Create ================
  // recebimento do objeto que contem os dados do cliente
  ipcMain.on('new-client', async (event, client) => {
    // Importante! Teste de recebimento dos dados do cliente
    console.log(client)
    // cadastrar a estrutura de dados no banco de dados usando a classe modelo. Atenção!! os atributos precisam ser identicos ao modelo de dados Clientes.js eos valores sao definidos pelo conteudo do objeto cliente 
    try {
      const newClient = new clientModel({
        nomeCliente: client.nameCli,
        cpfCliente: client.cpfCli,
        emailCliente: client.emailCli,
        foneCliente: client.telefoneCli,
        cepCliente: client.cepCli,
        logradouroCliente: client.AddressCli,
        numeroCliente: client.numeroCli,
        complementoCliente: client.ComplementCli,
        bairroCliente: client.bairroCli,
        cidadeCliente: client.CityCli,
        ufCliente: client.ufCli
      })
      // salvar os dados do cliente no banco de dados
      await newClient.save()
      //Mensagem de confirmação
      dialog.showMessageBox({
        //Customização
        type: 'info',
        title: "Aviso",
        message: "Cliente adicionado com sucesso",
        buttons: ['OK']
      }).then((result) => {
        //ação ao precionar o botão 
        if (result.response === 0) {
          // enviar um pedido para o renderizador limpar os campos e resetar as 
          // configurações pré definidas (rótulo) preload.js
          event.reply('reset-form')
        }

      })
    } catch (error) {
      //se o codigo de erro for 11000 (cpf duflicado) enviar uma mensagem ao usuario
      if (error.code === 11000) {
        dialog.showMessageBox({
          type: 'info',
          title: "Atenção!",
          message: "CPF já está cadastrado\nVerifique se digitou corretamente",
          buttons: ['OK']
        }).then((result) => {
          if (result.response === 0) {
            // limpar a caixa do input do cpf, focar esta caixa e deixar a borda em vermelho
          }
        })
      }
      console.log(error)
    }
  })
  // -- Fim - Cliente - CRUD Create ===========
  // ==========================================

  



  // ==========================================
  // == Veiculo - CRUD Create ================
  // recebimento do objeto que contem os dados do cliente
  ipcMain.on('new-carro', async (event, Carro) => {
    // Importante! Teste de recebimento dos dados do cliente
    console.log(Carro)
    // cadastrar a estrutura de dados no banco de dados usando a classe modelo. Atenção!! os atributos precisam ser identicos ao modelo de dados Clientes.js eos valores sao definidos pelo conteudo do objeto cliente 
    try {
      const newCarro = new carroModel({
        proprietarioCarro: car.proCar,
        marcaCarro: car.marCar,
        modeloCarro: car.modCar,
        anoCarro: car.anoCar,
        placaCarro: car.plaCar,
        corCarro: car.corCar,
        chassiCarro: car.chasCar
      })
      // salvar os dados do cliente no banco de dados
      await newCarro.save()

    } catch (error) {
      console.log(error)
    }
  })
  // -- Fim - Veiculo - CRUD Create ===========
  // ==========================================


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

  // janela clientes
  let client
  function clientWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
      client = new BrowserWindow({
        width: 1010,
        height: 720,
        //autoHideMenuBar: true,
        resizable: false,
        parent: main,
        modal: true,
        // ativação do preload.js
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      })

    }
    client.loadFile('./src/views/cliente.html')
    client.center()

  }

  // janela OS
  let os
  function osWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
      os = new BrowserWindow({
        width: 1010,
        height: 720,
        //autoHideMenuBar: true,
        resizable: false,
        parent: main,
        modal: true,
        // ativação do preload.js
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      })
    }
    os.loadFile('./src/views/os.html')
    os.center()
  }

  // janela carro
  let carro
  function carroWindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
      carro = new BrowserWindow({
        width: 1010,
        height: 720,
        //autoHideMenuBar: true,
        resizable: false,
        parent: main,
        modal: true,
        // ativação do preload.js
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      })
    }
    carro.loadFile('./src/views/carro.html')
    carro.center()
  }
}

// Iniciar a aplicação 
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

// Reduzir logs não criticos
app.commandLine.appendSwitch('log-level', '3')

// iniciar a conexão com o banco de dados
ipcMain.on('db-connect', async (event) => {
  let conectado = await conectar()
  // se conectado for igual a true 
  if (conectado) {
    // enviar uma mensagem para o renderizador trocar o ícone, criar um dalay de 0.5s para sincronizar a nuvem
    setTimeout(() => {
      event.reply('db-status', "conectado")
    }, 500) //500ms

  }

})
// se conectado for igual a true


// iniciar a conexão com o banco de dados
// conectar()

// IPORTANTE Desconectar do banco de dadois quando a aplicação for encerrada
app.on('before-quit', () => {
  desconectar()
})



// Template do menu
const template = [
  {
    label: 'Cadastro',
    submenu: [
      {
        label: 'Cadastro do Clientes',
        click: () => clientWindow()
      },
      {
        label: 'Cadastro do Veículo',
        click: () => carroWindow()
      },
      {
        label: 'OS',
        click: () => osWindow()
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
        label: "Clientes",
        click: () => relatorioClientes()
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


// ==========================================
  // == OS - CRUD Create ================
  // recebimento do objeto que contem os dados do cliente
  ipcMain.on('new-os', async (event, OS) => {
    // Importante! Teste de recebimento dos dados do cliente
     console.log(OS)
    // console.log("teste")
    // cadastrar a estrutura de dados no banco de dados usando a classe modelo. Atenção!! os atributos precisam ser identicos ao modelo de dados Clientes.js eos valores sao definidos pelo conteudo do objeto cliente 
    try {
      const newOS = new osModel({
        descricaoOS: OS.desOS,
        materialOS: OS.matOS,
        dataOS: OS.datOS,
        orcamentoOS: OS.orcOS,
        pagamentoOS: OS.pagOS,
        statusOS: OS.staOS
      })
      // salvar os dados do cliente no banco de dados
      await newOS.save()

    } catch (error) {
      console.log(error)
    } 
  })
  // -- Fim - OS - CRUD Create ===========
  // ==========================================


// ==========================================
// == Relatorio de Clientes ================
async function relatorioClientes() {
  try {
    const clientes = await clientModel.find().sort({ nomeClient: 1 })
    //console.log(cliente)

    // p - portrait | landscape | mm e a4 (folha A4 (210x297mm))

    const doc = new jsPDF('p', 'mm', 'a4')
    // inserir imagem no documento pdf
    // imagePath (caminho da imagem que sera inserida no pdf)
    // imagePath( uso da biblioteca fs para ler o arquivo no formato png)
    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 5, 8) //(5mm, 8mm x, y)

    // definir o tamanho da fonte (tamanho equivalente ao word)
    doc.setFontSize(18)
    //escrever um texto (titulo)
    doc.text("Relatorio de clientes", 14, 45)// x, y (mm)
    //inserir a data atual no relatorio
    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(12)
    doc.text(`Data: ${dataAtual}`, 160, 10)
    /// variavel de apoio na formatação
    let y = 60
    doc.text("Nome", 14, y)
    doc.text("Telefone", 80, y)
    doc.text("E-mail", 130, y)
    y += 5
    //desenhar uma linha 
    doc.setLineWidth(0.5) // expessura da linha 
    doc.line(10, y, 200, y) // 10 (inicio) ---- 200 fim

    // renderizar os clientes cadastrados no banco
    y += 10 // espaçamento da linha 
    // percorrer
    clientes.forEach((c) => {
      // adicionar outra pagina se a folha inteira for preenchida (estrategia é saber o tamanho da folha)
      // folha a4 y = 297mm
      if (y > 280) {
        doc.addPage()
        y = 20 // resetar a variavel y
        // redesenhar o cabeçalho 
      
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        //desenhar uma linha 
        doc.setLineWidth(0.5) // expessura da linha 
        doc.line(10, y, 200, y) // 10 (inicio) ---- 200 fim
        y += 10 // espaçamento da linha 

      }
      doc.text(c.nomeCliente, 14, y)
      doc.text(c.foneCliente, 80, y)
      doc.text(c.emailCliente || "N/A", 130, y)

      y += 10 // quebra de linha
    })

    // adicionar numeração automatica de paginas
    const paginas = doc.internal.getNumberOfPages()
      for(let i = 1; i <= paginas; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.text(`Pagina ${i} de ${paginas}`, 105, 290, {align:'center'})
      }

    // Definir o caminho do arquivo temporario
    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'clientes.pdf')



    //salvar o arquivo no aplicativo padrão de leitura de pdf do computador do usúario
    doc.save(filePath)
    //
    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

  // == Fim do Relatorio de Clientes ================
  // ==========================================

