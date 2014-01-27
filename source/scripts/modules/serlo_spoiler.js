/*global define*/
define(['jquery'], function ($) {
    "use strict";
    var Spoiler;

    Spoiler = function () {
        return $(this).each(function () {
            $('> a', this)
                .unbind('click')
                .first()
                .click(function (e) {
                    e.preventDefault();
                    $(this).next().slideToggle();
                    return;
                });
        });
    };

    $.fn.Spoiler = Spoiler;
});