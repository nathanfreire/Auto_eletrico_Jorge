/**
 * Arquivos de pré carregamento (mais desempenho) e reforço de segurança na comunicação entre processos (IPC)
 */

const { contextBridge, ipcRenderer } = require('electron')

// expor (autorizar a comunicação entre processos)
contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-window'),
    osWindow: () => ipcRenderer.send('os-window'),
    carroWindow: () => ipcRenderer.send('carro-window')
})