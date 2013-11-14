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
define("ATHENE2-EDITOR", ['jquery', 'underscore', 'events'],
    function ($, _, eventScope) {
        "use strict";
        var $body = $('body'),
            $window = $(window),
            Editor;

        Editor = function (settings) {
            this.helpers = [];
            eventScope(this);

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

            self.textEditor.on('cursorActivity', _.throttle(function () {
                self.textEditor.operation(function () {
                    var cursor = self.textEditor.getCursor(),
                        token = self.textEditor.getTokenAt(cursor);

                    if (!self.currentToken || !_.isEqual(self.currentToken, token)) {
                        token.line = cursor.line;
                        self.currentToken = token;
                        self.trigger('tokenChange', token);
                    }
                });
            }, 300));

            self.addEventListener('tokenChange', function (token) {
                var state = token.type,
                    plugin;

                this.pluginManager.deactivate();

                if (state) {
                    state = _.first(token.type.split(' '));
                    plugin = this.pluginManager.matchState(state);
                    if (plugin) {
                        this.pluginManager.activate(plugin, token);
                        this.activePlugin = plugin;
                        window.activePlugin = plugin;
                        $body.append(plugin.render());
                    }
                }
            });

            self.pluginManager.addEventListener('save', function (plugin) {
                self.textEditor.replaceRange(plugin.data, {
                    line: self.currentToken.line,
                    ch: self.currentToken.from
                }, {
                    line: self.currentToken.line,
                    ch: self.currentToken.to
                });
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

                    self.textEditor.operation(function () {
                        self.textEditor.setValue(column.data);
                        self.textEditor.clearHistory();

                        if (self.editable.history) {
                            self.textEditor.setHistory(self.editable.history);
                        }

                        self.textEditor.options.readOnly = false;
                        self.textEditor.focus();

                        return;
                    });

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

        Editor.prototype.addPlugin = function (plugin) {
            this.plugins.push(plugin);
        };

        Editor.prototype.resize = function () {
            if (this.textEditor) {
                this.textEditor.setSize($window.width() / 2, $window.height() - 81);
            }
            return this;
        };

        return Editor;
    });

require(['jquery', 'ATHENE2-EDITOR', 'codemirror', 'parser', 'preview', 'showdown', 'layout_builder_configuration', 'texteditor_helper', 'texteditor_plugin_manager', 'texteditor_plugin', 'texteditor_plugin_image'],
    function ($, Editor, CodeMirror, Parser, Preview, Showdown, LayoutBuilderConfiguration, TextEditorHelper, PluginManager, EditorPlugin) {
        "use strict";

        $(function () {

            function init() {
                var editor,
                    textEditor,
                    layoutBuilderConfiguration = new LayoutBuilderConfiguration(),
                    parser = new Parser(),
                    converter = new Showdown.converter(),
                    pluginManager = new PluginManager();

                parser.setConverter(converter, 'makeHtml');

                layoutBuilderConfiguration
                    .addLayout([24])
                    .addLayout([12, 12])
                    .addLayout([8, 8, 8])
                    .addLayout([8, 16])
                    .addLayout([16, 8])
                    .addLayout([6, 6, 12])
                    .addLayout([12, 6, 6]);

                // new EditorPlugin();
                pluginManager
                    .addPlugin(new EditorPlugin.Image());

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
                    }),
                    pluginManager: pluginManager
                });

                editor.addHelper(new TextEditorHelper.Bold(textEditor));
                editor.addHelper(new TextEditorHelper.Italic(textEditor));
                editor.addHelper(new TextEditorHelper.List(textEditor));
                editor.addHelper(new TextEditorHelper.Link(textEditor));
                editor.addHelper(new TextEditorHelper.Image(textEditor));
                editor.addHelper(new TextEditorHelper.Formula(textEditor));

                editor.initialize();
                window.textEditor = textEditor;
            }

            init($('body'));
        });
    });
