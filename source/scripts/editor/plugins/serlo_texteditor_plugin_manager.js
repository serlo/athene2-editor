/*global define*/
define(['underscore', 'events'], function (_, eventScope) {
    "use strict";
    var slice = Array.prototype.slice,
        PluginManager;

    PluginManager = function () {
        eventScope(this);
        this.plugins = [];
        this.updateChain();
    };

    PluginManager.prototype.addPlugin = function (plugin) {
        this.plugins.push(plugin);

        // plugin.addEventListener('save', function () {
        //     self.trigger('save', plugin);
        // });

        this.updateChain();
    };

    PluginManager.prototype.updateChain = function () {
        this.chain = _.chain(this.plugins);
    };

    PluginManager.prototype.matchState = function (state) {
        return this.chain.filter(function (plugin) {
            if (plugin.state === state) {
                return plugin;
            }
        }).value()[0] || null;
    };

    PluginManager.prototype.activate = function (plugin) {
        this.active = plugin;
        this.active.activate.apply(this.active, slice.call(arguments, 1));
    };

    PluginManager.prototype.deactivate = function () {
        if (this.active) {
            this.active.deactivate();
        }
    };

    return PluginManager;
});