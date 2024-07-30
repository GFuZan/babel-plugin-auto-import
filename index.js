/**
 * 自动引入插件
 * @param {import('@babel/core')} babel
 * @param {{ [K: string]: string }} options
 * @returns {{ visitor: import('@babel/core').Visitor }} 插件对象
 *@example
 * ```js
 *   // 插件配置
 *   plugins: [
 *    [
 *      "babel-plugin-auto-import",
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
  return {
    visitor: {
      Program(path, state) {
        path.traverse(traverseOptions, {
          importsAdded: new Set(),
          rootPath: path,
          options: state.opts || options,
          babel,
        });
      },
    },
  };
};

/**
 * @type {import('@babel/core').Visitor}
 */
const traverseOptions = {
  Identifier(innerPath, state) {
    const {
      importsAdded,
      rootPath,
      options,
      babel: { template, types: t },
    } = state;
    const { name } = innerPath.node;
    const importValue = options[name];
    if (
      importValue &&
      !importsAdded.has(name) &&
      !innerPath.scope.hasBinding(name) &&
      innerPath.key !== "property"
    ) {
      importsAdded.add(name);
      rootPath.node.body.unshift(template.ast(importValue));
    }
  },
};

module.exports = plugin;
