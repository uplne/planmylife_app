import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";

import { GoalType as GoalTypeType } from "../../../../store/Goals/api";

type ComponentProps = {
  onChange: (e: RadioChangeEvent) => void;
  value: GoalTypeType;
};

export const GoalType = ({ onChange, value }: ComponentProps) => (
  <Radio.Group onChange={onChange} value={value}>
    <Radio value={GoalTypeType.SMART}>S.M.A.R.T</Radio>
    <Radio value={GoalTypeType.OKR}>OKRs</Radio>
  </Radio.Group>
);
