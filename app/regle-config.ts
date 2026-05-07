import { defineRegleConfig } from '@regle/core';
import { defineRegleNuxtPlugin } from '@regle/nuxt/setup';
import { required, withMessage } from '@regle/rules';

export default defineRegleNuxtPlugin(() => {
  return defineRegleConfig({
    rules: () => {
      return {
        required: withMessage(required, 'Das Feld wird benötigt.'),
      };
    },
  });
});
