/*global define*/
define([
    'jquery',
    'underscore',
    'common',
    'system_notification',
    'texteditor_plugin',
    'translator',
    'text!./editor/templates/plugins/reference/reference_plugin_default.html'
    ],
    function ($, _, Common, SystemNotification, EditorPlugin, t, plugin_template) {
        "use strict";
        var DefaultReferencePlugin,
            titleRegexp,
            hrefRegexp;

        titleRegexp = new RegExp(/\[[^\]]*\]\(/);
        hrefRegexp =  new RegExp(/\([^\)]*\)/);

        DefaultReferencePlugin = function (data) {
            this.state = 'default-reference';
            this.info = data || {};
            this.init();
        };

        DefaultReferencePlugin.prototype = new EditorPlugin();
        DefaultReferencePlugin.prototype.constructor = DefaultReferencePlugin;

        DefaultReferencePlugin.prototype.init = function () {
            var that = this;

            that.template = _.template(plugin_template);

            that.data.name = 'Reference';
        };

        DefaultReferencePlugin.prototype.activate = function (token) {
            var that = this,
                title,
                href;

            that.data.content = token.string;
            title = _.first(that.data.content.match(titleRegexp));
            that.data.title = title.substr(1, title.length - 3);

            href = _.first(that.data.content.match(hrefRegexp));
            that.data.href = href.substr(1, href.length - 2);

            that.$el = $(that.template(that.data));

            that.$el.on('click', '.btn-save', function () {
                that.save();
            });

            that.$el.on('click', '.btn-cancel', function (e) {
                e.preventDefault();
                that.trigger('close');
                return;
            });
        };

        DefaultReferencePlugin.prototype.save = function () {
            this.data.content = '>[' + $('.title', this.$el).val() + '](' + $('.href', this.$el).val() + ')';
            this.trigger('save', this);
        };

        EditorPlugin.DefaultReference = DefaultReferencePlugin;
    }
);