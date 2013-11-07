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

        Editor = function () {
            var self = this;
            self.plugins = [];
            $window.resize(function () {
                self.resize();
            });
        };

        Editor.prototype.addPlugin = function (plugin) {
            this.plugins.push(plugin);
        };

        Editor.prototype.setTextEditor = function (textEditor) {
            this.editor = textEditor;
            return this;
        };

        Editor.prototype.initTextEditor = function () {
            var self = this;
            self.resize();

            self.editor.on('change', function () {
                self.onEditorChange();
            });

            return this;
        };

        Editor.prototype.resize = function () {
            if (this.editor) {
                this.editor.setSize($window.width() / 2, $window.height() - 32);
            }
            return this;
        };

        Editor.prototype.setParser = function (textParser) {
            this.parser = textParser;
            return this;
        };

        Editor.prototype.setPreviewer = function (preview) {
            this.preview = preview;
            return this;
        };

        Editor.prototype.onEditorChange = function () {
            var value = this.editor.getValue();

            if (this.parser) {
                value = this.parser.parse(value);
            }

            if (this.preview) {
                this.preview.show(value);
            }
        };

        return new Editor();
    });

require(['jquery', 'ATHENE2-EDITOR', 'codemirror', 'markdownparser', 'editor_previewer'], function ($, Editor, CodeMirror, MarkdownParser, EditorPreviewer) {
    "use strict";

    $(function () {

        function init($context) {

            Editor
                .setTextEditor(CodeMirror.fromTextArea($('#code', $context)[0], {
                    lineNumbers: true,
                    styleActiveLine: true,
                    matchBrackets: true
                }))
                .initTextEditor()
                .setParser(new MarkdownParser())
                .setPreviewer(new EditorPreviewer({
                    selector: '#preview .editor-main-inner'
                }));
            Editor.onEditorChange();
        }

        init($('body'));
    });
});