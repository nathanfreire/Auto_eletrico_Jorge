/**
 * Modelo de dados para construção de coleções ("tabelas")
 */

// Importação dos recursos do framework mongoose 
const { model, Schema } = require('mongoose')

// criação da estrutura da coleção OS
const carroSchema = new Schema ({
    proprietarioCarro: {
        type: String
    },
    marcaCarro: {
        type: String
    },
    modeloCarro: {
        type: String
    },
    anoCarro: {
        type: String
    },
    placaCarro: {
        type: String
    },
    corCarro: {
        type: String
    },
    chassiCarro: {
        type: String
    }
}, {versionKey: false}) // não versionar os dados armazenados 

// exportar para o main o moulo de dados
//OBS: Clientes será o nome da coleção "tabelas"

module.exports = model('Veículos', carroSchema)