/*global define*/
define(['jquery', 'events', 'text!./editor/templates/plugins/default.html'], function ($, eventScope, plugin_template) {
    var EditorPlugin,
        defaults = {};

    EditorPlugin = function (settings) {
        eventScope(this);
        this.settings = $.extend(settings, defaults);
        this.state = this.settings.state;

        this.data = {
            name: 'Plugin',
            content: 'Default Plugin'
        };

        this.template = _.template(plugin_template);
    };

    EditorPlugin.prototype.setData = function (key, value) {
        this.data[key] = value;
        this.updateContentString();
        this.trigger('update', this);
    };

    EditorPlugin.prototype.updateContentString = function () {
        // rebuild markdown query
        this.data.content = '**' + this.name + '**';
    };

    EditorPlugin.prototype.save = function () {
        this.trigger('save');
        return this.data;
    };

    EditorPlugin.prototype.activate = function () {
        this.$el = $(this.template(this.data));
        return this.$el;
    };

    EditorPlugin.prototype.deactivate = function () {
        this.$el.detach();
    };

    return EditorPlugin;
});