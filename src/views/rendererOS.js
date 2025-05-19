/*Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente
    input.focus()
}) */
    


// =======================================================
// == Buscar avançada - estilo Google =========================================

// capturar os ids referente aos campos do nome 
const input = document.getElementById('inputSearchClient')
// capturar o id do ul da lista de sugestoes de clientes
const suggestionList = document.getElementById('viewListSuggestion')
// capturar os campos que vão ser preenchidos
let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cpfClient = document.getElementById('inputCPFClient')

// vetor usado na manipulação (filtragem) dos dados
let arrayClients = []

// captura em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () => {
    // Passo 1: capturar o que for digitado na caixa de busca e converter tudo para letras minusculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    ///console.log(search) // teste de apoio a logica 
    suggestionList.innerHTML = ""

    // passo 2: enviar ao main um pedido de busca de clientes pelo nome (via preload - api (IPC))
    api.searchClients()

    // Recebimentos dos clientes do banco de dados (passo 3)
    api.listClients((event, clients) => {
        ///console.log(clients) // teste do passo 3
        // converter o vetor para JSON os dados dos clientes recebidos
        const listaClients = JSON.parse(clients)
        // armazenar no vetor os dados dos clientes
        arrayClients = listaClients
        // Passo 4: Filtrar todos os dados dos clientes extraindo nomes que tenham relação com os caracteres digitados na busca em tempo real 
        const results = arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 6) // maximo 10 resultados
        ///console.log(results) // IMPORTANTE para o entendimento
        // Limpar a lista a cada caractere digitado
        suggestionList.innerHTML = ""
        // Para cada resultado gerar um item da lista <li>
        results.forEach(c => {
            // criar o elemento li
            const item = document.createElement('li')
            // Adicionar classes bootstrap a cada li criado 
            item.classList.add('list-group-item', 'list-group-item-action')
            // exibir nome do cliente
            item.textContent = c.nomeCliente

            // adicionar um evento de click no item da lista para prencher os campos do formulario
            item.addEventListener('click', () => {
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente
                //cpfClient.value = c.cpfCliente
                input.value = ""
                suggestionList.innerHTML = ""
            })

            // adicionar os nomes (itens <li>) a lista <ul>
            suggestionList.appendChild(item)
        })

    })
})

// setar o foco no campo de busca (validação de busca do cliente obrigatória)
api.setSearch((args) => {
    input.focus()
})

// Ocultar a lista ao clicar fora
document.addEventListener('click', (e) => {
    // ocultar a lista se ela existir e estiver ativa
    if (!input.contains(e.target) && !suggestionList.contains(e.target)) {
        suggestionList.innerHTML = ""
    }
})

// == Fim - Buscar avançada - estilo Google ===================================
// =======================================================


// criar um vetor para manipulação dos dados da OS
let arrayOS = []

//captura dos dados dos inputs do formulario (passo 1 do fluxo)
let frmOS = document.getElementById('frmOS')
let descricaoOS = document.getElementById('serviceDescription')
let materialOS = document.getElementById('inputPecasClient')
let dataOS = document.getElementById('inputconclusãoClient')
let orcamentoOS = document.getElementById('inputOrcamentoClient')
let pagamentoOS = document.getElementById('inputpagamentoClient')
let statusOS = document.getElementById('osStatus')
// captura da OS (CRUD Delete e Update)
let idOS = document.getElementById('inputOS')
// captura do id do campo data
let dateOS = document.getElementById('inputData')

// =======================================================
// == CRUD Creat/Update ==================================

// Evento associado ao botão submit (uso das validações do html)
frmOS.addEventListener('submit', async (event) => {
    //evitar o comportamento padrao do submit que é enviar os dados do formulario e reiniciar o documento html
    event.preventDefault()
    // validação do campo obrigatório 'idClient' (validação html não funciona via html para campos desativados)
    if (idClient.value === "") {
        api.validateClient()
    } else {
        //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
        console.log(idOS.value, idClient.value, descricaoOS.value, materialOS.value, dataOS.value, orcamentoOS.value, pagamentoOS.value, statusOS.value)
        if (idOS.value === "") {
            //Gerar OS
            // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
            const OS = {
                idClient_OS: idClient.value,
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
        } else {
            //Editar OS

        }
    }
})

// == fim CRUD Creat/Update ==============================
// =======================================================


// =======================================================
// == Buscar OS =========================================

function findOS() {
    //console.log("teste")
    api.searchOS()
}

api.renderOS((event, dataOS) => {
    console.log(dataOS)
    const os = JSON.parse(dataOS)
    // preencher os campos com os dados da OS
    idOS.value = os._id
    // formatar data:
    const data = new Date(os.dataEntrada)
    const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
    dateOS.value = formatada
    idClient.value = os.idCliente
    descricaoOS.value = os.descricao
    materialOS.value = os.material
    dataOS.value = os.data
    orcamentoOS.value = os.orcamento
    pagamentoOS.value = os.pagamento
    statusOS.value = os.status
    
})
// == Fim - Buscar OS ===================================
// =======================================================


// =======================================================
// == Reset form =========================================
function resetForm() {
    //Limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}

// Recebimento do pedido do main para resetar o formulario
api.resetForm((args) => {
    resetForm()
})


// == Fim - Reset form ===================================
// =======================================================