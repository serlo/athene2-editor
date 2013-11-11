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
            this.helpers = [];
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
                    var value = self.textEditor.getValue();
                    self.editable.update(value, self.parser.parse(value));
                }
            });

            self.preview.addEventListener('field-select', function (field, column) {
                if (self.editable) {
                    if (self.editable === column) {
                        return;
                    }

                    self.editable.$el.removeClass('active');
                    self.editable.history = self.textEditor.getHistory();
                }

                if (field.type === 'textarea' && column) {
                    self.editable = column;
                    column.$el.addClass('active');

                    self.textEditor.setValue(column.data);
                    self.textEditor.clearHistory();

                    if (self.editable.history) {
                        self.textEditor.setHistory(self.editable.history);
                    }

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

        Editor.prototype.addHelper = function (helper) {
            this.$helpers.append(helper.$el);
            this.helpers.push(helper);
        };

        Editor.prototype.resize = function () {
            if (this.textEditor) {
                this.textEditor.setSize($window.width() / 2, $window.height() - 80);
            }
            return this;
        };

        return Editor;
    });

require(['jquery', 'ATHENE2-EDITOR', 'codemirror', 'parser', 'preview', 'showdown', 'layout_builder_configuration', 'texteditor_helper'],
    function ($, Editor, CodeMirror, Parser, Preview, Showdown, LayoutBuilderConfiguration, TextEditorHelper) {
        "use strict";

        $(function () {

            function init() {
                var editor,
                    textEditor,
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

                textEditor = new CodeMirror($('#main .editor-main-inner')[0], {
                    lineNumbers: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    readOnly: 'nocursor'
                });

                editor = editor || new Editor({
                    $form: $('#editor-form').first(),
                    $helpers : $('#editor-helpers'),
                    parser: parser,
                    layoutBuilderConfiguration: layoutBuilderConfiguration,
                    textEditor: textEditor,
                    preview: new Preview({
                        $el: $('#preview .editor-main-inner')
                    })
                });

                editor.addHelper(new TextEditorHelper.Bold(textEditor));
                editor.addHelper(new TextEditorHelper.Italic(textEditor));
                editor.addHelper(new TextEditorHelper.Link(textEditor));

                editor.initialize();
                window.textEditor = textEditor;
            }

            init($('body'));
        });
    });