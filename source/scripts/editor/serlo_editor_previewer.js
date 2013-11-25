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

    Preview.prototype.scrollSync = function ($elem, percentage) {
        var $parent = this.$el.parent(),
            target,
            maxScroll,
            diff = $elem.height() - $parent.height() + 90;

        if (diff > 0) {
            target = $elem.offset().top + $parent.scrollTop() - 90 + (diff * percentage);
            maxScroll = $parent[0].scrollHeight - $parent[0].clientHeight;
            if (target > maxScroll) {
                target = maxScroll;
            } else if (target < 0) {
                target = 0;
            }

            $parent.animate({
                scrollTop: target
            });
        }
    };

    Preview.prototype.scrollTo = function ($elem, offset) {
        offset = offset || 0;

        var $parent = this.$el.parent(),
            top = $elem.offset().top + $parent.scrollTop(),
            target =  (function () {
                var maxScroll = $parent[0].scrollHeight - $parent[0].clientHeight,
                    elemTarget = (top + offset);

                return elemTarget < 0 ? 0 : (elemTarget > maxScroll ? maxScroll : elemTarget);
            }());

        $parent.animate({
            scrollTop: target
        });
    };

    return Preview;
});