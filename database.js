/**
 * Módulo e conexão com o banco de dados uso do framework mongoose
 */


const { connect } = require('http2')
const mongoose = require('mongoose')





const url = 'mongodb+srv://admin:123Senac@projetonode.4bgbm.mongodb.net/dbAuto_eletrico_jorge'



let conectado = false




const conectar = async() => {
    
    if (!conectado) {
        
        
        try {
            await mongoose.connect(url) 
            conectado = true 
            console.log("MongoDB conectado")
            return true 
        } catch (error) {
            
            if (error.code = 8000) {
                console.log("Erro de autenticação")
            } else {
                console.log(error)
            }
            return false
        }
    }

}








const desconectar = async() => {
    
    if (conectado) {
        
        
        try {
            await mongoose.disconnect(url) 
            conectado = false 
            console.log("MongoDB desconectado")
            return true 
        } catch (error) {
            console.log(error)
            return false
        }
    }

}



module.exports = {conectar, desconectar}