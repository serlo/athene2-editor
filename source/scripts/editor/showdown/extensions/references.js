/**
 * Serlo Flavored Markdown
 * References:
 * Transforms >[Title](referenceUrl)
 * into <div class="reference"><a href="referenceUrl" class="reference-link">Title</a></div>
 **/
(function () {
    var references = function (converter) {
        var filter,
            findReferences = new RegExp(/>\[(.*)\]\((.*)\)/g);

        filter = function (text) {
            return text.replace(findReferences, function (original, title, url) {
                return '<div class="reference"><a href="' + url + '" class="reference-link">' + title + '</a></div>';
            });
        };

        return [{
            type: 'lang',
            filter: filter
        }];
    }
    // Client-side export
    if (typeof define === 'function' && define.amd) {
        define('showdown_references', ['showdown'], function (Showdown) {
            Showdown.extensions = Showdown.extensions || {};
            Showdown.extensions.references = references;
        });
    } else if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.references = references;
    }
    // Server-side export
    if (typeof module !== 'undefined') {
        module.exports = references;
    }
}());