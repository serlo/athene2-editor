/*global define*/
define(['jquery', 'events', 'translator', 'text!./editor/templates/plugins/default.html'], function ($, eventScope, t, plugin_template) {
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

    EditorPlugin.prototype.close = function () {
        this.trigger('close');
    };

    EditorPlugin.prototype.activate = function () {
        this.$el = $(this.template(this.data));
        return this.$el;
    };

    EditorPlugin.prototype.deactivate = function () {
        this.$el.detach();
    };

    EditorPlugin.prototype.getActivateLink = function () {
        return this.widget || (this.widget = $('<a class="editor-widget" href="#">').text(t('Edit %s', this.data.name)));
    };

    return EditorPlugin;
});