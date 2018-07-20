const fs = require('fs');
const pathLib = require('path');
const Module = require("module");

function stripBOM(text) {
    if (text.startsWith("\ufeff")) {
        return text.slice(1);
    }
    return text;
}

module.exports = function (path) {
    console.log('path', path)
    console.log('module.parent', module.parent.filename)
    const caller = module.parent.filename;
    console.log('caller', caller)
    const usrModule = require.resolve(pathLib.resolve(pathLib.dirname(caller), path));
    console.log('usrModule', usrModule)
    const cachedModule = Module._cache[usrModule];
    if (cachedModule) {
        const children = parent && parent.children;
        if (children && !children.includes(cachedModule)) {
            children.push(cachedModule);
        }
        return cachedModule.exports;
    }
    let code = fs.readFileSync(usrModule);
    code = `(async function(){
            ${code}
        })()`;
    const mod = new Module(usrModule, module.parent);
    Module._cache[usrModule] = mod;
    mod.filename = usrModule;
    mod.paths = Module._nodeModulePaths(pathLib.dirname(usrModule));
    mod._compile(stripBOM(code), usrModule);
    return mod.exports;
}