

define(function(require, exports, module) {
    exports.isDark = true;
    exports.cssClass = "ace-night-owl";
    //exports.cssText = require("./night_owl.css");

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});