/**
 * Serlo Flavored Markdown
 * Injections:
 * Transforms >[Title](injectionUrl)
 * into <div class="injection"><a href="injectionUrl" class="injection-link">Title</a></div>
 **/
(function () {
    var injections = function (converter) {
        var filter,
            findInjections = new RegExp(/>\[(.*)\]\((.*)\)/g);

        filter = function (text) {
            return text.replace(findInjections, function (original, title, url) {
                return '<div class="injection"><a href="' + url + '" class="injection-link">' + title + '</a></div>';
            });
        };

        return [{
            type: 'lang',
            filter: filter
        }];
    }
    // Client-side export
    if (typeof define === 'function' && define.amd) {
        define('showdown_injections', ['showdown'], function (Showdown) {
            Showdown.extensions = Showdown.extensions || {};
            Showdown.extensions.injections = injections;
        });
    } else if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.injections = injections;
    }
    // Server-side export
    if (typeof module !== 'undefined') {
        module.exports = injections;
    }
}());