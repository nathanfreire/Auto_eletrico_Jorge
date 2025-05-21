/**
 * Modelo de dados para construção de coleções ("tabelas")
 */

// Importação dos recursos do framework mongoose 
const { model, Schema } = require('mongoose')

// criação da estrutura da coleção OS
const osSchema = new Schema ({
    dataEntrada: {
        type: Date,
        default: Date.now
    },
    idCliente: {
        type: String,        
    },
    nome: {
        type: String,        
    },
    descricao: {
        type: String
    },
    material: {
        type: String
    },
    data: {
        type: String
    },
    orcamento: {
        type: String
    },
    pagamento: {
        type: String
    },
    status: {
        type: String
    }
}, {versionKey: false}) // não versionar os dados armazenados 

// exportar para o main o moulo de dados
//OBS: Clientes será o nome da coleção "tabelas"

module.exports = model('OS', osSchema)