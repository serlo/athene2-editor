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
                    if (type === 'Textarea') {
                        if (!self.layoutBuilderConfiguration) {
                            throw new Error('No Layout Builder set');
                        }
                        field.addLayoutBuilder(self.layoutBuilderConfiguration);
                    }
                    field.addEventListener('select', function () {
                        self.trigger.apply(self, ['field-select'].concat(slice.call(arguments)));
                    });

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

    return Preview;
});