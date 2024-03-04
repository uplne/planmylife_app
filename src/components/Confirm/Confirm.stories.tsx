import type { Meta, StoryObj } from "@storybook/react";

import { Confirm } from "./index";
import { useConfirmStore } from "../../store/Confirm";

const meta: Meta<typeof Confirm> = {
  title: "Confirm",
  component: Confirm,
  tags: ["autodocs"],
  argTypes: { onClick: { action: "clicked" } },
  decorators: [
    (Story) => {
      useConfirmStore.getState().openConfirm({
        title: "Are you sure you want to delete task?",
        onConfirm: async () => {
          console.log("Clicked Confirm");
        },
      });

      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
