/*global define, require, MathJax*/
define(
    ['jquery',
    'underscore',
    'text!./editor/templates/plugins/wiris/wiris_plugin.html',
    'texteditor_plugin',
    'translator',
    'common'],
    function ($, _, plugin_template, EditorPlugin, t, Common) {
        "use strict";
        var FormulaPlugin,
            wiris,
            latex2mml = 'http://www.wiris.net/demo/editor/latex2mathml',
            mml2latex = 'http://www.wiris.net/demo/editor/mathml2latex';

        function ajax (url, data, method) {
            return $.ajax({
                url: url,
                method: method || 'get',
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
            var that = this;

            that.template = _.template(plugin_template);

            that.data.name = 'Wiris';

            // that.data.content = '\\lim_{n\\to\\infty} \\frac{n(n-1)(n-2)...(n-k)(n-k-1)...(1)}{(n-k)(n-k-1)...(1)}\\Big(\\frac{1}{n^k}\\Big)';

            that.$el = $(that.template(that.data));
            $('.content', that.$el).height(450);
        };

        FormulaPlugin.prototype.activate = function (token) {
            var that = this,
                formular;

            that.token = token;

            function asyncActivate() {
                formular = token.state.string;
                that.data.content = formular.substr(2, formular.length - 4);

                wiris.insertInto($('.content', that.$el)[0]);

                ajax(latex2mml, "latex=" + encodeURIComponent(that.data.content))
                    .success(function (mml) {
                        wiris.setMathML(mml);
                    })
                    .fail(Common.genericError);


                that.$el.on('click', '.btn-success', function () {
                    that.save();
                });
            }

            if (wiris) {
                asyncActivate();
            } else {
                require(['http://www.wiris.net/demo/editor/editor'], function () {
                    wiris = com.wiris.jsEditor.JsEditor.newInstance({
                        'language': 'en'
                    });
                    asyncActivate();
                });
            }
        };

        FormulaPlugin.prototype.deactivate = function () {
            this.$el.detach();
            wiris.close();
        };

        FormulaPlugin.prototype.save = function () {
            var that = this,
                data = wiris.getMathML();

            ajax(mml2latex, "mml=" + encodeURIComponent(data), 'post')
                .success(function (latex) {
                    that.data.content = '$$' + latex + '$$';
                    that.trigger('save', that);
                }).fail(Common.genericError);
        };

        EditorPlugin.Wiris = FormulaPlugin;
    }
);