# babel-plugin-auto-inject

babel 自动引入插件

## 插件功能

自动引入配置的模块

## 插件配置

```js
// babel.config.js
module.exports = {
  presets: [
    // other presets
  ],
  plugins: [
    [
      "babel-plugin-auto-inject",
      {
        m1: `import m1 from '@/common/m1';`,
        m2: `import { m2 } from '@/common/m2';`,
      },
    ],
  ],
};
```

## 使用
根据[以上配置](#插件配置)插件执行结果如下
```js
// 输入内容
m1.getData();
// 输出内容
import m1 from '@/common/m1';
m1.getData();
```
```js
// 输入内容
m1;
m2.getData();
// 输出内容
import m1 from '@/common/m1';
import m2 from '@/common/m1';
m1;
m2.getData();
```

