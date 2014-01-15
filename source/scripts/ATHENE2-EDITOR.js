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
/*global define, require, MathJax*/
define("ATHENE2-EDITOR", ['jquery', 'underscore', 'events'],
    function ($, _, eventScope) {
        "use strict";
        var $body = $('body'),
            $window = $(window),
            Editor;

        function getCompleteToken(editor, pos, maxLines, currentToken, firstRun) {
            var prevStartPos = {};


            function loop(pos, maxLines, currentToken, firstRun) {
                // Get the token at current position
                var token = editor.getTokenAt(pos),
                    endPos;

                // Check if it's the other one than before
                if ((_.isEqual(token.state.startPos, prevStartPos && !firstRun)) ||
                    (!_.isEqual(token.state.startPos, prevStartPos && firstRun))) {

                    if (token.state.endPos) {
                        // YIPPIE, COMPLETE NEW TOKEN
                        return token;
                    }
                    // D'oh, endPos is missing, let's have a look

                    // We're in the last line, let's stop here
                    if (maxLines <= pos.line) {
                        endPos = {
                            ch: token.end,
                            line: pos.line
                        };
                        // Dunno what'll happen, let's try
                        return token;
                    }

                    // Let's save the current Token startPos as a reference
                    prevStartPos = token.state.startPos;

                    // Now call this function again 
                    pos.line++;
                    pos.ch = 1;
                    return loop(pos, maxLines, token, false);
                }

                return currentToken;
            }

            return loop(pos, maxLines, currentToken, firstRun);
        }

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
                    var value = self.textEditor.getValue(),
                        patch = self.editable.update(value, self.parser.parse(value));

                    if (patch.type !== "identical" && patch.replace.length > 0) {
                        _.each(patch.replace, function (el) {
                            if (el.innerHTML) {
                                MathJax.Hub.Typeset(el);
                            }
                        });
                    }
                }
            });

            self.textEditor.on('cursorActivity', _.throttle(function () {
                var cursor = self.textEditor.getCursor();

                self.textEditor.operation(function () {
                    var token = self.textEditor.getTokenAt(cursor);

                    if (!self.currentToken || !_.isEqual(self.currentToken, token)) {
                        token.line = cursor.line;
                        self.currentToken = token;
                        self.trigger('tokenChange', token);
                    }
                });

            }, 400));

            self.textEditor.on('cursorActivity', _.throttle(function () {
                if (self.editable) {
                    self.preview.scrollSync(self.editable.$el, self.textEditor.getCursor().line / self.textEditor.lastLine());
                }
            }, 1500));

            self.addEventListener('tokenChange', function (token) {
                var state = token.type,
                    plugin;

                self.pluginManager.deactivate();

                if (self.$widget) {
                    self.$widget.remove();
                }

                if (!self.textEditor.hidePlugins && state) {
                    state = _.first(token.type.split(' '));
                    plugin = self.pluginManager.matchState(state);
                    if (plugin) {
                        self.$widget = plugin.getActivateLink();
                        self.$widget.click(function () {
                            var maxLines = self.textEditor.doc.size;

                            self.$widget.remove();
                            self.$widget = null;

                            self.currentToken = getCompleteToken(self.textEditor, self.textEditor.getCursor(), maxLines, {}, true);

                            self.currentToken.state.string = self.textEditor.doc.getRange(self.currentToken.state.startPos, self.currentToken.state.endPos);

                            self.pluginManager.activate(plugin, self.currentToken);
                            self.activePlugin = plugin;

                            $body.append(plugin.$el);
                        });

                        self.textEditor.addWidget(self.textEditor.getCursor(), self.$widget[0]);
                    }
                }
            });

            self.pluginManager.addEventListener('save', function (plugin) {
                // plugin.data.content is the updated value
                //
                self.textEditor.replaceRange(
                    plugin.data.content,
                    self.currentToken.state.startPos,
                    self.currentToken.state.endPos
                );
            });

            self.preview.addEventListener('field-select', function (field, column) {
                if (self.editable) {
                    if (self.editable === column) {
                        return;
                    }

                    self.editable.$el.removeClass('active');
                    self.editable.history = self.textEditor.getHistory();
                    self.editable = null;
                }

                if (field.type === 'textarea' && column) {
                    self.editable = column;
                    column.$el.addClass('active');

                    self.preview.scrollSync(self.editable.$el, 1);

                    self.textEditor.operation(function () {
                        self.textEditor.setValue(column.data);
                        self.textEditor.clearHistory();

                        if (self.editable.history) {
                            self.textEditor.setHistory(self.editable.history);
                        }

                        self.textEditor.setOption('readOnly', false);
                        self.textEditor.execCommand('selectAll');
                        self.textEditor.focus();

                        return;
                    });
                } else {
                    self.emptyTextEditor();
                }
            });

            self.preview.addEventListener('column-add', function (column) {
                column.$el.html(self.parser.parse(column.data));
            });

            self.preview.addEventListener('removed-row', function () {
                self.emptyTextEditor();
            });

            // self.preview.addEventListener('update', function (column) {

            // });

            self.preview.setLayoutBuilderConfiguration(self.layoutBuilderConfiguration);
            self.preview.createFromForm(self.$form);

            self.$submit.click(function () {
                if (self.preview.submit) {
                    $(self.preview.submit).click();
                }
            });
        };

        Editor.prototype.addHelper = function (helper) {
            this.$helpers.append(helper.$el);
            this.helpers.push(helper);
        };

        Editor.prototype.addPlugin = function (plugin) {
            this.plugins.push(plugin);
            return this;
        };

        Editor.prototype.resize = function () {
            if (this.textEditor) {
                this.textEditor.setSize($window.width() / 2, $window.height() - 81);
            }
            return this;
        };

        Editor.prototype.emptyTextEditor = function () {
            var self = this;

            self.textEditor.operation(function () {
                self.textEditor.setValue('');
                self.textEditor.setOption('readOnly', true);
            });
        };

        return Editor;
    });

