
const input = document.getElementById('inputSearchClient')

const suggestionList = document.getElementById('viewListSuggestion')

let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')
let cpfClient = document.getElementById('inputCPFClient')


let arrayClients = []


input.addEventListener('input', () => {
    
    const search = input.value.toLowerCase()
    
    suggestionList.innerHTML = ""

    
    api.searchClients()

    
    api.listClients((event, clients) => {
        
        
        const listaClients = JSON.parse(clients)
        
        arrayClients = listaClients
        
        const results = arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 6) 
        
        
        suggestionList.innerHTML = ""
        
        results.forEach(c => {
            
            const item = document.createElement('li')
            
            item.classList.add('list-group-item', 'list-group-item-action')
            
            item.textContent = c.nomeCliente

            
            item.addEventListener('click', () => {
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente
                
                input.value = ""
                suggestionList.innerHTML = ""
            })

            
            suggestionList.appendChild(item)
        })

    })
})


api.setSearch((args) => {
    input.focus()
})


document.addEventListener('click', (e) => {
    
    if (!input.contains(e.target) && !suggestionList.contains(e.target)) {
        suggestionList.innerHTML = ""
    }
})

let arrayOS = []


let frmOS = document.getElementById('frmOS')
let IdC = document.getElementById('inputIdClient')

let descricaoOS = document.getElementById('serviceDescription')
let materialOS = document.getElementById('inputPecasClient')
let dataOSconclusao = document.getElementById('inputconclusãoClient')
let orcamentoOS = document.getElementById('inputOrcamentoClient')
let pagamentoOS = document.getElementById('inputpagamentoClient')
let statusOS = document.getElementById('osStatus')

let idOS = document.getElementById('inputOS')

let dateOS = document.getElementById('inputData')

frmOS.addEventListener('submit', async (event) => {
    
    event.preventDefault()
    
    if (idClient.value === "") {
        api.validateClient()
    } else {
        
        console.log(idOS.value, idClient.value, descricaoOS.value, materialOS.value, dataOSconclusao.value, orcamentoOS.value, pagamentoOS.value, statusOS.value)
        if (idOS.value === "") {
            
            
            const OS = {
                idClient_OS: idClient.value,
                desOS: descricaoOS.value,
                matOS: materialOS.value,
                datOS: dataOSconclusao.value,
                orcOS: orcamentoOS.value,
                pagOS: pagamentoOS.value,
                staOS: statusOS.value
            }
            
            
            api.newOS(OS)
        } else {
            
            const os = {
            id_OS: idOS.value,
            idClient_OS: idClient.value,
            desOS: descricaoOS.value,
            matOS: materialOS.value,
            datOS: dataOSconclusao.value,
            orcOS: orcamentoOS.value,
            pagOS: pagamentoOS.value,
            staOS: statusOS.value
            }
            
            
            api.updateOS(os)
        }
    }
})


function findOS() {
    
    api.searchOS()
}

api.renderOS((event, dataOS) => {
    console.log(dataOS)
    const os = JSON.parse(dataOS)
    
    idOS.value = os._id
    
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
    IdC.value = os.idCliente
    descricaoOS.value = os.descricao
    materialOS.value = os.material
    dataOSconclusao.value = os.data
    orcamentoOS.value = os.orcamento
    pagamentoOS.value = os.pagamento
    statusOS.value = os.status
    
})

function removeOS() {
    console.log(idOS.value) 
    api.deleteOS(idOS.value) 
}

function resetForm() {
    
    location.reload()
}


api.resetForm((args) => {
    resetForm()
})

function generateOS(){
    api.printOS()
  }