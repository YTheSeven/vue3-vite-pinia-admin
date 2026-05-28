import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import oxlint from 'eslint-plugin-oxlint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'), // 让 ESlint 跳过 Oxlint 已覆盖的规则
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
    },
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
]);
