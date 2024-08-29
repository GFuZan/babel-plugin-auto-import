/**
 * 自动引入插件
 * @param {import('@babel/core')} babel
 * @param {{ [K: string]: string }} options
 * @returns {import('@babel/core').PluginObj} 插件对象
 * @example
 * ```js
 *   // 插件配置
 *   plugins: [
 *    [
 *      "babel-plugin-auto-inject",
 *      {
 *        // 添加全局变量 nav, 从 '@/common' 导入
 *        nav: `import { nav } from '@/common';`,
 *        // 添加全局变量 xxx, 从 '@/xxx' 导入
 *        xxx: `import { xxx } from '@/xxx';`,
 *      },
 *     ],
 *   ],
 * ```
 */
const plugin = function (babel, options = {}) {
  const isBabel6 = babel.version.split(".")[0] === "6";
  const { template } = babel;
  const emptyObj = {};
  const getAst = isBabel6
    ? (code) => template(code, { sourceType: "module" })()
    : (code) => template.ast(code);

  return {
    visitor: {
      Program: {
        enter(path, state) {
          state.rootPath = path;
          state.importsAdded = new Set();
        },
      },
      Identifier(innerPath, state) {
        const { importsAdded, rootPath } = state;
        const opts = state.opts || options;
        const { name } = innerPath.node;
        const importValue = !emptyObj[name] && opts[name];
        if (
          importValue &&
          !importsAdded.has(name) &&
          !innerPath.scope.hasBinding(name) &&
          innerPath.key !== "property"
        ) {
          importsAdded.add(name);
          rootPath.node.body.unshift(getAst(importValue));
        }
      },
    },
  };
};

module.exports = plugin;
