/*global define*/
define(['jquery', 'underscore', 'events', 'translator'], function ($, _, eventScope, t) {
    "use strict";
    var Column,
        Layout,
        LayoutBuilder;

    Column = function (width, data) {
        var self = this;
        eventScope(self);

        self.data = data || t('Click to edit');
        self.$el = $('<div class="c' + width + '">');

        self.$el.click(function () {
            self.trigger('select', self);
        });
    };

    Layout = function (columns, data) {
        var self = this;
        eventScope(self);

        self.data = data || [];
        self.title = columns.toString();
        self.columns = [];

        self.$el = $('<div class="r"></div>');

        _.each(columns, function (width, index) {
            var column = new Column(width, self.data[index]);

            column.addEventListener('select', function (column) {
                self.trigger('select', column);
            });

            self.$el.append(column.$el);
            self.columns.push(column);
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

        self.layouts = configuration.layouts;

        _.each(self.layouts, function (columns) {
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

    LayoutBuilder.prototype.addLayout = function (requestedLayout, data) {
        var newLayout,
            self = this;

        _.each(self.layouts, function (layout) {
            if (_.isEqual(layout, requestedLayout)) {
                newLayout = new Layout(requestedLayout, data);
                self.trigger('add', newLayout);
                return;
            }
        });

        if (!newLayout) {
            throw new Error('Layout does not exist: ' + requestedLayout.toString());
        }

        return newLayout;
    };

    function createIconTag(columns) {
        var canvas = $('<canvas>')[0],
            context,
            width = 90,
            height = 60,
            gutter = 5,
            iterateX = 5;

        function drawColumn(column) {
            var x = iterateX + gutter,
                w = (width - 20 - 23 * gutter) / 24 * column + (column - 1) * gutter;

            iterateX += w + gutter;

            context.beginPath();
            context.fillStyle = '#C5C5C5';
            context.rect(x, 10, w, height - 20);
            context.fill();
        }

        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = '#EEEEEE';
        context.rect(0, 0, width, height);

        context.fill();

        _.each(columns, function (column, index) {
            drawColumn(column, index);
        });

        return '<img src="' + canvas.toDataURL("image/png") + '" alt="' + columns.toString() + '"/>';
    }

    return LayoutBuilder;
});