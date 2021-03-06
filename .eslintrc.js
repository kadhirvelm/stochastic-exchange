module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json", "./packages/*/tsconfig.json", "./packages/puzzles/*/tsconfig.json"],
      extraFileExtensions: [".cjs"]
    },

    plugins: [
      "@typescript-eslint",
      "jest",
      "prettier",
      "import",
      "react-hooks"
    ],

    extends: [
      "airbnb-typescript",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "prettier/@typescript-eslint",
      "prettier/react",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "prettier/@typescript-eslint",
      "plugin:jest/recommended",
      "plugin:prettier/recommended"
    ],

    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/quotes": ["error", "double"],
      "@typescript-eslint/no-misused-promises": 0,
      "import/prefer-default-export": 0,
      "comma-dangle": 0,
      "react/state-in-constructor": 0,
      "react/sort-comp": 0,
      "implicit-arrow-linebreak": 0,
      "arrow-parens": 0,
      "class-methods-use-this": 0,
      "no-async-promise-executor": 0,
      "jsx-a11y/click-events-have-key-events": 0,
      "jsx-a11y/no-static-element-interactions": 0,
      "function-paren-newline": 0,
      "@typescript-eslint/unbound-method": 0,
      "object-curly-newline": 0,
      "react/no-did-update-set-state": 0,
      "operator-linebreak": 0,
      "react/jsx-props-no-spreading": 0,
      "no-console": 2,
      "lines-between-class-members": 0,
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "_" }],
      "react/prop-types": 0,
      "import/namespace": 0,
      "@typescript-eslint/no-floating-promises": 0,
      "@typescript-eslint/no-unsafe-assignment": 0,
      "@typescript-eslint/no-unsafe-member-access": 0,
      "@typescript-eslint/no-unsafe-return": 0,
      "@typescript-eslint/no-unsafe-call": 0,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
        }
      }
    }
};