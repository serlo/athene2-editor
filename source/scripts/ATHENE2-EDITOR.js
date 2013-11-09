/**
 * 
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author  Julian Kempff (julian.kempff@serlo.org)
 * @license LGPL-3.0
 * @license http://opensource.org/licenses/LGPL-3.0 The GNU Lesser General Public License, version 3.0
 * @link        https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright Copyright (c) 2013 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/)
 */
/*global define, require*/
define("ATHENE2-EDITOR", ['jquery'],
    function ($) {
        "use strict";
        var $window = $(window),
            Editor;

        Editor = function (settings) {
            return this.updateSettings(settings);
        };

        Editor.prototype.updateSettings = function (settings) {
            return $.extend(this, settings);
        };

        Editor.prototype.initialize = function () {
            var self = this;

            $window.resize(function () {
                self.resize();
            }).resize();

            self.textEditor.on('change', function () {
                if (self.editable) {
                    self.editable.data = self.textEditor.getValue();
                    self.editable.$el.html(self.parser.parse(self.editable.data));
                }
            });

            self.preview.addEventListener('field-select', function (field, column) {
                if (self.editable) {
                    self.editable.$el.removeClass('active');
                }

                if (field.type === 'textarea' && column) {
                    self.editable = column;
                    column.$el.addClass('active');
                    self.textEditor.setValue(column.data);
                    self.textEditor.options.readOnly = false;
                    self.textEditor.focus();

                }
            });

            self.preview.addEventListener('column-add', function (column) {
                column.$el.html(self.parser.parse(column.data));
            });

            self.preview.setLayoutBuilderConfiguration(self.layoutBuilderConfiguration);
            self.preview.createFromForm(self.$form);
        };

        Editor.prototype.resize = function () {
            if (this.textEditor) {
                this.textEditor.setSize($window.width() / 2, $window.height() - 32);
            }
            return this;
        };

        return Editor;
    });

require(['jquery', 'ATHENE2-EDITOR', 'codemirror', 'parser', 'preview', 'showdown', 'layout_builder_configuration'],
    function ($, Editor, CodeMirror, Parser, Preview, Showdown, LayoutBuilderConfiguration) {
        "use strict";

        $(function () {

            function init() {
                var editor,
                    layoutBuilderConfiguration = new LayoutBuilderConfiguration(),
                    parser = new Parser(),
                    converter = new Showdown.converter();

                parser.setConverter(converter, 'makeHtml');

                layoutBuilderConfiguration
                    .addLayout([24])
                    .addLayout([12, 12])
                    .addLayout([8, 8, 8])
                    .addLayout([8, 16])
                    .addLayout([16, 8])
                    .addLayout([6, 6, 12])
                    .addLayout([12, 6, 6]);

                editor = editor || new Editor({
                    $form: $('#editor-form').first(),
                    parser: parser,
                    layoutBuilderConfiguration: layoutBuilderConfiguration,
                    textEditor: new CodeMirror($('#main .editor-main-inner')[0], {
                        lineNumbers: true,
                        styleActiveLine: true,
                        matchBrackets: true,
                        lineWrapping: true,
                        readOnly: true
                    }),
                    preview: new Preview({
                        $el: $('#preview .editor-main-inner')
                    })
                });

                editor.initialize();
            }

            init($('body'));
        });
    });