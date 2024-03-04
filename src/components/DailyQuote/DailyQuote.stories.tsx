import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DailyQuote } from "./index";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity, refetchOnMount: true } },
});

const meta: Meta<typeof DailyQuote> = {
  title: "Daily Quote",
  component: DailyQuote,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      queryClient.setQueryData(["quote"], () => ({
        content: "It's never too late to be what you might have been.",
        author: "George Eliot",
      }));

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
