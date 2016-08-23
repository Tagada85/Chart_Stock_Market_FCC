const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SymbolSchema = new Schema({
	symbol_name : String
});

let Symbol = mongoose.model('Symbol', SymbolSchema);

module.exports = Symbol;

