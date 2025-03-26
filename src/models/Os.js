/**
 * Modelo de dados para construção de coleções ("tabelas")
 */

// Importação dos recursos do framework mongoose 
const { model, Schema } = require('mongoose')

// criação da estrutura da coleção OS
const osSchema = new Schema ({
    descricaoOS: {
        type: String
    },
    materialOS: {
        type: String
    },
    dataOS: {
        type: String
    },
    orcamentoOS: {
        type: String
    },
    pagamentoOS: {
        type: String
    },
    statusOS: {
        type: String
    }
}, {versionKey: false}) // não versionar os dados armazenados 

// exportar para o main o moulo de dados
//OBS: Clientes será o nome da coleção "tabelas"

module.exports = model('OS', osSchema)