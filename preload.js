/**
 * Arquivos de pré carregamento (mais desempenho) e reforço de segurança na comunicação entre processos (IPC)
 */

const { contextBridge, ipcRenderer } = require('electron')

// Enviar ao main um pedido para conexão do banco de dados e trca do icone no processo de renderização(index.html - renderer.html)
ipcRenderer.send('db-connect')


// expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-window'),
    osWindow: () => ipcRenderer.send('os-window'),
    carroWindow: () => ipcRenderer.send('carro-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client),
    newOS: (OS) => ipcRenderer.send('new-os', OS),
    newCarro: (car) => ipcRenderer.send('new-carro', car),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    searchName: (name) => ipcRenderer.send('search-name', name),
    renderClient: (dataClient) => ipcRenderer.on('renderClient', dataClient)
    //searchCPF: (cpf) => ipcRenderer.send('search-cpf', cpf)
    //renderCPF: () => ipcRenderer.on('render-cpf', )

    // criar um para cpf
    
})
