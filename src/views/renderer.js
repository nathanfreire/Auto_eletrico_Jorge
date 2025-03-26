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

// Troca do ícone do abnco de dados (usando a api do preload.js)
api.dbStatus((event, message)=>{
    // teste do recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('statusdb').src = "../public/img/dbon.png"
    } else {
        document.getElementById('statusdb').src = "../public/img/dboff.png"
    }
})