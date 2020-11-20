"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readContents = exports.getDeprecatedAPIcall = exports.runDetectDeprecatedAPI = void 0;
const fs = require("fs");
function runDetectDeprecatedAPI() {
    var shell = require('shelljs');
    var path = require('path');
    shell.cd(path.join(__dirname, "commands/pyScripts/"));
    shell.exec('python main.py');
}
exports.runDetectDeprecatedAPI = runDetectDeprecatedAPI;
function getDeprecatedAPIcall(currentLine, apiElements) {
    apiElements.forEach(element => {
        let words = currentLine.split(" ");
        words.forEach(word => {
            console.log(word, element);
            if (element.indexOf(word) !== -1) {
                console.log(element);
            }
        });
    });
}
exports.getDeprecatedAPIcall = getDeprecatedAPIcall;
function readContents(currentLine) {
    let list = [];
    const packages = ["sklearn", "pandas", "numpy", "scipy", "seaborn", "matplotlib"];
    if (currentLine.indexOf("import") !== -1) {
        console.log(currentLine);
        for (let i = 0; i < packages.length; i++) {
            if (currentLine.indexOf(packages[i]) !== -1) {
                let path = require('path');
                let fp1 = path.join(__dirname, "commands/pyScripts/output/" + packages[i] + "_deprecated_api_elements.txt");
                fs.readFile(fp1, function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    let list1 = data.toString().split("\n");
                    list1.forEach(element => {
                        list.push(element);
                    });
                });
            }
        }
    }
    return list;
}
exports.readContents = readContents;
//# sourceMappingURL=readLocalList.js.map