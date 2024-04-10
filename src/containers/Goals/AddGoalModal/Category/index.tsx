import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  {
    label: "Finance",
    key: "finance",
  },
  {
    label: "Health",
    key: "health",
  },
  {
    type: "divider",
  },
  {
    label: "Add New Category",
    key: "new",
  },
];
export const Category = () => {
  return (
    <Dropdown
      menu={{
        items,
        onClick: (e: MenuProps["onClick"]) => console.log(e),
      }}
      trigger={["click"]}
      className="px-2 h-9 text-text hover:text-primary border-[1px] border[black] border-solid rounded-sm"
    >
      <Button>
        Category
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
