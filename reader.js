var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');
var input = fs.createReadStream('./data-sets/dataset-lg.csv');


var lineReader = require('readline').createInterface({
    input
});

lineReader.on('line', function (line) {

});

lineReader.on('close', function () {
    console.timeEnd("caca");
});