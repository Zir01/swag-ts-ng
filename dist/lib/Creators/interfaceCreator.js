"use strict";
class interfaceCreator {
    static create(models, moduleName) {
        var blocks = [];
        for (var i = 0; i < models.length; i++) {
            var model = models[i];
            var body = "";
            body += "\texport interface I" + model.name + " {\n";
            for (var j = 0; j < model.properties.length; j++) {
                var property = model.properties[j];
                body += "\t\t" + property.name + ": " + property.dataType + ";\n";
            }
            body += "\t}\n";
            var block = {
                codeType: 0,
                moduleName: moduleName,
                name: "I" + model.name,
                body: body
            };
            blocks.push(block);
        }
        return blocks;
    }
}
module.exports = interfaceCreator;

//# sourceMappingURL=interfaceCreator.js.map
