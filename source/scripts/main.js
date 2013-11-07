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
        "codemirror" : "codemirror/codemirror",
        "markdownmode" : "codemirror/mode/markdown/markdown"
    },
    shim: {
        underscore: {
            exports: '_'
        },
        bootstrap: {
            deps: ['jquery']
        },
        datepicker: {
            deps: ['jquery', 'bootstrap']
        },
        markdownmode: {
            deps: ['codemirror']
        },
        codemirror: {
            exports: "CodeMirror"
        },
        "ATHENE2-EDITOR": {
            deps: ['bootstrap', 'polyfills', 'datepicker', 'markdownmode']
        }
    },
    waitSeconds: 12
});