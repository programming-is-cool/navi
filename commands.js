const config = require('./config.json')

const ebayCommand = `${ config.prefix }ebay `;

module.exports = {
    ebayCommand: ebayCommand,
}
