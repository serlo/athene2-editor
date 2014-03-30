/**
 * Serlo Flavored Markdown
 * Spoilers:
 * Transforms ///.../// blocks into spoilers
 **/
(function () {
    var spoiler = function (converter) {
        var filter,
            findSpoilers = new RegExp(/^\/\/\/ (.*)\n([\s\S]*?)(\n|\r)+\/\/\//gm);

        filter = function (text) {
            return text.replace(findSpoilers, function (original, title, content) {
                return '<div class="spoiler"><a href="#" class="spoiler-teaser">' + title + '</a><div class="spoiler-content">' + converter.makeHtml(content) + '</div></div>';
            });
        };

        return [{
            type: 'lang',
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