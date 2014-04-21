/**
 * Serlo Flavored Markdown
 * Spoilers:
 * Transforms ///.../// blocks into spoilers
 **/
(function () {
    var spoiler = function (converter) {
        var filter,
            findSpoilers = new RegExp(/^<p>=,sp. (.*)<\/p>([\s\S]*?)<p>=,sp.<\/p>/gm);

        filter = function (text) {
            return text.replace(findSpoilers, function (original, title, content) {
                return '<div class="spoiler"><a href="#" class="spoiler-teaser">' + title + '&nbsp;<b class="caret"></b></a><div class="spoiler-content">' + content + '</div></div>';
            });
        };

        return [{
            type: 'output',
            filter: filter
        }];
    }
    // Client-side export
    if (typeof define === 'function' && define.amd) {
        define('showdown_spoiler', ['showdown'], function (Showdown) {
            Showdown.extensions = Showdown.extensions || {};
            Showdown.extensions.spoiler = spoiler;
        });
    } else if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.spoiler = spoiler;
    }
    // Server-side export
    if (typeof module !== 'undefined') {
        module.exports = spoiler;
    }
}());