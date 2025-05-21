console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')

// Esta linha esta relacionada ao preload.js
const path = require('node:path')

// Importação dos metodos conectar e desconectar (modulo de conexão)
const { conectar, desconectar } = require('./database')

// importar mongoose (validação do id na OS)
const mongoose = require('mongoose')

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

// importação do recurso 'electron-prompt' (dialog de input)
// 1º instalar o recurso: npm i electron-prompt
const prompt = require('electron-prompt')

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
      // resizable: false,
      parent: main,
      modal: true,
      // ativação do preload.js
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

  }
  client.loadFile('./src/views/cliente.html')
  client.center() //iniciar no centro da tela
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
        label: "OS abertas",
        click: () => relatorioOsAbertas()
      },
      {
        label: "OS concluídas",
        click: () => relatorioOsConcluidas()
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
      idCliente: client.idCli,
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
    });
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
        type: 'error',
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
ipcMain.on('new-carro', async (event, car) => {
  // Importante! Teste de recebimento dos dados do cliente
  console.log(car)
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
    console.log(error)
  }
})
// -- Fim - Veiculo - CRUD Create ===========
// ==========================================





// ==========================================
// == Relatorio de Clientes ================

async function relatorioClientes() {
  try {
    // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
    const clientes = await clientModel.find().sort({ nomeCliente: 1 })
    // teste de recebimento da listagem de clientes
    //console.log(clientes)
    // Passo 2:Formatação do documento pdf
    // p - portrait | l - landscape | mm e a4 (folha A4 (210x297mm))
    const doc = new jsPDF('p', 'mm', 'a4')
    // inserir imagem no documento pdf
    // imagePath (caminho da imagem que sera inserida no pdf)
    // imagePath( uso da biblioteca fs para ler o arquivo no formato png)
    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo jorge (1).png')
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
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
    }

    // Definir o caminho do arquivo temporario
    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'clientes.pdf')
    // salvar temporariamente o arquivo
    doc.save(filePath)
    //  abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

// == Fim do Relatorio de Clientes ================
// ==========================================


// ==========================================
// == Relatorio da OS Aberta ================

