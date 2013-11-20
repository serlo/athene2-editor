/*global define*/
define(['jquery', 'underscore', 'text!./editor/templates/plugins/image_plugin.html', 'texteditor_plugin', 'translator'], function ($, _, plugin_template, EditorPlugin, t) {
    "use strict";
    var ImagePlugin,
        titleRegexp,
        hrefRegexp;

    titleRegexp = new RegExp(/\[[^\]]*\]\(/);
    hrefRegexp =  new RegExp(/\([^\)]*\)/);

    ImagePlugin = function () {
        this.state = 'tag';
        this.init();
    };

    ImagePlugin.prototype = new EditorPlugin();
    ImagePlugin.prototype.constructor = ImagePlugin;

    ImagePlugin.prototype.init = function () {
        var self = this;

        self.template = _.template(plugin_template);

        self.data.name = 'Image';
    };

    ImagePlugin.prototype.updateContentString = function () {
        this.data.content = '![' + this.data.title + '](' + this.data.href + ')';
    };

    ImagePlugin.prototype.activate = function (token) {
        var self = this,
            title,
            href;

        self.data.content = token.string;
        title = _.first(self.data.content.match(titleRegexp));
        self.data.title = title.substr(1, title.length - 3);

        href = _.first(self.data.content.match(hrefRegexp));
        self.data.href = href.substr(1, href.length - 2);

        self.$el = $(self.template(self.data));

        self.$el.on('change', '.title', function () {
            self.setData('title', this.value);
        });

        self.$el.on('change', '.href', function () {
            self.setData('href', this.value);
        });

        self.$el.on('click', '.btn-success', function (e) {
            e.preventDefault();
            self.trigger('save', self);
            return;
        });
    };

    EditorPlugin.Image = ImagePlugin;
});
