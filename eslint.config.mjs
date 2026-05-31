import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { tailwindcss: tailwind },
    settings: {
      tailwindcss: {
        config: "app/globals.css",
      },
    },
    rules: {
      "tailwindcss/enforces-shorthand": "warn",
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/entities/**", "@/features/**", "@/widgets/**"],
              message:
                "shared 레이어는 entities, features, widgets를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**", "@/widgets/**"],
              message:
                "entities 레이어는 features, widgets를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/widgets/**"],
              message: "features 레이어는 widgets를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
