'use strict';

/*
    API for disease by CG
    collection: disease
*/
var mongoose = require('mongoose');

var diseaseSchema = mongoose.Schema({
    disease: {
        type: String,
        default: null
    },
    location: {
        type: Array
    },
    poultryname: {
        type: String,
        default: null
    },
    poultryaddress: {
        type: String,
        default: null
    },
    poultryowner: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { collection: 'disease', versionKey: false });

var Disease = mongoose.model('Disease', diseaseSchema);

module.exports.getAllDisease = function(callback) {
    Disease.find(callback);
};

module.exports.getDisease = function(id, callback) {
    Disease.find(id, callback);
};

module.exports.addDisease = function(addItem, callback) {
    Disease.create(addItem, callback);
};

module.exports.deleteDisease = function(id, callback) {
    Disease.remove(id, callback);
};