/* Athene2 Editor
 * Serverside Markdown Parser
 *
 * Uses a slightly modified version of showdown.
 *
 * Offers a `render` method via dNode.
 *
 */

var dnode = require('dnode'),
    Showdown = require('showdown'),
    converter,
    server,
    port = 7070,
    host = '127.0.0.1';

// Load custom extensions
Showdown.extensions.serloinjections = require('../source/scripts/editor/showdown/extensions/injections');
Showdown.extensions.serlotable = require('../source/scripts/editor/showdown/extensions/table');
Showdown.extensions.serlospoilerprepare = require('../source/scripts/editor/showdown/extensions/spoiler_prepare');
Showdown.extensions.serlospoiler = require('../source/scripts/editor/showdown/extensions/spoiler');
Showdown.extensions.serlolatex = require('../source/scripts/editor/showdown/extensions/latex');
Showdown.extensions.serlolatexoutput = require('../source/scripts/editor/showdown/extensions/latex_output');
Showdown.extensions.serlohtmlstrip = require('../source/scripts/editor/showdown/extensions/html_strip');
Showdown.extensions.serloatusername = require('../source/scripts/editor/showdown/extensions/at_username');
Showdown.extensions.serlonewline = require('../source/scripts/editor/showdown/extensions/newline');
Showdown.extensions.serlostrikethrough = require('../source/scripts/editor/showdown/extensions/strike_through');
Showdown.extensions.serlocodeprepare = require('../source/scripts/editor/showdown/extensions/serlo_code_prepare');
Showdown.extensions.serlocodeoutput = require('../source/scripts/editor/showdown/extensions/serlo_code_output');

converter = new Showdown.converter({
    extensions: [
        'serlocodeprepare',
        'serloinjections',
        'serloatusername',
        'serlostrikethrough',
        'serlonewline',
        'serlotable',
        'serlospoilerprepare',
        'serlospoiler',
        'serlohtmlstrip',
        'serlolatex',
        'serlolatexoutput',
        'serlocodeoutput'
    ]
});

// converter.config.math = true;
// converter.config.stripHTML = true;

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

    if (input === "") {
        callback("");
    } else {

        // parse input to object
        try {
            input = input.trim().replace(/&quot;/g, '"');
            data = JSON.parse(input);
        } catch (e) {
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
}

server = dnode(function (remote, connection) {
    // Populate `render` function for
    // dnode clients.
    this.render = render;
});

server.listen(port, host);