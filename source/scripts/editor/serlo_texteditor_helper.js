/*global define*/
define(['jquery', 'translator'], function ($, t) {
    var TextEditorHelper;

    TextEditorHelper = function (textEditor, settings) {
        var that = this;

        that.settings = $.extend({
            cursorDelta: 0
        }, settings);

        that.textEditor = textEditor;

        that.$el = $('<a class="helper" href="#">').text(settings.title);
        that.$el.click(function (e) {
            e.preventDefault();
            that.action();
            return;
        });
    };

    TextEditorHelper.prototype.action = function () {
        if (this.textEditor.options.readOnly === false) {
            if (this.settings.action) {
                return this.settings.action.apply(this, arguments);
            }

            var cursor = this.textEditor.getCursor(false),
                selection = this.textEditor.getSelection(),
                anchor = {line: cursor.line, ch: cursor.ch},
                head = null;

            if (selection) {
                this.textEditor.replaceSelection(this.settings.replaceBefore + selection + this.settings.replaceAfter);
                anchor.ch = cursor.ch + this.settings.cursorDelta - selection.length;
            } else {
                this.textEditor.replaceRange(this.settings.replaceBefore + this.settings.replaceAfter, cursor);
                anchor.ch = cursor.ch + this.settings.cursorDelta;
            }

            if (this.settings.selectionDelta) {
                head = {
                    line: cursor.line
                };

                if (this.settings.selectionDelta === 'selection') {
                    head.ch = anchor.ch + (selection ? selection.length : 0);
                } else {
                    head.ch = anchor.ch + this.settings.selectionDelta;
                }
            }

            this.textEditor.setSelection(anchor, head);
            this.textEditor.focus();
        }
    };

    TextEditorHelper.Bold = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'B',
            replaceBefore: '**',
            replaceAfter: '**',
            cursorDelta: 2,
            selectionDelta: 'selection'
        });
    };

    TextEditorHelper.Italic = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'I',
            replaceBefore: '*',
            replaceAfter: '*',
            cursorDelta: 1,
            selectionDelta: 'selection'
        });
    };

    TextEditorHelper.List = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'List',
            replaceBefore: '* ',
            replaceAfter: '\n* ',
            cursorDelta: 2,
            selectionDelta: 'selection'
        });
    };

    TextEditorHelper.Link = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'Link',
            replaceBefore: '[Link Title](',
            replaceAfter: ')',
            cursorDelta: 1,
            selectionDelta: 10
        });
    };

    TextEditorHelper.Image = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'Image',
            replaceBefore: '![Image Title](',
            replaceAfter: ')',
            cursorDelta: 2,
            selectionDelta: 11
        });
    };

    TextEditorHelper.Formula = function (textEditor) {
        return new TextEditorHelper(textEditor, {
            title: 'Formula',
            replaceBefore: '$$',
            replaceAfter: '$$',
            cursorDelta: 2,
            selectionDelta: 'selection'
        });
    };

    TextEditorHelper.Undo = function (textEditor) {
        var that = this;
        that.title = 'Undo';
        that.$el = $('<a class="helper" href="#">').text(that.title);
        that.$el.click(function (e) {
            e.preventDefault();
            textEditor.undo();
            return;
        });
    };

    TextEditorHelper.Redo = function (textEditor) {
        var that = this;
        that.title = 'Redo';
        that.$el = $('<a class="helper" href="#">').text(that.title);
        that.$el.click(function (e) {
            e.preventDefault();
            textEditor.redo();
            return;
        });
    };

    TextEditorHelper.HidePlugins = function (textEditor) {
        var that = this;
        that.title = 'Hide Plugins';
        that.editor = textEditor;
        that.hide = that.editor.hidePlugins = false;
        that.$el = $('<a class="helper" href="#">').text(that.title);
        that.$el.click(function (e) {
            e.preventDefault();
            that.action();
            return;
        });
    };

    TextEditorHelper.HidePlugins.prototype.action = function () {
        this.active = this.editor.hidePlugins = !this.active;
        this.$el.toggleClass('active', this.active);
    };

    TextEditorHelper.Spoiler = function (textEditor) {
        var titleText = t('Title');
        return new TextEditorHelper(textEditor, {
            title: 'Spoiler',
            replaceBefore: "/// " + titleText + "\n",
            replaceAfter: "\n///",
            cursorDelta: 4,
            selectionDelta: titleText.length
        });
    };

    return TextEditorHelper;
});