const { model, Schema } = require('mongoose')


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
}, {versionKey: false}) 




module.exports = model('Veículos', carroSchema)