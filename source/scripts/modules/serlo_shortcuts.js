/*global define*/
define(['jquery', 'common', 'events'], function ($, Common, eventScope) {
    "use strict";
    var Shortcuts,
        checkWrapper,
        commandWrapper;

    // contains special keyCodes
    // that should be printed
    // as words: 'left' instead of 37
    commandWrapper = {
        left: Common.KeyCode.left,
        up: Common.KeyCode.up,
        right: Common.KeyCode.right,
        down: Common.KeyCode.down,
        enter: Common.KeyCode.enter,
        backspace: Common.KeyCode.backspace,
        entf: Common.KeyCode.entf,
        esc: Common.KeyCode.esc,
        shift: Common.KeyCode.shift
    };

    checkWrapper = Common.memoize(function (keyCode) {
        var key,
            result = keyCode;

        for (key in commandWrapper) {
            if (commandWrapper[key] === keyCode) {
                result = key;
                break;
            }
        }

        return result;
    });

    function triggerShortcut(e) {
        var commands = [];

        if (e.metaKey) {
            commands.push('cmd');
        }
        if (e.ctrlKey) {
            commands.push('ctrl');
        }
        if (e.shiftKey) {
            commands.push('shift');
        }

        if (e.keyCode !== Common.KeyCode.cmd &&
            e.keyCode !== Common.KeyCode.shift &&
            e.keyCode !== Common.KeyCode.ctrl) {
            commands.push(checkWrapper(e.keyCode));
        }

        commands = commands.join('+');
        /*jshint validthis:true */
        this.trigger(commands, e);
        this.trigger('always', commands, e);
    }

    Shortcuts = function () {
        var that = this;

        eventScope(that);

        $(window).keydown(function (e) {
            triggerShortcut.call(that, e);
        });
    };

    return Shortcuts;
});