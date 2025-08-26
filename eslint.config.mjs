import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "prettier", "next/typescript"),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    plugins: ["@typescript-eslint", "react"],
    rules: {
      // TS & React 규칙
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-array-index-key": "warn",
      "react/jsx-props-no-spreading": "off",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],

      // import
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"], // Node.js 내장 모듈 + 외부 패키지
            ["internal", "type"], // 내부 모듈(@/components, @/utils 등) + 타입
            ["parent", "sibling", "index"], // 상위, 같은 폴더, 인덱스
          ],
          pathGroups: [
            {
              pattern: "@/components/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/hooks/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/utils/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/types/**",
              group: "type",
              position: "after",
            },
            {
              pattern: "@/states/**",
              group: "type",
              position: "after",
            },
          ],
          "newlines-between": "always", // 그룹 사이 한 줄 띄우기
          alphabetize: {
            order: "asc", // 그룹 내부 알파벳 순
            caseInsensitive: true,
          },
        },
      ],

      // Prettier 연동
      "prettier/prettier": ["error", { singleQuote: true, semi: true, trailingComma: "all" }],
    },
  },
];

export default eslintConfig;
