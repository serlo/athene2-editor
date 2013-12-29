/* Athene2 Editor
 * Serverside Markdown Parser
 * 
 * Uses a slightly modified version of showdown.
 * 
 * Offers a `render` method via dNode.
 */

var dnode = require('dnode'),
    Showdown = require('../source/scripts/libs/showdown').Showdown,
    converter = new Showdown.converter(),
    server,
    port = 7070;

converter.config.math = true;


function render(input, callback) {
    // callback(output, Exception, ErrorMessage);
    if (input === undefined) {
        callback('', 'InvalidArgumentException', 'No input given');
    } else {
        var html = converter.makeHtml(input);
        callback(html);
    }
}

server = dnode(function (remove, connection) {
    this.render = render;
});

server.listen(port);