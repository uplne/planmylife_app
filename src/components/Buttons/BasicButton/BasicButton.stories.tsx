import type { Meta, StoryObj } from "@storybook/react";

import { BasicButton } from "./index";
import { BinIcon } from "../../Icons";

const meta: Meta<typeof BasicButton> = {
  title: "Buttons/BasicButton",
  component: BasicButton,
  tags: ["autodocs"],
  argTypes: {
    children: ["Text"],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    secondary: true,
    children: "Button",
  },
};

export const Ternary: Story = {
  args: {
    ternary: true,
    children: "Button",
  },
};

export const WithIcon: Story = {
  args: {
    withIcon: true,
    children: (
      <>
        <BinIcon /> Button
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Button",
  },
};
