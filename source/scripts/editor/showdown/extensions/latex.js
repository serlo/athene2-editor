(function () {
    var escapeCharacters,
        escapeCharacters_callback,
        _EncodeCode,
        latex = function (converter) {
        var filter,
            findLatex = new RegExp(/\/\/\/ (.*)\n([\s\S]*?)\/\/\//g);

        filter = function (text) {
            // text = text.replace(/(^|[^\\])(%%)([^\r]*?[^%])\2(?!%)/gm,
            text = text.replace(/(^|[^\\])(%%)([^\r]*?[^%])(%%?%)/gm,
                function (wholeMatch, m1, m2, m3, m4) {
                    var c = m3;
                    c = c.replace(/^([ \t]*)/g, ""); // leading whitespace
                    c = c.replace(/[ \t]*$/g, ""); // trailing whitespace
                    c = _EncodeCode(c);
                    if (m4 === '%%%') {
                        c += '%';
                    }
                    return m1 + '<span class="mathInline">%%' + c + "%%</span>";
                });

            text = text.replace(/(^|[^\\])(~D~D)([^\r]*?[^~])\2(?!~D)/gm,
                function(wholeMatch, m1, m2, m3, m4) {
                    var c = m3;
                    c = c.replace(/^([ \t]*)/g, ""); // leading whitespace
                    c = c.replace(/[ \t]*$/g, ""); // trailing whitespace
                    c = _EncodeCode(c);
                    return m1 + '<span class="math">~D~D' + c + "~D~D</span>";
                });

            return text;
        };

        return [{
            type: 'lang',
            filter: filter
        }];
    };

    // FROM shodown.js
    _EncodeCode = function(text) {
        //
        // Encode/escape certain characters inside Markdown code runs.
        // The point is that in code, these characters are literals,
        // and lose their special Markdown meanings.
        //
        // Encode all ampersands; HTML entities are not
        // entities within a Markdown code span.
        text = text.replace(/&/g, "&amp;");

        // Do the angle bracket song and dance:
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");

        // Pipes are escaped early, unescape them into escaped pipes.
        // Need to find better solution.
        text = text.replace(/~E124E/g, "\\|");

        // Now, escape characters that are magic in Markdown:
        text = escapeCharacters(text, "\*`_{}[]\\", false);

        return text;
    };

    escapeCharacters = function (text, charsToEscape, afterBackslash) {
        // First we have to escape the escape characters so that
        // we can build a character class out of them
        var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

        if (afterBackslash) {
            regexString = "\\\\" + regexString;
        }

        var regex = new RegExp(regexString,"g");
        text = text.replace(regex,escapeCharacters_callback);

        return text;
    };


    escapeCharacters_callback = function (wholeMatch,m1) {
        var charCodeToEscape = m1.charCodeAt(0);
        return "~E"+charCodeToEscape+"E";
    };

    // Client-side export
    if (typeof define === 'function' && define.amd) {
        define('showdown_latex', ['showdown'], function (Showdown) {
            Showdown.extensions = Showdown.extensions || {};
            Showdown.extensions.latex = latex;
        });
    } else if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.latex = latex;
    }
    // Server-side export
    if (typeof module !== 'undefined') {
        module.exports = latex;
    }
}());