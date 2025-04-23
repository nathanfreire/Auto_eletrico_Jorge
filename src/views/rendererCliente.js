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

//vetor global que sera usado na manipulação dos dados
let arrayClient = []

// capturar o foco na busca pelo nome do cliente
// a constante foco obtem o elemento html (input) identificado como 'searchClient'
const foco = document.getElementById('searchClient')

// Iniciar a janela de clientes alterando as propriedades de alguns elementos
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

// === Função para aplicar máscara no CPF ===
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

    campo.value = cpf;
}

// === Função para validar CPF ===
function validarCPF() {
    let campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Adicionar eventos para CPF
cpfClient.addEventListener("input", () => aplicarMascaraCPF(cpfClient)); // Máscara ao digitar
cpfClient.addEventListener("blur", validarCPF); // Validação ao perder o foco


// =======================================================
// == CRUD Creat/Update ==================================

// Evento associado ao botão submit (uso das validações do html)
frmClient.addEventListener('submit', async (event) =>{
    //evitar o comportamento padrao do submit que é enviar os dados do formulario e reiniciar o documento html
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, telefoneClient.value, cepClient.value, AddressClient.value, numeroClient.value, ComplementClient.value, bairroClient.value, CityClient.value, ufClient.value);

    // Limpa o CPF antes de salvar no banco
    let cpfSemFormatacao = cpfClient.value.replace(/\D/g, "");

    // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfSemFormatacao,
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




// =======================================================
// == CRUD Read ==================================

function buscarCliente(){
    //console.log("teste do botão buscar")

    // Passo 1: Capturar o nome do cliente
    let name = document.getElementById('searchClient').value
    console.log(name) // teste do passo 1

    // validação do campo obrigatorio
    // se o campo de busca não for preenchido
    if (name === "") {
        // enviar ao main um pedido para alertar o usúario
        api.validateSearch()
        foco.focus()

    } else {
        api.searchName(name) // passo 2: envio do nome ao main
        // Recebimento dos dados do cliente 
        api.renderClient((event, dataClient) => {
            console.log(dataClient) // teste do passo 5
    
            // Passo 6: renderizar os dados do cliente no formulario
            // - Criar um vetor global para manipulação dos dados 
            // - Criar uma constante para converter os dados recebidos que estão no formato string para o formato JSON (JSON.parse)
            // usar o laço forEach para percorrer o vetor e setar o campo (caixas de texto) do formulario
            const dadosCliente = JSON.parse(dataClient)
            // atribuir ao vetor os dados do cliente
            arrayClient = dadosCliente
            // extrair os dados do cliente
            arrayClient.forEach((c) => {
                nameClient.value = c.nomeCliente,
                cpfClient.value = c.cpfCliente,
                emailClient.value = c.emailCliente,
                telefoneClient.value = c.foneCliente,    
                cepClient.value = c.cepCliente,
                AddressClient.value = c.logradouroCliente,
                numeroClient.value = c.numeroCliente,
                ComplementClient.value = c.complementoCliente,
                bairroClient.value = c.bairroCliente,
                CityClient.value = c.cidadeCliente,
                ufClient.value = c.ufCliente
            })
        })
    }
}

// == fim CRUD Read ==============================
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
