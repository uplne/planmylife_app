module.exports = {
  env: {
      browser: true, // Browser global variables like `window` etc.
      commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
      es6: true, // Enable all ECMAScript 6 features except for modules.
      jest: true, // Jest global variables like `it` etc.
      node: true // Defines things like process.env when generating through node
  },
  extends: [
    "eslint:recommended", "plugin:import/errors", "plugin:import/warnings", "plugin:import/typescript",
  ],
  // ignorePatterns: ["/*", "!/src"],
  parser: "@babel/eslint-parser", // Uses babel-eslint transforms.
  parserOptions: {
      ecmaFeatures: {
          jsx: true
      },
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: "module", // Allows for the use of imports
      requireConfigFile: false
  },
  root: true, // For configuration cascading.
  globals: {
    React: true,
  },
  rules: {
      "comma-dangle": [
          "warn",
          "never"
      ],
      "eol-last": "error",
      "import/order": [
          "warn",
          {
              alphabetize: {
                  caseInsensitive: true,
                  order: "asc"
              },
              groups: [
                  "builtin",
                  "external",
                  "index",
                  "sibling",
                  "parent",
                  "internal"
              ]
          }
      ],
      indent: [
          "error",
          2
      ],
      "jsx-quotes": [
          "warn",
          "prefer-single"
      ],
      "max-len": [
          "warn",
          {
              code: 120
          }
      ],
      "no-extra-semi": "off",
      "no-console": "warn",
      "no-duplicate-imports": "warn",
      "no-restricted-imports": [
          "warn",
          {
              paths: [
                  {
                      message: "Please use import foo from 'lodash-es/foo' instead.",
                      name: "lodash"
                  },
                  {
                      message: "Avoid using chain since it is non tree-shakable. Try out flow instead.",
                      name: "lodash-es/chain"
                  },
                  {
                      importNames: ["chain"],
                      message: "Avoid using chain since it is non tree-shakable. Try out flow instead.",
                      name: "lodash-es"
                  },
                  {
                      message: "Please use import foo from 'lodash-es/foo' instead.",
                      name: "lodash-es"
                  }
              ],
              patterns: [
                "lodash/**"
              ]
          }
      ],
      "no-unused-vars": "off",
      quotes: [
          "warn",
          "single"
      ],
      semi: "warn",
      "sort-imports": [
          "warn",
          {
              ignoreCase: false,
              ignoreDeclarationSort: true,
              ignoreMemberSort: false
          }
      ],
      "sort-keys": [
          "warn",
          "asc",
          {
              caseSensitive: true,
              minKeys: 2,
              natural: false
          }
      ]
  },
  settings: {
      react: {
          version: "detect" // Detect react version
      }
  },
  overrides: [
    {
      files: [ "src/**/*.ts?(x)" ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
          ecmaFeatures: {
              jsx: true
          },
          ecmaVersion: 2018,
          sourceType: "module"
      },
      plugins: [
          "@typescript-eslint",
          "jest",
      ],
      // You can add Typescript specific rules here.
      // If you are adding the typescript variant of a rule which is there in the javascript
      // ruleset, disable the JS one.
      rules: {
          "@typescript-eslint/no-array-constructor": "warn",
          "no-array-constructor": "off"
      }
    }
  ]
};