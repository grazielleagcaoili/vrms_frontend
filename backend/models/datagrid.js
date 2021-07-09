const mongoose = require('mongoose')


const DatagridSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required:  true,
    },
    createdBy:{
        type: String,
        required: true,
    },
    dateUpdated:{
        type: Date,
        required: true,
    },
    updatedBy:{
        type: Date,
        required: true,
    },
    title:{
        type: String,
        required: true
    },
    data:{
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Datagrid', DatagridSchema)