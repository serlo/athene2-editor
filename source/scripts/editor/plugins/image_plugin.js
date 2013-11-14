/*global define*/
define(['jquery', 'underscore', 'texteditor_plugin', 'translator'], function ($, _, EditorPlugin, t) {
    "use strict";
    var ImagePlugin;

    ImagePlugin = function () {
        this.state = 'tag';
        this.init();
    };

    ImagePlugin.prototype = new EditorPlugin();
    ImagePlugin.prototype.constructor = ImagePlugin;

    ImagePlugin.prototype.init = function () {
        var self = this;

        self.$title = $('<input type="text" value="" />');
        self.$file = $('<input class="upload" type="file" value="">');

        self.titleRegexp = new RegExp(/\[[^\]]*\]\(/);

        self.$el.append(self.$title).append(self.$file);

        self.$title.change(function () {
            self.data = self.data.replace(self.titleRegexp, '[' + this.value + ']');
        });
    };

    ImagePlugin.prototype.activate = function (token) {
        var title;

        this.data = token.string;

        title = _.first(this.data.match(this.titleRegexp));

        this.$title.val(title.substr(1, title.length - 3));
    };

    ImagePlugin.prototype.render = function () {
        return this.$el;
    };

    EditorPlugin.Image = ImagePlugin;
});


// ![This is what you get](http://www.mermaidsrock.net/uni61.jpg)