const { contextBridge, ipcRenderer } = require('electron')

ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    clientWindow: () => ipcRenderer.send('client-window'),
    osWindow: () => ipcRenderer.send('os-window'),
    carroWindow: () => ipcRenderer.send('carro-window'),
    dbStatus: (message) => ipcRenderer.on('db-status', message),
    newClient: (client) => ipcRenderer.send('new-client', client),
    newOS: (os) => ipcRenderer.send('new-os', os),
    newCarro: (car) => ipcRenderer.send('new-carro', car),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    searchName: (name) => ipcRenderer.send('search-name', name),
    renderClient: (dataClient) => ipcRenderer.on('renderClient', dataClient),
    validateSearch: () => ipcRenderer.send('validate-search'),
    setClient: (args) => ipcRenderer.on('set-client', args),
    deleteClient: (id) => ipcRenderer.send('delete-client', id),
    updateClient: (client) => ipcRenderer.send('update-client', client),
    searchOS: () => ipcRenderer.send('search-os'),
    setSearch: (args) => ipcRenderer.on('set-search', args),
    searchClients: (clients) => ipcRenderer.send('search-clients', clients),
    listClients: (clients) => ipcRenderer.on('list-clients', clients),
    validateClient: () => ipcRenderer.send('validate-client'),
    renderOS: (dataOS) => ipcRenderer.on('render-os', dataOS),
    printOS: () => ipcRenderer.send('print-os'),
    deleteOS: (idOS) => ipcRenderer.send('delete-os', idOS),
    updateOS: (os) => ipcRenderer.send('update-os', os)
});
