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
        "system_notification" : "modules/serlo_system_notification",
        "codemirror" : "codemirror/codemirror",
        "markdownmode" : "codemirror/mode/sfm/sfm",
        "searchcursor" : "codemirror/addon/search/searchcursor",
        "showdown": "libs/showdown",
        "parser" : "editor/serlo_parser",
        "preview" : "editor/serlo_editor_previewer",
        "layout_builder" : "editor/serlo_layout_builder",
        "layout_builder_configuration" : "editor/serlo_layout_builder_configuration",
        "formfield" : "editor/serlo_formfield",
        "texteditor_helper" : "editor/serlo_texteditor_helper",
        "texteditor_plugin_manager" : "editor/plugins/serlo_texteditor_plugin_manager",
        "texteditor_plugin" : "editor/plugins/serlo_texteditor_plugin",
        "texteditor_plugin_image" : "editor/plugins/image/image_plugin",
        "texteditor_plugin_wiris" : "editor/plugins/wiris/wiris_plugin"
    },
    shim: {
        underscore: {
            exports: '_',
            init: function () {
                // mustache templates to the rescue
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
            deps: ['bootstrap', 'polyfills', 'datepicker', 'fileupload', 'quickdiff', 'markdownmode', 'searchcursor', 'texteditor_plugin_image', 'texteditor_plugin_wiris']
        }
    },
    waitSeconds: 12
});
