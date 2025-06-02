
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    
    foco.focus()
})


let frmCarro = document.getElementById('frmCarro')
let proprietarioCarro = document.getElementById('inputProprietarioClient')
let marcaCarro = document.getElementById('inputMarcaClient')
let modeloCarro = document.getElementById('inputModeloClient')
let anoCarro = document.getElementById('inputAnoClient')
let placaCarro = document.getElementById('inputPlacaClient')
let corCarro = document.getElementById('inputCorClient')
let chassiCarro = document.getElementById('inputChassiClient')





frmCarro.addEventListener('submit', async (event) =>{
    
    event.preventDefault()
    
    console.log(proprietarioCarro.value, marcaCarro.value, modeloCarro.value, anoCarro.value, placaCarro.value, corCarro.value, chassiCarro.value) 

    
    const car = {
        proCar: proprietarioCarro.value,
        marCar: marcaCarro.value,
        modCar: modeloCarro.value,
        anoCar: anoCarro.value,
        plaCar: placaCarro.value,
        corCar: corCarro.value,
        chasCar: chassiCarro.value 
    }
    
    
    api.newCarro(car) 
}) 






function resetForm(){
    
    location.reload()
}


api.resetForm((args)=>{
    resetForm()
})



