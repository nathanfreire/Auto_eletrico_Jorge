// Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente
    foco.focus()
})

//captura dos dados dos inputs do formulario (passo 1 do fluxo)
let frmOS = document.getElementById('frmOS')
let descricaoOS = document.getElementById('serviceDescription')
let materialOS = document.getElementById('inputPecasClient')
let dataOS = document.getElementById('inputconclusãoClient')
let orcamentoOS = document.getElementById('inputOrcamentoClient')
let pagamentoOS = document.getElementById('inputpagamentoClient')
let statusOS = document.getElementById('osStatus')

// =======================================================
// == CRUD Creat/Update ==================================

// Evento associado ao botão submit (uso das validações do html)
frmOS.addEventListener('submit', async (event) =>{
    //evitar o comportamento padrao do submit que é enviar os dados do formulario e reiniciar o documento html
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(descricaoOS.value, materialOS.value, dataOS.value, orcamentoOS.value, pagamentoOS.value, statusOS.value) 

    // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
    const OS = {
        desOS: descricaoOS.value,
        matOS: materialOS.value,
        datOS: dataOS.value,
        orcOS: orcamentoOS.value,
        pagOS: pagamentoOS.value,
        staOS: statusOS.value
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // uso do preload.js
    api.newOS(OS) 
}) 

// == fim CRUD Creat/Update ==============================
// =======================================================

// =======================================================
// == Reset form =========================================
function resetForm(){
    //Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// Recebimento do pedido do main para resetar o formulario
api.resetForm((args)=>{
    resetForm()
})


// == Fim - Reset form ===================================
// =======================================================




// =======================================================
// == Buscar avançada - estilo Google =========================================

// capturar os ids referente aos campos do nome 
const input = document.getElementById('inputSearchClient')
// capturar o id do ul da lista de sugestoes de clientes
const suggestionList = document.getElementById('viewListSuggestion')
// capturar os campos que vão ser preenchidos
// let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cpfClient = document.getElementById('inputCPFClient')

// vetor usado na manipulação (filtragem) dos dados
let arrayClient = []

// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input',() => {
    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minusculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    ///console.log(search) // teste de apoio a logica 

    // passo 2: enviar ao main um pedido de busca de clientes pelo nome (via preload - api (IPC))
    api.searchClients()

    // Recebimentos dos clientes do banco de dados (passo 3)
    api.listClients((event, clients) => {
        console.log(clients) // teste do passo 3
        // converter o vetor para JSON os dados dos clientes recebidos
        const dataClients = JSON.parse(clients)
        // armazenar no vetor os dados dos clientes
        arrayClient = dataClients
        // Passo 4: Filtrar todos os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real 
    })
})

// == Fim - Buscar avançada - estilo Google ===================================
// =======================================================





// =======================================================
// == Buscar OS =========================================

function inputOS() {
    //console.log("teste")
    api.searchOS()
}

// == Fim - Buscar OS ===================================
// =======================================================