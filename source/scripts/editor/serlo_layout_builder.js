/*global define*/
define(['jquery', 'underscore', 'events'], function ($, _, eventScope) {
    "use strict";
    var Column,
        Layout,
        LayoutBuilder;

    Column = function (width, data) {
        var self = this;
        eventScope(self);

        self.data = data || '';
        self.$el = $('<div class="c' + width + '">').text('test content');
        self.$el.click(function () {
            self.trigger('select', self);
        });
    };

    Layout = function (columns, data) {
        var self = this;
        eventScope(self);

        self.data = data;
        self.title = columns.toString();

        self.$el = $('<div class="r"></div>');

        _.each(columns, function (width) {
            var column = new Column(width);

            column.addEventListener('select', function (column) {
                self.trigger('select', column);
            });

            self.$el.append(column.$el);
        });

    };

    LayoutBuilder = function (configuration) {
        if (configuration === undefined) {
            throw new Error('No LayoutBuilderConfiguration set for LayoutBuilder');
        }
        var self = this;
        eventScope(this);

        self.$el = $('<div class="add-layout"></div>');
        self.$add = $('<a href="#" class="plus">+</a>');
        self.$layoutList = $('<div class="layout-list">');

        self.layouts = [];

        _.each(configuration.layouts, function (columns) {
            var $add = $('<a href="#">' + createIconTag(columns) + '</a>');

            $add.click(function (e) {
                e.preventDefault();
                var layout = new Layout(columns);

                self.trigger('add', layout);

                self.hideLayouts();
                return;
            });

            self.$layoutList.append($add);
        });

        self.$el.append(self.$add);

        self.$add.click(function (e) {
            e.preventDefault();
            self.showLayouts();
            return;
        });
    };

    LayoutBuilder.prototype.showLayouts = function () {
        this.$el.append(this.$layoutList);
    };

    LayoutBuilder.prototype.hideLayouts = function () {
        this.$layoutList.detach();
    };

    function createIconTag(columns) {
        return columns.toString();
        // var canvas = $('<canvas>')[0],
        //     context,
        //     length = columns.length,
        //     width = (120 + columns.length * 5) / (columns.length);

        // canvas.width = canvas.height = 120;

        // context = canvas.getContext('2d');
        // context.beginPath();
        // context.fillStyle = '#EEEEEE';
        // context.rect(0, 0, 120, 120);

        // context.fill();

        // while (length) {
        //     context.beginPath();
        //     context.fillStyle = '#333333';
        //     context.rect(length * width + length * 5, 0, width, width);
        //     context.fill();
        //     length--;
        // }

        // return '<img src="' + canvas.toDataURL("image/png") + '" alt="' + columns.toString() + '"/>';
    }

    return LayoutBuilder;
});