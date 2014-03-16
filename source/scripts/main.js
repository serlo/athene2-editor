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
/*global require*/
require.config({
    name: 'ATHENE2-EDITOR',
    baseUrl: "/build/scripts",
    paths: {
        "jquery": "../bower_components/jquery/jquery",
        "jquery.ui.widget": "../bower_components/jquery-ui/ui/jquery.ui.widget",
        "quickdiff": "libs/quickdiff",

        "loadimage": "../bower_components/blueimp-load-image/js/load-image",
        "fileupload": "../bower_components/blueimp-file-upload/js/jquery.fileupload",
        "fileupload_iframetransport": "../bower_components/blueimp-file-upload/js/jquery.iframe-transport",

        "bootstrap": "../bower_components/sass-bootstrap/dist/js/bootstrap",
        "underscore": "../bower_components/underscore/underscore",
        "moment" : "../bower_components/momentjs/min/moment.min",
        "moment_de": "../bower_components/momentjs/lang/de",
        "common" : "modules/serlo_common",
        "events": "libs/eventscope",
        "cache": "libs/cache",
        "polyfills": "libs/polyfills",
        "datepicker" : "../bower_components/bootstrap-datepicker/js/bootstrap-datepicker",
        "translator" : "modules/serlo_translator",
        "i18n" : "modules/serlo_i18n",
        "support" : "modules/serlo_supporter",
        "modals" : "modules/serlo_modals",
        "router" : "modules/serlo_router",
        "system_notification" : "modules/serlo_system_notification",
        "shortcuts" : "modules/serlo_shortcuts",

        "codemirror" : "codemirror/codemirror",
        "markdownmode" : "codemirror/mode/sfm/sfm",
        "searchcursor" : "codemirror/addon/search/searchcursor",

        // "showdown": "libs/showdown",
        "showdown": "../bower_components/showdown/src/showdown",
        "showdown_table" : "editor/showdown/extensions/table",
        "showdown_spoiler" : "editor/showdown/extensions/spoiler",
        "showdown_htmlstrip" : "editor/showdown/extensions/htmlStrip",
        "showdown_latex" : "editor/showdown/extensions/latex",
        "showdown_injections" : "editor/showdown/extensions/injections",
        "showdown_strikethrough" : "editor/showdown/extensions/strikeThrough",
        "showdown_atusername" : "editor/showdown/extensions/atUsername",
        "showdown_newline" : "editor/showdown/extensions/newline",

        "content" : "modules/serlo_content",
        "spoiler" : "modules/serlo_spoiler",

        "parser" : "editor/serlo_parser",
        "preview" : "editor/serlo_editor_previewer",
        "row" : "editor/serlo_layout_row",
        "column" : "editor/serlo_layout_column",
        "layout_add" : "editor/serlo_layout_add",
        "layout_builder" : "editor/serlo_layout_builder",
        "layout_builder_configuration" : "editor/serlo_layout_builder_configuration",
        "formfield" : "editor/serlo_formfield",
        "texteditor_helper" : "editor/serlo_texteditor_helper",
        "texteditor_plugin_manager" : "editor/plugins/serlo_texteditor_plugin_manager",
        "texteditor_plugin" : "editor/plugins/serlo_texteditor_plugin",
        "texteditor_plugin_image" : "editor/plugins/image/image_plugin",
        "texteditor_plugin_wiris" : "editor/plugins/wiris/wiris_plugin",
        "texteditor_plugin_injection" : "editor/plugins/injection/injection_plugin",
        "texteditor_plugin_default_injection" : "editor/plugins/injection/injection_default_plugin",
        "texteditor_plugin_geogebra_injection" : "editor/plugins/injection/injection_geogebra_plugin"
    },
    shim: {
        underscore: {
            exports: '_',
            init: function () {
                // mustache template style
                this._.templateSettings = {
                    interpolate: /\{\{(.+?)\}\}/g
                };
                return this._;
            }
        },
        quickdiff: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        datepicker: {
            deps: ['jquery', 'bootstrap']
        },
        fileupload: {
            deps: ['jquery']
        },
        markdownmode: {
            deps: ['codemirror']
        },
        searchcursor: {
            deps: ['codemirror']
        },
        codemirror: {
            exports: "CodeMirror"
        },
        "ATHENE2-EDITOR": {
            deps: [
                'bootstrap',
                'polyfills',
                'datepicker',
                'fileupload',
                'quickdiff',
                'markdownmode',
                'searchcursor'
            ]
        }
    },
    waitSeconds: 12
});
