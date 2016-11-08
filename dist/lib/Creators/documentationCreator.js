"use strict";
const _ = require("lodash");
class documentationCreator {
    static create(signature) {
        var result = "";
        if (signature.summary) {
            result += "\t * " + this.wordWrap(signature.summary, 140) + "\n";
        }
        _.forEach(signature.parameters, (p, i) => {
            if (p.description) {
                result += "\t * @param " + this.wordWrap(p.description, 140) + "\n";
            }
        });
        if (result.length > 0) {
            result = "\t/**\n" + result + "\t */\n";
        }
        return result;
    }
    static wordWrap(input, maxLength) {
        if (input.length > maxLength) {
            var pos = maxLength;
            for (; pos > 0 && input[pos] != " "; pos--) {
            }
            if (pos > 0) {
                var left = input.substring(0, pos);
                var right = input.substring(pos + 1);
                return left + "\n\t * " + this.wordWrap(right, maxLength);
            }
        }
        return input;
    }
}
module.exports = documentationCreator;

//# sourceMappingURL=documentationCreator.js.map
