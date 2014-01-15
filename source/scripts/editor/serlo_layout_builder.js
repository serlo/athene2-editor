/*global define*/
define(['jquery', 'underscore', 'events', 'translator', 'text!./editor/templates/layout/row.html', 'text!./editor/templates/layout/column.html'], function ($, _, eventScope, t, row_template, column_template) {
    "use strict";
    var Column,
        Row,
        LayoutBuilder,
        columnTemplate = _.template(column_template),
        rowTemplate = _.template(row_template);

    Column = function (width, data) {
        var self = this;
        eventScope(self);

        self.data = data || t('Click to edit');

        self.$el = $(columnTemplate({
            width: width
        }));

        self.type = width;

        self.$el.click(function () {
            self.trigger('select', self);
        });
    };

    Column.prototype.update = function (data, html) {
        this.data = data;
        // this.$el.html(html);
        html = html || '<span>&nbsp;</span>';
        var patch = this.$el.quickdiff('patch', $("<div></div>").html(html), ["mathSpan", "mathSpanInline"]);

        this.trigger('update', this);
        return patch;
    };

    Column.prototype.focus = function () {
        this.$el.focus().trigger('click');
    };

    Row = function (columns, index, data) {
        var self = this;
        eventScope(self);

        self.data = data || [];
        self.title = columns.toString();
        self.index = index;

        self.columns = [];

        self.$el = $(rowTemplate());
        self.$el.mouseenter(function (e) {
            self.onMouseEnter(e);
        });
        self.$el.mouseleave(function (e) {
            self.onMouseLeave(e);
        });

        self.$actions = $('<div class="row-actions btn-group"></div>');
        self.$remove = $('<a href="#" class="btn btn-xs btn-danger">').text(t('Remove Row'));
        self.$remove.click(function (e) {
            e.preventDefault();
            self.trigger('remove', self);
            return;
        });

        self.$actions.append(self.$remove);

        _.each(columns, function (width, index) {
            var column = new Column(width, self.data[index]);

            column.addEventListener('select', function (column) {
                self.trigger('select', column);
            });

            column.addEventListener('update', function (column) {
                self.trigger('update', column);
            });

            self.$el.append(column.$el);
            self.columns.push(column);
        });
    };

    Row.prototype.onMouseEnter = function () {
        this.$el.append(this.$actions);
    };

    Row.prototype.onMouseLeave = function () {
        this.$actions.detach();
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

        this.layoutListVisible = false;
        self.layouts = configuration.layouts;
        self.rows = [];

        _.each(self.layouts, function (columns) {
            var $add = $('<a href="#">' + createIconTag(columns) + '</a>');

            $add.click(function (e) {
                e.preventDefault();
                var row = self.addRow(columns);
                self.hideLayouts();

                // Select first created column
                row.columns[0].focus();
                return;
            });

            self.$layoutList.append($add);
        });

        self.$el.append(self.$add);

        self.$add.click(function (e) {
            e.preventDefault();
            self.showOrHideLayouts();
            return;
        });
    };

    LayoutBuilder.prototype.showOrHideLayouts = function (forceClose) {
        if (forceClose || this.layoutListVisible) {
            this.$layoutList.detach();
            this.layoutListVisible = false;
        } else {
            this.$el.append(this.$layoutList);
            this.layoutListVisible = true;
        }
    };

    LayoutBuilder.prototype.hideLayouts = function () {
        this.showOrHideLayouts(true);
    };

    LayoutBuilder.prototype.addRow = function (requestedLayout, data) {
        var newRow,
            self = this;

        _.each(self.layouts, function (layout) {
            if (_.isEqual(layout, requestedLayout)) {
                newRow = new Row(requestedLayout, self.rows.length, data);

                newRow.addEventListener('remove', function (row) {
                    self.removeRow(row);
                });

                self.rows.push(newRow);
                self.trigger('add', newRow);
                return;
            }
        });

        if (!newRow) {
            throw new Error('Layout does not exist: ' + requestedLayout.toString());
        }

        return newRow;
    };

    LayoutBuilder.prototype.removeRow = function (row) {
        row.$el.remove();
        this.rows.splice(row.index, 1);
        this.updateRowIndexes();

        row.trigger('update');
        row = null;
    };

    LayoutBuilder.prototype.updateRowIndexes = function () {
        _.each(this.rows, function (row, i) {
            row.index = i;
        });
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