async function relatorioOsAbertas() {
  try {
    
    const clientes = await osModel.find({ stats: 'Aberta' }).sort({ Aberta: 1 })

    const doc = new jsPDF('p', 'mm', 'a4')

    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoJorge.png')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 20, 8) //(5mm, 8mm x,y)

    doc.setFontSize(18)

    doc.text("Relatório de Ordem de Serviços", 14, 45)//x,y (mm) 

    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(12)
    doc.text(`Data: ${dataAtual}`, 160, 10)

    let y = 60
    doc.text("Nome do Cliente", 14, y)
    doc.text("Orçamento", 70, y)
    doc.text("Status", 120, y)
    y += 5

    doc.setLineWidth(0.5) // expessura da linha
    doc.line(10, y, 200, y) // inicio e fim

    y += 10 // espaçãmento da linha

    clientes.forEach((c) => {
      
      if (y > 280) {
        doc.addPage()
        y = 20
        doc.text("Nome do Cliente", 14, y)
        doc.text("Orçamento", 70, y)
        doc.text("Status", 120, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
      }
    
      doc.text(c.idCliente || "N/A", 14, y)
      doc.text(c.orcamento || "N/A", 70, y)
      doc.text(c.status || "N/A", 120, y)
      y += 10
    })

    const paginas = doc.internal.getNumberOfPages()
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
    }

    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'ordemservico.pdf')

    doc.save(filePath)

    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

// ==================== fim relatorio da os aberta ===============


// ==========================================
// == Relatorio da OS Concluida ================

async function relatorioOsConcluidas() {
  try {
    
    const clientes = await osModel.find({ stats: 'Finalizada' }).sort({ Finalizada: 1 })

    const doc = new jsPDF('p', 'mm', 'a4')

    const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logoJorge.png')
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    doc.addImage(imageBase64, 'PNG', 20, 8) //(5mm, 8mm x,y)

    doc.setFontSize(18)

    doc.text("Relatório de Ordem de Serviços", 14, 45)//x,y (mm) 

    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(12)
    doc.text(`Data: ${dataAtual}`, 160, 10)

    let y = 60
    doc.text("Nome do Cliente", 14, y)
    doc.text("Orçamento", 70, y)
    doc.text("Status", 120, y)
    y += 5

    doc.setLineWidth(0.5) // expessura da linha
    doc.line(10, y, 200, y) // inicio e fim

    y += 10 // espaçãmento da linha

    clientes.forEach((c) => {
      
      if (y > 280) {
        doc.addPage()
        y = 20
        doc.text("Nome do Cliente", 14, y)
        doc.text("Orçamento", 70, y)
        doc.text("Status", 120, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
      }
    
      doc.text(c.idCliente || "N/A", 14, y)
      doc.text(c.orcamento || "N/A", 70, y)
      doc.text(c.status || "N/A", 120, y)
      y += 10
    })

    const paginas = doc.internal.getNumberOfPages()
    for (let i = 1; i <= paginas; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Página ${i} de ${paginas}`, 105, 290, { align: 'center' })
    }

    const tempDir = app.getPath('temp')
    const filePath = path.join(tempDir, 'ordemservico.pdf')

    doc.save(filePath)

    shell.openPath(filePath)
  } catch (error) {
    console.log(error)
  }
}

// ==========================================
// == fim relatorio da OS concluida =============================


// ==========================================
// == CRUD Read =============================

// Validação de busca (preenchimento obrigatorio)
ipcMain.on('validate-search', () => {
  dialog.showMessageBox({
    type: 'warning',
    title: 'Atenção',
    message: 'Preencha o campo de busca',
    buttons: ['OK']
  })
})


ipcMain.on('search-name', async (event, name) => {
  //console.log("teste IPC search-name") Dica para testar o funcionamento
  //console.log(name) // teste do passo 2 (importante)

  // passos 3 e 4 busca dos dados do cliente do banco
  //find({nomeCliente: name}) - busca pelo nome
  //RegExp(name, i) - (insensitive / Ignorar maiúsculo ou minúsculo)
  try {
    /*const dataClient = await clientModel.find({
      nomeCliente: new RegExp(name, 'i')
    })*/
    const dataClient = await clientModel.find({
      $or: [
        { nomeCliente: new RegExp(name, 'i') },
        { cpfCliente: new RegExp(name, 'i') }
      ]
    })
    console.log(dataClient) // teste passo 3 e 4 (Importante!)

    // melhoria d eexperiencia do usuario (se o cliente nao estiver cadastrado, alertar o usuario e questionar se ele
    // quer cadastrar este novo cliente. Se não quiser cadastrar, limpar os campos, se quiser cadastrar recortar o nome do cliente do campo de busca e colar no campo nome)

    // se o vetor estiver vazio [] (cliente não cadastrado)
    if (dataClient.length === 0) {
      dialog.showMessageBox({
        type: 'warning',
        title: "Aviso",
        message: "Cliente não cadastrado.\nDeseja cadastra-lo",
        defaultId: 0, //botão 0
        buttons: ['Sim', 'Não'] // [0, 1]
      }).then((result) => {
        if (result.response === 0) {
          // enviar ao renderizador um pedido para setar os campos (recortar do campo de busca e colocar no campo nome)
          event.reply('set-client')
        } else {
          // limpar o formulário
          event.reply('reset-form')
        }
      })
    }

    // Passo 5: 
    // enviando os dados do cliente ao rendererCliente
    // OBS: IPC só trabalha com string, então é necessario converter o JSON para string JSON.stringify(dataClient)
    event.reply('renderClient', JSON.stringify(dataClient))

  } catch (error) {
    console.log(error)
  }
})

// == Fim - CRUD Read ================
// ==========================================



// ==========================================
// == CRUD Delete =============================

ipcMain.on('delete-client', async (event, id) => {
  console.log(id) // teste do passo 2 (recebimento do id)
  try {
    //importante - confirmar a exclusão
    // client é o nome da variavel que representa a janela 
    const { response } = await dialog.showMessageBox(client, {
      type: 'warning',
      title: "Atenção!",
      message: "Deseja excluir este cliente?\nEsta ação não poderá ser desfeita.",
      buttons: ['Cancelar', 'Excluir'] // [0, 1]
    })
    if (response === 1) {
      console.log("Cliente excluido com sucesso!")
      // Passo 3 - Excluir o registro do cliente
      const delClient = await clientModel.findByIdAndDelete(id)
      event.reply('reset-form')
    }
  } catch (error) {
    console.log(error)
  }
})

// == Fim - CRUD Delete ================
// ==========================================




// ==========================================
// == CRUD Update =============================

ipcMain.on('update-client', async (event, client) => {
  console.log(client) // teste importante (recebimento dos dados do cliente)
  try {
    const updateClient = await clientModel.findByIdAndUpdate(
      client.idCli,
      {
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
      },
      {
        new: true
      }
    )
    // console.log ("teste")
    // confirmação

    //Mensagem de confirmação
    dialog.showMessageBox({
      //Customização
      type: 'info',
      title: "Aviso",
      message: "Dados do cliente alterados com sucesso",
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
    console.log(error)
  }
})

// == Fim - CRUD Update ================
// ==========================================





//************************************************************/
//*******************  Ordem de Serviço  *********************/
//************************************************************/

// ===============
// == Buscar cliente para vincular na OS (buscar estilo Google) ===============================================

ipcMain.on('search-clients', async (event) => {
  try {
    //buscar no banco os clientes pelo nome em ordem alfabética
    const clients = await clientModel.find().sort({
      nomeCliente: 1
    })

    ///console.log(clients) // teste do passo 2
    // passo 3: Envio dos clientes para o renderizador
    // OBS: não esquecer de converter para string
    event.reply('list-clients', JSON.stringify(clients))

  } catch (error) {
    console.log(error)
  }
})

// == Fim - Buscar cliente para vincular na OS (buscar estilo Google) =========================================
// ==========================



// ==========================================
// == OS - CRUD Create ================

// Validação de busca (preenchimento obrigatório Id Cliente-OS)
ipcMain.on('validate-client', (event) => {
  dialog.showMessageBox({
      type: 'warning',
      title: "Aviso!",
      message: "É obrigatório vincular o cliente na Ordem de Serviço",
      buttons: ['OK']
  }).then((result) => {
      //ação ao pressionar o botão (result = 0)
      if (result.response === 0) {
          event.reply('set-search')
      }
  })
})

// recebimento do objeto que contem os dados do cliente
ipcMain.on('new-os', async (event, os) => {
  // Importante! Teste de recebimento dos dados do cliente
  console.log(os)
    console.log("teste")
  // cadastrar a estrutura de dados no banco de dados usando a classe modelo. Atenção!! os atributos precisam ser identicos ao modelo de dados Clientes.js eos valores sao definidos pelo conteudo do objeto cliente 
  try {
    const newOS = new osModel({
      idCliente: os.idClient_OS,
      descricao: os.desOS,
      material: os.matOS,
      data: os.datOS,
      orcamento: os.orcOS,
      pagamento: os.pagOS,
      status: os.staOS
    })
    // salvar os dados do cliente no banco de dados
    await newOS.save()
    //Mensagem de confirmação
    dialog.showMessageBox({
      //Customização
      type: 'info',
      title: "Aviso",
      message: "OS adicionada com sucesso",
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
    console.log(error)
  }
})
// -- Fim - OS - CRUD Create ===========
// ==========================================



// ============================================================
// == Buscar OS ===============================================

ipcMain.on('search-os', async (event) => {
  prompt({
      title: 'Buscar OS',
      label: 'Digite o número da OS:',
      inputAttrs: {
          type: 'text'
      },
      type: 'input',
      width: 400,
      height: 200
  }).then(async (result) => {
      // buscar OS pelo id (verificar formato usando o mongoose - importar no início do main)
      if (result !== null) {
          // Verificar se o ID é válido (uso do mongoose - não esquecer de importar)
          if (mongoose.Types.ObjectId.isValid(result)) {
              try {
                  const dataOS = await osModel.findById(result)
                  if (dataOS) {
                      console.log(dataOS) // teste importante
                      // enviando os dados da OS ao rendererOS
                      // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dataOS)
                      event.reply('render-os', JSON.stringify(dataOS))
                  } else {
                      dialog.showMessageBox({
                          type: 'warning',
                          title: "Aviso!",
                          message: "OS não encontrada",
                          buttons: ['OK']
                      })
                  }
              } catch (error) {
                  console.log(error)
              }
          } else {
              dialog.showMessageBox({
                  type: 'error',
                  title: "Atenção!",
                  message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                  buttons: ['OK']
              })
          }
      }
  })
})

// == Fim - Buscar OS =========================================
// ============================================================
