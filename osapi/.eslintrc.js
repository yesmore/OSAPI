module.exports = {
  extends: [
    "plugin:vue/vue3-recommended",
    "prettier",
    "prettier/vue",
  ],
  rules: {
    'vue/no-unused-vars': 'error',
    "vue/no-multiple-template-root": "off",
  },
};
