/**
 *  Processo de renderização
 * Tela Principal
 */

console.log("Processo de renderização")

// envio de uma mensagem para o main abrir a janela cliente
function client() {
    //console.log("Teste do botão cliente")
    //uso do api(autorizanda no preload.js)
    api.clientWindow()
}

// envio de uma mensagem para o main abrir a janela os
function os() {
    //console.log("Teste do botão os")
    //uso do api(autorizanda no preload.js)
    api.osWindow()
}

// envio de uma mensagem para o main abrir a janela carro
function carro() {
    //console.log("Teste do botão os")
    //uso do api(autorizanda no preload.js)
    api.carroWindow()
}