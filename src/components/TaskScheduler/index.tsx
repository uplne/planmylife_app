import { useEffect } from "react";
import classnames from "classnames";
import { Menu, Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

import {
  SCHEDULER_TYPE,
  SchedulerTypes,
  SCHEDULER_PERIOD,
  SchedulerPeriodTypes,
  useTaskSchedulerStore,
} from "../../store/TaskScheduler";

import "./TaskScheduler.css";
import { SimpleInput } from "../SimpleInput";

export type ComponentProps = {
  className?: string;
};

export const Scheduler = ({ className = undefined }: ComponentProps) => {
  const classes = classnames("taskscheduler", className);
  const {
    repeatType,
    repeatTimes,
    repeatPeriod,
    resetScheduler,
    setRepeatType,
    setRepeatPeriod,
    setRepeatTimes,
  } = useTaskSchedulerStore();

  const handleMenuClick = async (e: any) => {
    const { key } = e;
    await setRepeatType(Number(key));
  };

  const handleMenuPeriodClick = async (e: any) => {
    const { key } = e;
    await setRepeatPeriod(Number(key));
  };

  const onChangeInput = async (e: React.FormEvent<HTMLInputElement>) => {
    await setRepeatTimes(Number((e.target as HTMLInputElement).value));
  };

  useEffect(() => {
    (async () => {
      await resetScheduler();

      // if (type) {
      //   setRepeatType(Number(type));
      //   setRepeatPeriod(Number(period));
      //   setRepeatTimes(Number(times));
      // }
    })();
  }, []);

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={Object.keys(SCHEDULER_TYPE).map(
        (item) => SCHEDULER_TYPE[Number(item) as keyof SchedulerTypes],
      )}
    />
  );

  const menuPeriod = (
    <Menu
      onClick={handleMenuPeriodClick}
      items={Object.keys(SCHEDULER_PERIOD).map(
        (item) => SCHEDULER_PERIOD[Number(item) as keyof SchedulerPeriodTypes],
      )}
    />
  );

  return (
    <div className={classes}>
      <div className="taskscheduler__container">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button>
            <Space>
              {SCHEDULER_TYPE[Number(repeatType) as keyof SchedulerTypes].label}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        {repeatType === SCHEDULER_TYPE["2"].key && (
          <>
            <SimpleInput
              className="taskscheduler__input"
              value={repeatTimes}
              onChange={onChangeInput}
              type="number"
            />
            <Dropdown overlay={menuPeriod} trigger={["click"]}>
              <Button>
                <Space>
                  {repeatTimes > 1
                    ? SCHEDULER_PERIOD[
                        Number(repeatPeriod) as keyof SchedulerPeriodTypes
                      ].labelPlural
                    : SCHEDULER_PERIOD[
                        Number(repeatPeriod) as keyof SchedulerPeriodTypes
                      ].label}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </>
        )}
      </div>
    </div>
  );
};
