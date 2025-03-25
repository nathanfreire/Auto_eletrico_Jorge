/**
 * Modelo de dados para construção de coleções ("tabelas")
 */

// Importação dos recursos do framework mongoose 
const { model, Schema } = require('mongoose')

// criação da estrutura da coleção Clientes
const clienteSchema = new Schema ({
    nomeCliente: {
        type: String
    },
    
    cpfCliente: {
        type: String,
        unique: true,
        index: true
    },
    emailCliente: {
        type: String
    },
    foneCliente: {
        type: String
    },
    cepCliente: {
        type: String
    },
    logradouroCliente: {
        type: String
    },
    numeroCliente: {
        type: String
    },
    complementoCliente: {
        type: String
    },
    bairroCliente: {
        type: String
    },
    cidadeCliente: {
        type: String
    },
    ufCliente: {
        type: String
    }   
}, {versionKey: false}) // não versionar os dados armazenados 

// exportar para o main o moulo de dados
//OBS: Clientes será o nome da coleção "tabelas"

module.exports = model('Clientes', clienteSchema)