/*global define*/
define(['jquery', 'underscore', 'layout_builder', 'events'], function ($, _, LayoutBuilder, eventScope) {
    "use strict";
    function invoke(instance, constructor) {
        $.extend(instance, constructor.prototype);
        constructor.apply(instance, Array.prototype.slice.call(arguments, 2));
    }

    var Field = function (field, type, label) {
        this.field = field;
        this.$field = $(field);
        this.type = type;
        this.label = label || '';

        eventScope(this);

        this.init();
    };

    Field.prototype.init = function () {
        var self = this;
        self.$el = $('<div>');
        self.$inner = $('<div>');
        self.$el.append(self.$inner);

        self.$inner.click(function () {
            self.trigger('select', self);
        });

        self.data = this.$field.val();
    };

    Field.Textarea = function (field, label) {
        var self = this;
        invoke(self, Field, field, 'textarea', label);

        self.$inner.unbind('click');
        self.data = this.$field.html();

        self.updateField = _.throttle(function () {
            var updatedValue = [];
            _.each(self.layoutBuilder.rows, function (row) {
                var _row = [];

                _.each(row.columns, function (column) {
                    _row.push({
                        col: column.type,
                        content: column.data
                    });
                });

                updatedValue.push(_row);
            });

            self.$field.html(JSON.stringify(updatedValue));
        }, 2000);
    };

    Field.Textarea.prototype.addLayoutBuilder = function (layoutBuilderConfiguration) {
        var self = this;
        self.layoutBuilder = new LayoutBuilder(layoutBuilderConfiguration);

        self.layoutBuilder.addEventListener('add', function (row) {
            self.$inner.append(row.$el);

            row.addEventListener('select', function (column) {
                self.trigger('select', self, column);
            });

            row.addEventListener('update', function (column) {
                self.updateField();
                self.trigger('update', column);
            });

            _.each(row.columns, function (column) {
                self.trigger('column-add', column);
            });

            row.columns[0].trigger('select', row.columns[0]);
        });

        self.$el.append(self.layoutBuilder.$el);

        this.parseFieldData();
    };

    Field.Textarea.prototype.parseFieldData = function () {
        var self = this,
            data = $(self.field).val();

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw new Error(e.message);
        }

        _.each(data, function (columns) {
            var row = [],
                data = [],
                layout;

            _.each(columns, function (column) {
                row.push(column.col);
                data.push(column.content);
            });

            layout = self.layoutBuilder.addRow(row, data);
        });
    };
    // Field.Input = function (field, label) {
    //     this = new Field(field, 'input', label);
    // };
    // Field.Checkbox = function (field, label) {
    //     this = new Field(field, 'checkbox', label);
    // };
    // Field.Select = function (field, label) {
    //     this = new Field(field, 'select', label);
    // };

    return Field;
});