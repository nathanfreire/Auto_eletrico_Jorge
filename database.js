/**
 * Módulo e conexão com o banco de dados uso do framework mongoose
 */

// importação do mongoose
const { connect } = require('http2')
const mongoose = require('mongoose')

// Configuração do acesso ao banco de dados 
// IP/link - autenticação (User e senha)
// OBS: Atlas (obter via compass)
// Para criar um banco de dados personalizado basta escolher um nome no final da String da url (ex: dbfurukawati)
const url = 'mongodb+srv://admin:123Senac@projetonode.4bgbm.mongodb.net/dbfurukawati'

// Criar uma varivel de apoio para validação 

let conectado = false

// metodo para conectar o banco de dados 
// async executar a função de forma assincrona

const conectar = async() => {
    // validação (se nao estiver conectado vou pedir para ele conectar)
    if (!conectado) {
        // conectar com o banco de dados
        // try catch - tratamento de exceções 
        try {
            await mongoose.connect(url) // conectar
            conectado = true //setar a variavel
            console.log("MongoDB conectado")
            return true // para o main identificar a conexão estabelecida com sucesso 
        } catch (error) {
            //se o codigo do erro é igual a 8000
            if (error.code = 8000) {
                console.log("Erro de autenticação")
            } else {
                console.log(error)
            }
            return false
        }
    }

}





// metodo para desconectar o banco de dados 
// async executar a função de forma assincrona

const desconectar = async() => {
    // validação (se estiver conectado vou pedir para ele desconectar)
    if (conectado) {
        // desconectar do o banco de dados
        // try catch - tratamento de exceções 
        try {
            await mongoose.disconnect(url) // desconectar
            conectado = false //setar a variavel
            console.log("MongoDB desconectado")
            return true // para o main indentificar que o banco de dados foi desconectado com sucesso
        } catch (error) {
            console.log(error)
            return false
        }
    }

}

// exportar para o main os métodos conectar e descxonectar

module.exports = {conectar, desconectar}