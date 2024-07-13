import { useEffect, useState } from "react";
import { Select, DatePicker } from "antd";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);

import { Day } from "./Day";

import {
  SchedulerTypeKey,
  SCHEDULER_TYPE,
  SCHEDULER_OPTIONS,
  SchedulerPeriodKey,
  SchedulerOptions,
  DAYS,
} from "../../store/HabitScheduler";
import { useGoalsStore } from "../../store/Goals";
import { useHabitSchedulerStore } from "../../store/HabitScheduler";
import { H3 } from "../../components/Headlines/H3";
import type { ComponentProps } from "../Goal/AddHabit";

export const Scheduler = ({ data }: ComponentProps) => {
  const setTempGoalByKey = useGoalsStore().setTempGoalByKey;
  const tempGoal = useGoalsStore().tempGoal;
  const daysFiltered = Object.keys(DAYS).filter((item) => !isNaN(Number(item)));
  const allDaysArray = daysFiltered.map((_, index) => index);
  const allWorkingDaysArray = daysFiltered
    .map((_, index) => index)
    .slice(0, -2);

  const setRepeatType = useHabitSchedulerStore().setHabitRepeatType;
  const repeatType = useHabitSchedulerStore().habitRepeatType;
  const setRepeatPeriod = useHabitSchedulerStore().setHabitRepeatPeriod;
  const repeatPeriod = useHabitSchedulerStore().habitRepeatPeriod;
  const setRepeatTimes = useHabitSchedulerStore().setHabitRepeatTimes;
  const repeatTimes = useHabitSchedulerStore().habitRepeatTimes;
  const setRepeatDays = useHabitSchedulerStore().setHabitRepeatDays;
  const repeatDays = useHabitSchedulerStore().habitRepeatDays;

  const dataHandler = (key: string, value: any) => setTempGoalByKey(key, value);

  useEffect(() => {
    let daysToPrefill = [...allDaysArray];

    if (data?.habitRepeatDays) {
      daysToPrefill = [...data.habitRepeatDays];
    }

    if (data?.habitRepeatType) {
      setRepeatType(data?.habitRepeatType);
    }

    if (data?.habitRepeatTimes) {
      setRepeatTimes(data?.habitRepeatTimes);
    }

    dataHandler("assigned", dayjs().format());

    setRepeatDays(new Set([...daysToPrefill]));
  }, []);

  const handleRepatStyleChange = (value: SchedulerTypeKey) => {
    if (value === SchedulerTypeKey.AtLeast) {
      setRepeatDays(new Set([]));
    }

    setRepeatType(value);
  };

  const handleRepatTypeChange = (value: SchedulerPeriodKey) => {
    let newSet: Set<number>;

    switch (value) {
      case SchedulerPeriodKey.Day:
        {
          newSet = new Set([...allDaysArray]);
        }
        break;
      case SchedulerPeriodKey.WorkingDay:
        {
          newSet = new Set([...allWorkingDaysArray]);
        }
        break;
      case SchedulerPeriodKey.SelectedDay:
        {
          newSet = new Set([]);
        }
        break;
    }

    setRepeatPeriod(value);
    setRepeatDays(newSet);
  };

  const daySelectionHandler = (value: number) => {
    const newSet: Set<number> = new Set(repeatDays);

    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }

    setRepeatDays(newSet);
  };

  const handleRepeatTimesChange = (value: number) => {
    setRepeatTimes(value);
  };

  const renderPeriodSelect = () => (
    <Select
      defaultValue={SchedulerPeriodKey.Day}
      style={{ width: 130 }}
      onChange={handleRepatTypeChange}
      options={Object.keys(SCHEDULER_OPTIONS).map((key) => ({
        value: SCHEDULER_OPTIONS[key as unknown as keyof SchedulerOptions].key,
        label:
          SCHEDULER_OPTIONS[key as unknown as keyof SchedulerOptions].title,
      }))}
    />
  );

  const renderAtLeastSelect = () => {
    const label = repeatTimes > 1 ? "times a week" : "time a week";

    return (
      <>
        <Select
          className="mr-10"
          defaultValue={repeatTimes}
          style={{ width: 55 }}
          onChange={handleRepeatTimesChange}
          options={[...Array(7).keys()].map((i) => ({
            value: i + 1,
            label: i + 1,
          }))}
        />
        {label}
      </>
    );
  };

  const disableDayClicks =
    repeatPeriod === SchedulerPeriodKey.Day ||
    repeatPeriod === SchedulerPeriodKey.WorkingDay;

  return (
    <>
      <H3>Create habit rule</H3>
      <div className="mb-15">
        <Select
          className="mr-10"
          defaultValue={repeatType}
          style={{ width: 120 }}
          onChange={handleRepatStyleChange}
          options={SCHEDULER_TYPE.map((item) => ({
            value: item.key,
            label: item.title,
          }))}
        />
        {repeatType === SchedulerTypeKey.Every && renderPeriodSelect()}
        {repeatType === SchedulerTypeKey.AtLeast && renderAtLeastSelect()}
      </div>
      {repeatType !== SchedulerTypeKey.AtLeast && (
        <>
          <H3>On which days do you want to do this?</H3>
          <div className="flex flex-row justify-between w-full mb-15">
            {Object.keys(DAYS)
              .filter((item) => isNaN(Number(item)))
              .map((item: string) => (
                <Day
                  key={item}
                  label={item}
                  isSelected={repeatDays.has(DAYS[item as keyof typeof DAYS])}
                  onClick={daySelectionHandler}
                  disabled={disableDayClicks}
                />
              ))}
          </div>
          <H3>Start habit from week</H3>
          <div className="flex flex-row justify-between w-1/2 mb-15">
            <DatePicker
              className="w-full py-[7px]"
              onChange={(date) => dataHandler("assigned", date)}
              placeholder="Success Date"
              value={
                tempGoal.assigned !== null ? dayjs(tempGoal.assigned) : null
              }
              picker="week"
            />
          </div>
        </>
      )}
    </>
  );
};
