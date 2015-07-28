var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../../../bower_components/polymer-ts/polymer-ts.ts"/>
/// <reference path="../../../typings/github-electron/github-electron.d.ts" />
/// <reference path="../../../typings/node/node.d.ts" />
var IpcClient = require("electron-ipc-tunnel/client");
var fs = require("fs");
(function () {
    var KeysavOptions = (function (_super) {
        __extends(KeysavOptions, _super);
        function KeysavOptions() {
            var _this = this;
            _super.call(this);
            this.formatString = "B{{box}} - {{row}},{{column}} - {{speciesName}} - {{natureName}} - {{abilityName}} - {{ivHp}}.{{ivAtk}}.{{ivDef}}.{{ivSpAtk}}.{{ivSpDef}}.{{ivSpe}} - {{typeName hpType}}";
            this.ipcClient = new IpcClient();
            this.ipcClient.on("break-key-result", function (arg) {
                _this.breakMessage = arg.result.match(/^.*$/gm);
                _this.breakResult = arg;
                _this.$.dialogBreakDone.toggle();
            });
            this.ipcClient.on("file-dialog-save-result", function (arg) {
                if (arg) {
                    _this.ipcClient.send("break-key-store", { path: arg });
                }
                else {
                    _this.ipcClient.send("break-key-cancel");
                }
            });
        }
        KeysavOptions.prototype.break = function () {
            if (this.file1Type === this.file2Type && this.file1Type !== undefined)
                this.ipcClient.send("break-key", { file1: this.file1, file2: this.file2 });
            else
                this.$.dialogBreakNotSameFiles.toggle();
        };
        KeysavOptions.prototype.saveBreak = function () {
            if (this.breakResult.success) {
                this.ipcClient.send("file-dialog-save", { options: { defaultPath: this.breakResult.path, extensions: ["bin"] } });
            }
            else {
                this.ipcClient.send("break-key-cancel");
            }
        };
        KeysavOptions.prototype.cancelBreak = function () {
            this.ipcClient.send("break-key-cancel");
        };
        KeysavOptions.prototype.updateFileBase = function (name, oldValue) {
            var _this = this;
            if (this[name] !== undefined && this[name] !== "")
                fs.stat(this[name], function (err, res) {
                    if (err) {
                        _this[name] = oldValue;
                        _this.$.dialogFileInvalid.toggle();
                    }
                    else
                        switch (res.size) {
                            case 0x100000:
                            case 0x10009C:
                            case 0x10019A:
                                _this[name + "Type"] = "sav";
                                break;
                            case 28256:
                                _this[name + "Type"] = "bv";
                                break;
                            default:
                                _this[name] = oldValue;
                                _this.$.dialogFileInvalid.toggle();
                                break;
                        }
                });
        };
        KeysavOptions.prototype.file1Changed = function (newValue, oldValue) {
            this.updateFileBase("file1", oldValue);
        };
        KeysavOptions.prototype.file2Changed = function (newValue, oldValue) {
            this.updateFileBase("file2", oldValue);
        };
        __decorate([
            property({ type: String, reflectToAttribute: true, notify: true }), 
            __metadata('design:type', String)
        ], KeysavOptions.prototype, "formatString");
        __decorate([
            property({ type: String }), 
            __metadata('design:type', String)
        ], KeysavOptions.prototype, "file1");
        __decorate([
            property({ type: String }), 
            __metadata('design:type', String)
        ], KeysavOptions.prototype, "file2");
        __decorate([
            property({ type: Array }), 
            __metadata('design:type', Array)
        ], KeysavOptions.prototype, "breakMessage");
        Object.defineProperty(KeysavOptions.prototype, "file1Changed",
            __decorate([
                observe("file1"), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object, Object]), 
                __metadata('design:returntype', Object)
            ], KeysavOptions.prototype, "file1Changed", Object.getOwnPropertyDescriptor(KeysavOptions.prototype, "file1Changed")));
        Object.defineProperty(KeysavOptions.prototype, "file2Changed",
            __decorate([
                observe("file2"), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object, Object]), 
                __metadata('design:returntype', Object)
            ], KeysavOptions.prototype, "file2Changed", Object.getOwnPropertyDescriptor(KeysavOptions.prototype, "file2Changed")));
        KeysavOptions = __decorate([
            component("keysav-options"), 
            __metadata('design:paramtypes', [])
        ], KeysavOptions);
        return KeysavOptions;
    })(polymer.Base);
    polymer.createElement(KeysavOptions);
})();