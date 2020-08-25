module.exports = {
  env: {
    browser: true,
    es2020: true,
    webextensions: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "react-app"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
  },
  globals: {
    chrome: true,
  },
};
