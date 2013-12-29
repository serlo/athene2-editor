var dnode = require('dnode');

var d = dnode.connect(7070);

var json = '[[{"col":12,"content":"FE"},{"col":12,"content":"GAFE"}],[{"col":8,"content":"ADAW"},{"col":16,"content":"OK"}]]';

d.on('remote', function (remote) {
    remote.render(json, function (output, exception, message) {
        console.log(output, exception, message);
    });
});