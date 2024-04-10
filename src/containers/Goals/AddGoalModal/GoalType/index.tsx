import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";

type ComponentProps = {
  onChange: (e: RadioChangeEvent) => void;
  value: number;
};

export enum GoalTypeType {
  "SMART",
  "OKRs",
}

export const GoalType = ({ onChange, value }: ComponentProps) => (
  <Radio.Group onChange={onChange} value={value}>
    <Radio value={GoalTypeType.SMART}>S.M.A.R.T</Radio>
    <Radio value={GoalTypeType.OKRs}>OKRs</Radio>
  </Radio.Group>
);
