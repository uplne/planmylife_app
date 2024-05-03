import { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

import { SimpleInput } from "../SimpleInput";
import { ProgressType } from "../../store/Goals/api";

type ItemType = {
  label: string;
  key: string;
};

type ComponentProps = {
  onChangeTracker: (value: number) => void;
  selectedTracker?: ProgressType | null;
  onChangeUnits: (value: string | null) => void;
  selectedUnits: string | null;
};

const trackers: ItemType[] = [
  {
    label: "Total number of completed tasks",
    key: String(ProgressType.TASKS_FINISHED),
  },
  {
    label: "Manually updating progress",
    key: String(ProgressType.OWN),
  },
];

console.log(trackers);

export const GoalProgress = ({
  onChangeTracker,
  selectedTracker = ProgressType.TASKS_FINISHED,
  onChangeUnits,
  selectedUnits = null,
}: ComponentProps) => {
  const selectedTrackerItem = trackers.filter(
    (item) => item?.key === String(selectedTracker),
  )[0];
  console.log(selectedTrackerItem, selectedTracker);
  const showValueSelector = selectedTrackerItem.key === trackers[1].key;

  useEffect(() => {
    onChangeTracker(ProgressType.TASKS_FINISHED);
    onChangeUnits(null);
  }, []);

  console.log("selectedUnits: ", selectedUnits);

  return (
    <>
      <Dropdown
        menu={{
          items: trackers,
          selectable: true,
          defaultSelectedKeys: [String(selectedTracker)],
          onClick: (e: any) => onChangeTracker((e as any).key),
        }}
        trigger={["click"]}
        className="flex flex-row justify-between items-center w-full px-2 h-9 text-text hover:text-primary border-[1px] border[black] border-solid rounded-sm"
      >
        <Button>
          {selectedTrackerItem.label}
          <DownOutlined />
        </Button>
      </Dropdown>

      {showValueSelector && (
        <div className="flex flex-row items-center mt-6">
          <label htmlFor="units" className="mr-10 text-sm font-medium">
            Units
          </label>
          <SimpleInput
            id="units"
            value={selectedUnits || ""}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              onChangeUnits((e.target as HTMLInputElement).value)
            }
            placeholder="steps"
          />
        </div>
      )}
    </>
  );
};
