import { downloadAndUnzipVSCode } from "vscode-test";

import * as vscode from 'vscode';
import {PythonShell} from 'python-shell';
import { cwd } from "process";
import * as fs from 'fs';

export function runDetectDeprecatedAPI(){
    var shell = require('shelljs');
    var path = require('path');
    shell.cd(path.join(__dirname, "pyScripts/"));
    shell.exec('python main.py');
}
export function getDeprecatedAPIcall(currentLine:string, apiElements:string[]){
    apiElements.forEach(element => {
        let words:string[] = currentLine.split(" ");
        words.forEach(word => {
            console.log(word,element);
            if(element.indexOf(word)!==-1){
                console.log(element);
            }
        });
    });
}
export function readContents(currentLine:string){
    let list:string[] = [];
    if(currentLine.indexOf("import")!==-1){
        console.log(currentLine);
        if(currentLine.indexOf("sklearn")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "pyScripts/output/sklearn_deprecated_api_elements.txt");
            fs.readFile(fp1, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                let list1:string[] = data.toString().split("\n");
                list1.forEach(element => {
                    list.push(element);
                });
                // console.log(list);
            });
        }
        if(currentLine.indexOf("seaborn")!==-1){
            // console.log("here2");
            let path = require('path');
            let fp1:string = path.join(__dirname, "pyScripts/output/seaborn_deprecated_api_elements.txt");
            fs.readFile(fp1, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                let list1:string[] = data.toString().split("\n");
                list1.forEach(element => {
                    list.push(element);
                });
                // console.log(list);
            });
        }
        if(currentLine.indexOf("numpy")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "pyScripts/output/numpy_deprecated_api_elements.txt");
            fs.readFile(fp1, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                let list1:string[] = data.toString().split("\n");
                list1.forEach(element => {
                    list.push(element);
                });
                // console.log(list);
            });
        }
        if(currentLine.indexOf("matplotlib")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "pyScripts/output/matplotlib_deprecated_api_elements.txt");
            fs.readFile(fp1, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                let list1:string[] = data.toString().split("\n");
                list1.forEach(element => {
                    list.push(element);
                });
                // console.log(list);
            });
        }
        if(currentLine.indexOf("pandas")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "pyScripts/output/pandas_deprecated_api_elements.txt");
            fs.readFile(fp1, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                let list1:string[] = data.toString().split("\n");
                list1.forEach(element => {
                    list.push(element);
                });
                // console.log(list);
            });
        }
        if(currentLine.indexOf("scipy")!==-1){
            let path = require('path');
            let fp1:string = path.join(__dirname, "pyScripts/output/scipy_deprecated_api_elements.txt");
            fs.readFile(fp1, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                let list1:string[] = data.toString().split("\n");
                list1.forEach(element => {
                    list.push(element);
                });
                //console.log(list);
            });
        }
    }
    return list;
}