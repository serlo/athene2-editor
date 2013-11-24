/*global define, require, MathJax*/
define(['jquery', 'underscore', 'text!./editor/templates/plugins/wiris/wiris_plugin.html', 'texteditor_plugin', 'translator'], function ($, _, plugin_template, EditorPlugin, t) {
    "use strict";
    var FormulaPlugin,
        wiris,
        latex2mml = 'http://www.wiris.net/demo/editor/latex2mathml',
        mml2latex = 'http://www.wiris.net/demo/editor/mathml2latex';

    require(['http://www.wiris.net/demo/editor/editor'], function () {
        wiris = com.wiris.jsEditor.JsEditor.newInstance({'language': 'en'});
    });

    function ajax (url, data) {
        return $.ajax({
            url: url,
            method: 'get',
            data: data
        });
    };

    FormulaPlugin = function () {
        this.state = 'math';
        this.init();
    };

    FormulaPlugin.prototype = new EditorPlugin();
    FormulaPlugin.prototype.constructor = FormulaPlugin;

    FormulaPlugin.prototype.init = function () {
        var self = this;

        self.template = _.template(plugin_template);

        self.data.name = 'Wiris';

        // self.data.content = '\\lim_{n\\to\\infty} \\frac{n(n-1)(n-2)...(n-k)(n-k-1)...(1)}{(n-k)(n-k-1)...(1)}\\Big(\\frac{1}{n^k}\\Big)';

        self.$el = $(self.template(self.data));
        $('.content', self.$el).height(450);
    };

    FormulaPlugin.prototype.activate = function (token) {
        var self = this,
            formular;

        formular = token.string;
        self.data.content = formular.substr(2, formular.length - 4);

        wiris.insertInto($('.content', self.$el)[0]);

        ajax(latex2mml, "latex=" + encodeURIComponent(self.data.content))
            .success(function (mml) {
                wiris.setMathML(mml);
            })
            .fail(function () {
                console.log(arguments);
            });


        self.$el.on('click', '.btn-success', function () {
            self.save();
        });
    };

    FormulaPlugin.prototype.save = function () {
        var self = this,
            data = wiris.getMathML();

        ajax(mml2latex, "mml=" + encodeURIComponent(data))
            .success(function (latex) {
                self.data.content = latex;
                self.trigger('save', self);
            }).fail(function () {
                console.log(arguments);
            });
    };

    EditorPlugin.Wiris = FormulaPlugin;
});