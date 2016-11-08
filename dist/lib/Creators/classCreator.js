"use strict";
class classCreator {
    static create(models, moduleName) {
        var blocks = [];
        for (var i = 0; i < models.length; i++) {
            var model = models[i];
            var body = "";
            body += "\texport class " + model.name + " implements " + model.moduleName + ".I" + model.name + " {\n";
            for (var j = 0; j < model.properties.length; j++) {
                var property = model.properties[j];
                body += "\t\t" + property.name + ": " + property.dataType + ";\n";
            }
            body += "\t}\n";
            var block = {
                codeType: 1,
                moduleName: moduleName,
                name: model.name,
                body: body
            };
            blocks.push(block);
        }
        return blocks;
    }
}
module.exports = classCreator;

//# sourceMappingURL=classCreator.js.map
