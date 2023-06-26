// prettier.config.cjs
module.exports = {
  printWidth: 80, //单行长度
  tabWidth: 2, //缩进长度
  semi: true, //句末使用分号
  singleQuote: true, //使用单引号
  plugins: [require("prettier-plugin-tailwindcss")],
};
