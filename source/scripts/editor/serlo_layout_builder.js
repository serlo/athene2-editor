/*global define*/
define([
    'jquery',
    'underscore',
    'cache',
    'events',
    'translator',
    'text!./editor/templates/layout/row.html',
    'text!./editor/templates/layout/column.html'
],
function ($, _, Cache, eventScope, t, row_template, column_template) {
    "use strict";
    var Column,
        Row,
        LayoutBuilder,
        columnTemplate = _.template(column_template),
        rowTemplate = _.template(row_template),
        imageCache = new Cache('athene2-editor-image'),
        emptyColumnHtml = '<p>' + t('Click to edit') + '</p>';

    Column = function (width, data) {
        var self = this;
        eventScope(self);

        self.data = data || '';

        self.$el = $(columnTemplate({
            width: width
        }));

        self.type = width;

        // prevent links from being clicked
        self.$el.on('click', 'a', function (e) {
            e.preventDefault();
            return;
        });

        self.$el.click(function () {
            self.trigger('select', self);
        });
    };

    Column.prototype.update = function (data, html) {
        var patch;

        this.data = data;
        html = (html && html !== '') ? html : emptyColumnHtml;

        patch = this.$el.quickdiff('patch', $("<div></div>").html(html), ["mathSpan", "mathSpanInline"]);

        this.trigger('update', this);
        return patch;
    };

    Column.prototype.set = function (html) {
        this.$el.html(html || emptyColumnHtml);
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

        self.$layoutList.on('click', 'a', function () {
            var row = self.addRow($(this).data('columns'));
            self.hideLayouts(this);

            // Select first created column
            row.columns[0].focus();
        });

        this.layoutListVisible = false;
        self.layouts = configuration.layouts;
        self.rows = [];

        _.each(self.layouts, function (columns) {
            var $add = $('<a href="#">' + createIconTag(columns) + '</a>');

            $add.data('columns', columns);

            self.$layoutList.append($add);
        });

        self.$el.append(self.$add);

        self.$add.click(function (e) {
            e.preventDefault();
            self.showOrHideLayouts(this);
            return;
        });
    };

    LayoutBuilder.prototype.showOrHideLayouts = function (element, forceClose) {
        if (forceClose || this.layoutListVisible) {
            this.$layoutList.detach();
            this.layoutListVisible = false;
        } else {
            this.$el.append(this.$layoutList);
            this.layoutListVisible = true;
        }
    };

    LayoutBuilder.prototype.hideLayouts = function (element) {
        this.showOrHideLayouts(element, true);
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
        _.each(this.rows, function (row, i) {
            row.index = i;
        });
    };

    function createIconTag(columns) {
        var canvas = $('<canvas>')[0],
            context,
            width = 90,
            height = 60,
            gutter = 5,
            iterateX = 5,
            iconName = columns.toString(),
            cached = imageCache.remember() || {};


        function drawColumn(column) {
            var x = iterateX + gutter,
                w = (width - 20 - 23 * gutter) / 24 * column + (column - 1) * gutter;

            iterateX += w + gutter;

            context.beginPath();
            context.fillStyle = '#C5C5C5';
            context.rect(x, 10, w, height - 20);
            context.fill();
        }


        function buildImageTag(dataURL, iconName) {
            return '<img src="' + dataURL + '" alt="' + iconName + '" />';
        }

        if (cached[iconName]) {
            console.log('is cached');
            return buildImageTag(cached[iconName], iconName);
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

        cached[iconName] = canvas.toDataURL("image/png");
        imageCache.memorize(cached);

        return buildImageTag(cached[iconName], iconName);
    }

    return LayoutBuilder;
});