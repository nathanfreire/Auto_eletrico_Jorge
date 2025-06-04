
const { model, Schema } = require('mongoose')


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
    telefone:{
        type: Number,
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
}, {versionKey: false}) 




module.exports = model('OS', osSchema)