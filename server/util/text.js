/**
 * I used slugify to normalize text to be used for category and book urls
 */
var slugify = require('slugify');
/**** Exports *****/
module.exports = {};
module.exports.normalizeText = function(text) {
    return slugify(text, {
        replacement: '-',    // replace spaces with replacement
        remove: /[*+~.()'"!:@]/g, // regex to remove characters
        lower: true,         // result in lower case
      })
};