// Iniciar a janela de clientes alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    // Foco na busca do cliente
    foco.focus()
})

//captura dos dados dos inputs do formulario (passo 1 do fluxo)
let frmCarro = document.getElementById('frmCarro')
let proprietarioCarro = document.getElementById('inputProprietarioClient')
let marcaCarro = document.getElementById('inputMarcaClient')
let modeloCarro = document.getElementById('inputModeloClient')
let anoCarro = document.getElementById('inputAnoClient')
let placaCarro = document.getElementById('inputPlacaClient')
let corCarro = document.getElementById('inputCorClient')
let chassiCarro = document.getElementById('inputChassiClient')

// =======================================================
// == CRUD Creat/Update ==================================

// Evento associado ao botão submit (uso das validações do html)
frmCarro.addEventListener('submit', async (event) =>{
    //evitar o comportamento padrao do submit que é enviar os dados do formulario e reiniciar o documento html
    event.preventDefault()
    //Teste importante ( recebimento dos dados do formulario - passo 1 do fluxo)
    console.log(proprietarioCarro.value, marcaCarro.value, modeloCarro.value, anoCarro.value, placaCarro.value, corCarro.value, chassiCarro.value) 

    // Criar um objeto para armazenar os dados do cliente amtes de enviar ao main
    const car = {
        proCar: proprietarioCarro.value,
        marCar: marcaCarro.value,
        modCar: modeloCarro.value,
        anoCar: anoCarro.value,
        plaCar: placaCarro.value,
        corCar: corCarro.value,
        chasCar: chassiCarro.value 
    }
    // Enviar ao main o objeto client - (Passo 2: fluxo)
    // uso do preload.js
    api.newCarro(car) 
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