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
define("ATHENE2-EDITOR", ['jquery', 'codemirror'],
    function ($, CodeMirror) {
        "use strict";
        var editor,
            $window,
            $code,
            $preview;

        function onChange(editor) {
            $preview.html(editor.getValue());
        }

        function init($context) {
            $window = $(window);
            $code = $('#code', $context);
            $preview = $('#preview .editor-main-inner');

            editor = CodeMirror.fromTextArea($code[0], {
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true
            });

            editor.setSize($window.width() / 2, $window.height() - 32);

            editor.on('change', function () {
                onChange.apply(this, arguments);
            });
        }

        // function initContextuals($context) {
            
        // }

        return {
            initialize: function ($context) {
                init($context);
            }
        };
    });

require(['jquery', 'ATHENE2-EDITOR'], function ($, Editor) {
    "use strict";

    $(function () {
        Editor.initialize($('body'));
    });
});