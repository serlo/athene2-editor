/* Athene2 Editor
 * Serverside Markdown Parser
 *
 * Uses a slightly modified version of showdown.
 * 
 * Offers a `render` method via dNode.
 * 
 */

var dnode = require('dnode'),
    Showdown = require('../source/scripts/libs/showdown').Showdown,
    converter = new Showdown.converter(),
    server,
    port = 7070;

converter.config.math = true;
converter.config.stripHTML = true;

// **render** 
// @param {String} input Json string,
// containing Serlo Flavored Markdown (sfm) 
// structured for layout.
// @param {Function} callback
function render(input, callback) {
    var output,
        data,
        row,
        column,
        i, l, j, lj;

    // callback(output, Exception, ErrorMessage);
    if (input === undefined) {
        callback('', 'InvalidArgumentException', 'No input given');
        return;
    }

    // parse input to object
    try {
        input = input.trim().replace(/&quot;/g, '"');
        data = JSON.parse(input);
    } catch(e) {
        callback('', 'InvalidArgumentException', 'No valid json string given: ' + input);
        return;
    }

    output = '';

    for (i = 0, l = data.length; i < l; i++) {
        row = data[i];
        output += '<div class="r">';
        for (j = 0, lj = row.length; j < lj; j++) {
            column = row[j];
            output += '<div class="c' + column.col + '">';
            output += converter.makeHtml(column.content);
            output += '</div>';
        }
        output += '</div>';
    }

    callback(output);
}

server = dnode(function (remote, connection) {
    // Populate `render` function for
    // dnode clients.
    this.render = render;
});

server.listen(port);