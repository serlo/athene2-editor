/*global define*/
define(['formfield', 'events'], function (Field, eventScope) {
    "use strict";
    var Preview,
        slice = Array.prototype.slice;

    Preview = function (options) {
        this.$el = options.$el;
        this.formFields = [];
        eventScope(this);
    };

    Preview.prototype.setLayoutBuilderConfiguration = function (layoutBuilderConfiguration) {
        this.layoutBuilderConfiguration = layoutBuilderConfiguration;
    };

    Preview.prototype.createFromForm = function ($form) {
        var self = this;
        if ($form.children().length) {
            self.formFields = [];

            $form.children().each(function () {
                var field,
                    type = self.getFieldType(this);

                if (type) {
                    field = new Field[type](this);

                    field.addEventListener('column-add', function () {
                        self.trigger.apply(self, ['column-add'].concat(slice.call(arguments)));
                    });

                    field.addEventListener('select', function () {
                        self.trigger.apply(self, ['field-select'].concat(slice.call(arguments)));
                    });

                    field.addEventListener('update', function () {
                        self.trigger.apply(self, ['update'].concat(slice.call(arguments)));
                    });

                    if (type === 'Textarea') {
                        if (!self.layoutBuilderConfiguration) {
                            throw new Error('No Layout Builder Configuration set');
                        }
                        field.addLayoutBuilder(self.layoutBuilderConfiguration);
                    }

                    self.formFields.push(field);
                    self.$el.append(field.$el);
                }
            });
        }
    };

    Preview.prototype.getFieldType = function (field) {
        var self = this,
            type;

        switch (field.tagName) {
        case 'TEXTAREA':
            type = 'Textarea';
            break;
        case 'INPUT':
            switch (field.type) {
            case 'submit':
                self.submit = field;
                break;
            default:
                type = 'Input';
                break;
            }
            break;
        }

        return type;
    };

    Preview.prototype.scrollTo = function (elem) {
        if (typeof elem === 'number') {
            this.$el.scrollTop(elem);
        } else {
            this.$el.scrollTop(elem.position().top);
        }
    };

    return Preview;
});