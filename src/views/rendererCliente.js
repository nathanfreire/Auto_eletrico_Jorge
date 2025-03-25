// Buscar CEP
function buscarCEP() {
    //console.log("teste do evento blur")
    //armazenar o cep digitado na variável
    let cep = document.getElementById('inputCEPClient').value
    //console.log(cep) //teste de recebimento do CEP
    //"consumir" a API do ViaCEP
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    //acessando o web service para obter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //console.log(dados.logradouro)
            //extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputBairroClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUfClient').value = dados.uf
        })
        .catch(error => console.log(error))
}

// capturar o foco na busca pelo nome do cliente
// a constante foco obtem o elemento html (input) identificado como 'searchClient'
const foco = document.getElementById('searchClient')

// Iniiciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente
    foco.focus()
})

//captura dos dados dos inputs do formulario (passo 1 do fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let telefoneClient = document.getElementById('inputTelefoneClient')
let cepClient = document.getElementById('inputCEPClient')
let AddressClient = document.getElementById('inputAddressClient')
let numeroClient = document.getElementById('inputNumeroClient')
let ComplementClient = document.getElementById('inputComplementClient')
let bairroClient = document.getElementById('inputBairroClient')
let CityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUfClient')

// =======================================================
// == CRUD Creat/Update ==================================

// Evento associado ao botão submit (uso das validações do html)
frmClient.addEventListener('submit', async (event) =>{
    //evitar o comportamento padrao do submit que é enviar os dados do formulario e reiniciar o documento html
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, telefoneClient.value, cepClient.value, AddressClient.value, numeroClient.value, ComplementClient.value, bairroClient.value, CityClient.value, ufClient.value) 

    // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
        emailCli: emailClient.value,
        telefoneCli: telefoneClient.value,
        cepCli: cepClient.value,
        AddressCli: AddressClient.value,
        numeroCli: numeroClient.value,
        ComplementCli: ComplementClient.value,
        bairroCli: bairroClient.value,
        CityCli: CityClient.value,
        ufCli: ufClient.value
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // uso do preload.js
    api.newClient(client)
}) 

// == fim CRUD Creat/Update ==============================
// =======================================================
