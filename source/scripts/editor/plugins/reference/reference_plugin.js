/**
 * This plugin only determines
 * wether to use "DefaultReferencePlugin"
 * of the "GeogebraReferencePlugin", since
 * a reference can have different types.
 **/

/*global define*/
define([
    'jquery',
    'underscore',
    'common',
    'system_notification',
    'texteditor_plugin',
    'translator',
    'text!./editor/templates/plugins/reference/reference_plugin.html'
    ],
    function ($, _, Common, SystemNotification, EditorPlugin, t, plugin_template) {
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

        ReferencePlugin.prototype.activate = function (token) {
            var that = this,
                href,
                availablePlugins,
                $body,
                $group;

            that.$el = $(that.template(that.data));

            href = _.first(token.string.match(hrefRegexp));
            href = href.substr(1, href.length - 2);

            $body = $('.panel-body', that.$el);

            that.$el.on('click', '.btn-cancel', function (e) {
                e.preventDefault();
                that.trigger('close');
                return;
            });
            
            if (href !== '') {
                $body.html('<div class="alert alert-info">Loading reference data</div>');

                setTimeout(function () {
                    $.ajax(that.data.href)
                        .success(function (data) {
                            that.ready = true;
                            if (data && data.success) {
                                if (data.type === 'geogebra') {
                                    that.trigger('toggle-plugin', 'geogebra-reference', token, data);
                                } else {
                                    that.trigger('toggle-plugin', 'default-reference', token, data);
                                }
                            } else {
                                Common.genericError();
                                that.trigger('toggle-plugin', 'default-reference', token);
                            }
                        })
                        .error(function () {
                            Common.genericError();
                            that.trigger('toggle-plugin', 'default-reference', token);
                        });
                }, 2000);
            } else {
                // to be done
                availablePlugins = [{
                    name: t('Normal'),
                    key: 'default-reference'
                }, {
                    name: t('Geogebra'),
                    key: 'geogebra-reference'
                }];

                $body.empty();
                $group = $('<div class="btn-group">');

                $group.append($('<a class="btn btn-default disabled" disabled>').text(t('Pick a reference type:')));

                _.each(availablePlugins, function (plugin) {
                    var key = plugin.key;

                    $('<a>')
                        .text(plugin.name)
                        .attr({
                            "class": 'btn btn-default',
                            href: '#'
                        })
                        .click(function (e) {
                            e.preventDefault();
                            that.trigger('toggle-plugin', key, token);
                            return;
                        })
                        .appendTo($group)
                        .data(plugin);
                });

                $body.append($group);
            }
        };


        EditorPlugin.Reference = ReferencePlugin;
    }
);
