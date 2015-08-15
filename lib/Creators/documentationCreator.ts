import _ = require("lodash");

class documentationCreator {
    static create(signature: ISignatureDefinition): string {
        var result: string = "";
        if (signature.summary) {
            result += "\t * " + this.wordWrap(signature.summary, 140) + "\n";
        }

        _.forEach(signature.parameters, (p: IParamDefinition, i: number) => {
            if (p.description) {
                result += "\t * @param " + this.wordWrap(p.description, 140) + "\n";
            }
        });

        if (result.length > 0) {
            result = "\t/**\n" + result + "\t */\n";
        }

        return result;
    }

    private static wordWrap(input: string, maxLength: number): string {
        if (input.length > maxLength) {
            var pos = maxLength
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

export = documentationCreator;
