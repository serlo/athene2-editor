var dnode = require('dnode');

var d = dnode.connect(7070);

var json = '[[{&quot;col&quot;:12,&quot;content&quot;:&quot;FE `inline code`&quot;},{&quot;col&quot;:12,&quot;content&quot;:&quot;GAFE\\n\\n$$\\frac12*a`*b`+12$$&quot;}],[{&quot;col&quot;:8,&quot;content&quot;:&quot;ADAW&quot;},{&quot;col&quot;:16,&quot;content&quot;:&quot;OK&quot;}]]';

d.on('remote', function (remote) {
    remote.render(json, function (output, exception, message) {
        console.log(output, exception, message);
    });
});