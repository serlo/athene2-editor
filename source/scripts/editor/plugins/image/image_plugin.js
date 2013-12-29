/*global define*/
define(['jquery', 'underscore', 'text!./editor/templates/plugins/image/image_plugin.html', 'texteditor_plugin', 'translator'], function ($, _, plugin_template, EditorPlugin, t) {
    "use strict";
    var ImagePlugin,
        titleRegexp,
        hrefRegexp;

    titleRegexp = new RegExp(/\[[^\]]*\]\(/);
    hrefRegexp =  new RegExp(/\([^\)]*\)/);

    ImagePlugin = function () {
        this.state = 'image';
        this.init();
    };

    ImagePlugin.prototype = new EditorPlugin();
    ImagePlugin.prototype.constructor = ImagePlugin;

    ImagePlugin.prototype.init = function () {
        var that = this;

        that.template = _.template(plugin_template);

        that.data.name = 'Image';
    };

    ImagePlugin.prototype.updateContentString = function () {
        this.data.content = '![' + this.data.title + '](' + this.data.href + ')';
    };

    ImagePlugin.prototype.activate = function (token) {
        var that = this,
            title,
            href;

        that.data.content = token.string;
        title = _.first(that.data.content.match(titleRegexp));
        that.data.title = title.substr(1, title.length - 3);

        href = _.first(that.data.content.match(hrefRegexp));
        that.data.href = href.substr(1, href.length - 2);

        that.$el = $(that.template(that.data));

        that.$el.on('change', '.title', function () {
            that.setData('title', this.value);
        });

        that.$el.on('change', '.href', function () {
            that.setData('href', this.value);
        });

        that.$el.on('click', '.btn-success', function (e) {
            e.preventDefault();
            that.trigger('save', that);
            return;
        });
    };

    EditorPlugin.Image = ImagePlugin;
});