require(['jquery',
    'underscore',
    'common',
    'ATHENE2-EDITOR',
    'codemirror',
    'parser',
    'preview',
    'showdown',
    'layout_builder_configuration',
    'texteditor_helper',
    'texteditor_plugin_manager',
    'texteditor_plugin',
    'system_notification',
    'texteditor_plugin_image',
    'texteditor_plugin_wiris'],
    function ($,
        _,
        Common,
        Editor,
        CodeMirror,
        Parser,
        Preview,
        Showdown,
        LayoutBuilderConfiguration,
        TextEditorHelper,
        PluginManager,
        EditorPlugin,
        SystemNotification) {
        "use strict";

        if (typeof MathJax !== 'undefined') {
            MathJax.Hub.Config({
                displayAlign: 'left',
                extensions: ["tex2jax.js"],
                jax: ["input/TeX", "output/HTML-CSS"],
                tex2jax: {
                    inlineMath: [["%%", "%%"]]
                },
                "HTML-CSS": {
                    scale: 100
                }
            });
        }

        $(function () {
            // Setup a filter for comparing mathInline spans.
            $.fn.quickdiff("filter", "mathSpanInline",
                function (node) {
                    return (node.nodeName === "SPAN" && $(node).hasClass("mathInline"));
                },
                function (a, b) {
                    var aHTML = $.trim($("script", a).html()), bHTML = $.trim($(b).html());
                    return ("%%" + aHTML + "%%") !== bHTML;
                });

            // Setup a filter for comparing math spans.
            $.fn.quickdiff("filter", "mathSpan",
                function (node) {
                    return (node.nodeName === "SPAN" && $(node).hasClass("math"));
                },
                function (a, b) {
                    var aHTML = $.trim($("script", a).html()), bHTML = $.trim($(b).html());
                    return ("$$" + aHTML + "$$") !== bHTML;
                });

            $.fn.quickdiff("attributes", {
                "td" : ["align"],
                "th" : ["align"],
                "img" : ["src", "alt", "title"],
                "a" : ["href", "title"]
            });

            function init() {
                var editor,
                    textEditor,
                    layoutBuilderConfiguration = new LayoutBuilderConfiguration(),
                    parser = new Parser(),
                    converter = new Showdown.converter(),
                    pluginManager = new PluginManager();

                converter.config.math = true;
                converter.config.stripHTML = true;

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
                    .addPlugin(new EditorPlugin.Image())
                    .addPlugin(new EditorPlugin.Wiris());

                textEditor = new CodeMirror($('#main .editor-main-inner')[0], {
                    lineNumbers: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                    lineWrapping: true,
                    readOnly: 'nocursor'
                });

                editor = editor || new Editor({
                    $form: $('form').first(),
                    $helpers : $('#editor-helpers'),
                    $submit : $('#editor-actions .btn-success'),
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
                editor.addHelper(new TextEditorHelper.Undo(textEditor));
                editor.addHelper(new TextEditorHelper.Redo(textEditor));
                editor.addHelper(new TextEditorHelper.HidePlugins(textEditor));

                editor.initialize();

                window.editor = editor;
                Common.addEventListener('generic error', function () {
                    SystemNotification.error();
                });
            }

            init($('body'));
        });
    });
