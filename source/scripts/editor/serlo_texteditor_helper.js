/*global define*/
define(['jquery'], function ($) {
    var TextEditorHelper;

    TextEditorHelper = function (textEditor, settings) {
        var self = this;
        self.settings = $.extend({
            cursorDelta: 0
        }, settings);

        self.textEditor = textEditor;

        self.$el = $('<a class="helper" href="#">').text(settings.title);
        self.$el.click(function (e) {
            e.preventDefault();
            self.action();
            return;
        });
    };

    TextEditorHelper.prototype.action = function () {
        if (this.textEditor.options.readOnly === false) {
            if (this.settings.action) {
                return this.settings.action.apply(this, arguments);
            }

            var cursor = this.textEditor.getCursor(),
                selection = this.textEditor.getSelection();

            if (selection) {
                this.textEditor.replaceSelection(this.settings.replaceBefore + selection + this.settings.replaceAfter);
                this.textEditor.setCursor({
                    line: cursor.line,
                    ch: cursor.ch + this.settings.cursorDelta - selection.length
                });
            } else {
                this.textEditor.replaceRange(this.settings.replaceBefore + this.settings.replaceAfter, cursor);
                this.textEditor.setCursor({
                    line: cursor.line,
                    ch: cursor.ch + this.settings.cursorDelta
                });
            }

            this.textEditor.focus();
        }
    };

    TextEditorHelper.Bold = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'B',
            replaceBefore: '**',
            replaceAfter: '**',
            cursorDelta: 2
        });
    };

    TextEditorHelper.Italic = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'I',
            replaceBefore: '*',
            replaceAfter: '*',
            cursorDelta: 1
        });
    };

    TextEditorHelper.Link = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'Link',
            replaceBefore: '[Link Title](',
            replaceAfter: ')',
            cursorDelta: 1
        });
    };

    return TextEditorHelper;
});