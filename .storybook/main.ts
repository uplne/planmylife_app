import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "storybook-addon-react-router-v6",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  previewHead: (head) => `
    ${head}
    <style>
      html, body {
        font-family: "Rubik", system-ui, sans-serif;
        font-size: 16px;
        height: 100%;
        min-height: 100%;
      }
    </style>
 `,
};
export default config;
