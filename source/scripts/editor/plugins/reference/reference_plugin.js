/*global define*/
define([
    'jquery',
    'underscore',
    'common',
    'system_notification',
    'text!./editor/templates/plugins/reference/reference_plugin.html',
    'texteditor_plugin',
    'translator'
    ],
    function ($, _, Common, SystemNotification, plugin_template, EditorPlugin, t) {
        "use strict";
        var ReferencePlugin,
            titleRegexp,
            hrefRegexp;

        titleRegexp = new RegExp(/\[[^\]]*\]\(/);
        hrefRegexp =  new RegExp(/\([^\)]*\)/);

        ReferencePlugin = function (fileuploadOptions) {
            this.state = 'reference';
            this.init(fileuploadOptions);
        };

        ReferencePlugin.prototype = new EditorPlugin();
        ReferencePlugin.prototype.constructor = ReferencePlugin;

        ReferencePlugin.prototype.init = function () {
            var that = this;

            that.template = _.template(plugin_template);

            that.data.name = 'Reference';
        };

        ReferencePlugin.prototype.updateContentString = function () {
            this.data.content = '![' + this.data.title + '](' + this.data.href + ')';
        };

        ReferencePlugin.prototype.activate = function (token) {
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

            $.ajax(that.data.href)
                .success(function (data) {
                    if (data) {
                        console.log(arguments);
                    }
                })
                .error(Common.genericError);
        };

        ReferencePlugin.prototype.save = function () {
            this.data.content = '>[' + $('.title', this.$el).val() + '](' + $('.href', this.$el).val() + ')';
            this.trigger('save', this);
        };

        EditorPlugin.Reference = ReferencePlugin;
    }
);
