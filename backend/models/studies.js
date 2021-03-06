const mongoose = require('mongoose')


const StudiesSchema = new mongoose.Schema({
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
        type: String,
        required: true,
    },
    studyTitle:{
        type: String,
        required: true
    },
    studyID:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    projectName:{
        type: String,
        required: true
    },
    progress:{
        type: Number
    },
    deadline:{
        type: String,
        required: true
    },
    assignee:{
        type: Array,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    summary: {
        type: JSON,
    },
    active:{
        type: Boolean
    }
    
})

module.exports = mongoose.model('Studies', StudiesSchema)