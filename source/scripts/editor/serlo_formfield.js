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
            var updatedValue = '';
            _.each(self.layoutBuilder.rows, function (row) {
                updatedValue += '<div class="r">';
                _.each(row.columns, function (column) {
                    updatedValue += '<div class="c' + column.type + '">';
                    updatedValue += column.data;
                    updatedValue += '</div>';
                });
                updatedValue += '</div>';
            });
            self.$field.html(updatedValue);
        }, 2000);
    };

    Field.Textarea.prototype.addLayoutBuilder = function (layoutBuilderConfiguration) {
        var self = this;
        self.layoutBuilder = new LayoutBuilder(layoutBuilderConfiguration);

        self.layoutBuilder.addEventListener('add', function (layout) {
            self.$inner.append(layout.$el);

            layout.addEventListener('select', function (column) {
                self.trigger('select', self, column);
            });

            layout.addEventListener('update', function () {
                self.updateField();
            });

            _.each(layout.columns, function (column) {
                self.trigger('column-add', column);
            });
        });

        self.$el.append(self.layoutBuilder.$el);

        this.parseFieldData();
    };

    Field.Textarea.prototype.parseFieldData = function () {
        var self = this,
            $html = $($(self.field).val());
        $html.each(function () {
            // row
            var row = [],
                data = [],
                layout;
            $(this).children().each(function () {
                // column
                var outerHtml = $(this).html();
                row.push(parseInt(this.className.substring(1), 10));
                data.push(outerHtml);
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