import { DatePicker } from "antd";

import { SimpleInput } from "../../../../components/SimpleInput";
import { ModalRow } from "../ModalRow";
import { ModalSplit } from "../ModalSplit";
import { H3 } from "../../../../components/Headlines/H3";
import { useGoalsStore } from "../../../../store/Goals";

type ComponentProps = {
  value: number;
};

export const SMARTGoal = ({ value }: ComponentProps) => {
  const setTempGoal = useGoalsStore().setTempGoal;
  const tempGoal = useGoalsStore().tempGoal;

  const dataHandler = (key: string, value: any) => setTempGoal(key, value);

  return (
    <>
      <ModalRow>
        <H3>Objective</H3>
        <SimpleInput
          value={tempGoal?.objective}
          onChange={(e) => dataHandler("objective", e.target.value)}
          placeholder="Objective"
        />
      </ModalRow>

      <ModalRow>
        <H3>Why?</H3>
        <SimpleInput
          value={tempGoal?.why}
          onChange={(e) => dataHandler("why", e.target.value)}
          placeholder="Why is this goal important to me?"
        />
      </ModalRow>

      <ModalRow>
        <ModalSplit>
          <div className="w-1/2 mr-1">
            <H3>Start Date</H3>
            <DatePicker
              className="w-full py-[7px]"
              onChange={(date) => dataHandler("startDate", date)}
              placeholder="Start Date"
              value={tempGoal?.startDate}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="w-1/2 ml-1">
            <H3>End Date</H3>
            <DatePicker
              className="w-full py-[7px]"
              onChange={(date) => dataHandler("endDate", date)}
              placeholder="End Date"
              value={tempGoal?.endDate}
              format="DD/MM/YYYY"
            />
          </div>
        </ModalSplit>
      </ModalRow>
    </>
  );
};
