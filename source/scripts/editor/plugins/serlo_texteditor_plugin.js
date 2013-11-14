/*global define*/
define(['jquery'], function ($) {
    var EditorPlugin,
        defaults = {};

    EditorPlugin = function (settings) {
        this.settings = $.extend(settings, defaults);
        this.state = this.settings.state;

        this.$el = $('<div>').addClass('editor-plugin');
    };

    EditorPlugin.prototype.render = function (textEditor) {
        return this.$el;
    };

    EditorPlugin.prototype.save = function () {
        this.onSave();
        return this.data;
    };

    EditorPlugin.prototype.activate = function () {
        return this.$el;
    };

    EditorPlugin.prototype.deactivate = function () {
        this.$el.detach();
    };

    EditorPlugin.invoke = function (instance) {
        $.extend(instance, EditorPlugin.prototype);
        EditorPlugin.apply(instance, Array.prototype.slice.call(arguments, 2));
        return instance;
    };

    return EditorPlugin;
});