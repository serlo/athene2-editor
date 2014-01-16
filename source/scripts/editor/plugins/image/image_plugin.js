/*global define*/
define([
    'jquery',
    'underscore',
    'common',
    'system_notification',
    'text!./editor/templates/plugins/image/image_plugin.html',
    'texteditor_plugin',
    'translator',
    'loadimage',
    'canvas_to_blob',
    'fileupload_iframetransport',
    // 'fileupload_process',
    // 'fileupload_validate',
    // 'fileupload_ui',
    'fileupload'],
    function ($, _, Common, SystemNotification, plugin_template, EditorPlugin, t) {
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

            that.$el.on('click', '.btn-save', function (e) {
                e.preventDefault();
                that.trigger('save', that);
                return;
            });

            // Simple status message object
            that.$uploadStatus = $('.fileupload-process', that.$el);

            // the upload form
            that.$upload = $('#fileupload', that.$el);

            // initialize fileupload
            that.$upload.fileupload({
                dataType: 'json',
                type: 'post',
                url: '/upload',
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                add: function (e, data) {
                    that.$el.addClass('uploading');
                    that.$uploadStatus.text(t('Uploading.'));
                    data.submit();
                },
                error: function () {
                    that.$el.removeClass('uploading');
                    that.$uploadStatus.text(t('An error occured: %s', arguments[2]));
                    Common.genericError(arguments);
                },
                done: function () {
                    var upload = arguments[1];
                    that.$el.removeClass('uploading');

                    if (upload.result && upload.result.success) {
                        $('.href', that.$el).val(upload.result.location).trigger('change');
                        that.$uploadStatus.text(t('Image successfully uploaded.'));
                    } else {
                        Common.genericError();
                        that.$uploadStatus.text(t('An error occured.'));
                    }
                }
            });
        };

        EditorPlugin.Image = ImagePlugin;
    }
);
