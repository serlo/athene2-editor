/*global define*/
define(['jquery'], function ($) {
    var TextEditorHelper;

    TextEditorHelper = function (settings) {
        var self = this;
        self.settings = settings;

        self.$el = $('<a class="helper" href="#">').text(settings.title);
        self.$el.click(function (e) {
            e.preventDefault();
            self.action();
            return;
        });
    };

    TextEditorHelper.prototype.action = function () {
        this.settings.action.apply(this, arguments);
    };

    TextEditorHelper.Bold = function (textEditor) {
        return new TextEditorHelper({
            title: 'B',
            action: function () {
                var cursor,
                    selection = textEditor.getSelection();
                if (selection) {
                    textEditor.replaceSelection('**' + selection + '**');
                } else {
                    cursor = textEditor.getCursor();
                    textEditor.replaceRange('****', cursor);
                    textEditor.setCursor({
                        line: cursor.line,
                        ch: cursor.ch - selection.length + 2
                    });
                }
                textEditor.focus();
            }
        });
    };

    TextEditorHelper.Italic = function (textEditor) {
        return new TextEditorHelper({
            title: 'I',
            action: function () {
                var cursor,
                    selection = textEditor.getSelection();
                if (selection) {
                    textEditor.replaceSelection('*' + selection + '*');
                    textEditor.setCursor({
                        line: cursor.line,
                        ch: cursor.ch - selection.length + 1
                    });
                } else {
                    cursor = textEditor.getCursor();
                    textEditor.replaceRange('**', cursor);
                    textEditor.setCursor({
                        line: cursor.line,
                        ch: cursor.ch + 1
                    });
                }
                textEditor.focus();
            }
        });
    };

    TextEditorHelper.Link = function (textEditor) {
        return new TextEditorHelper({
            title: 'Link',
            action: function () {
                var cursor = textEditor.getCursor(),
                    selection = textEditor.getSelection();
                if (selection) {
                    textEditor.replaceSelection('[Link Title](' + selection + ')');
                } else {
                    textEditor.replaceRange('[Link Title](Link Url)', cursor);
                }
                textEditor.setCursor({
                    line: cursor.line,
                    ch: cursor.ch - selection.length + 1
                });
                textEditor.focus();
            }
        });
    };

    return TextEditorHelper;
});