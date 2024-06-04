import { DatePicker } from "antd";
import dayjs from "dayjs";

import { SimpleInput } from "../../../../components/SimpleInput";
import { ModalRow } from "../ModalRow";
import { ModalSplit } from "../ModalSplit";
import { H3 } from "../../../../components/Headlines/H3";
import { useGoalsStore } from "../../../../store/Goals";
import { GoalProgress } from "../../../../components/GoalProgress";

export const SMARTGoal = () => {
  const setTempGoalByKey = useGoalsStore().setTempGoalByKey;
  const tempGoal = useGoalsStore().tempGoal;

  const dataHandler = (key: string, value: any) => setTempGoalByKey(key, value);

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
          <div className="w-1/2">
            <H3>I will achieve this goal by</H3>
            <DatePicker
              className="w-full py-[7px]"
              onChange={(date) => dataHandler("endDate", date)}
              placeholder="Success Date"
              value={dayjs(tempGoal?.endDate)}
              format="DD/MM/YYYY"
            />
          </div>
        </ModalSplit>
      </ModalRow>

      <ModalRow>
        <H3>Track progress</H3>
        <GoalProgress
          onChangeTracker={(value: number) =>
            dataHandler("progressType", Number(value))
          }
          selectedTracker={tempGoal?.progressType}
          onChangeUnits={(value: string | null) =>
            dataHandler("progressOwnUnits", value)
          }
          selectedUnits={tempGoal?.progressOwnUnits || null}
        />
      </ModalRow>
    </>
  );
};
