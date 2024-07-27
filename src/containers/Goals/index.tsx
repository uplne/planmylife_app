import { useQuery } from "@tanstack/react-query";

import { Container } from "../../components/Container";
import { ContainerContent } from "../../components/ContainerContent";
import { Title } from "../../components/Title";
import { PlusIcon } from "../../components/Icons/PlusIcon";
import { IconButton } from "../../components/Buttons/IconButton";
import { AddGoalModal } from "./AddGoalModal";
import { Goal } from "../../components/Goal";

import { useModalStore } from "../../store/Modal";
import { useGoalsStore } from "../../store/Goals";
import {
  fetchActiveGoals,
  fetchCompletedGoals,
  saveGoal,
} from "./goals.controller";
import { useFetchCategories } from "../../components/Categories";
import { useGetActiveGoals } from "./hooks/useGetActiveGoals";
import { useGetCompletedGoals } from "./hooks/useGetCompletedGoals";

export const useFetchActiveGoalsData = () =>
  useQuery({
    queryKey: ["goals", "active"],
    queryFn: fetchActiveGoals,
    staleTime: 86400000, // set to 1 day
  });

export const useFetchCompletedGoalsData = () =>
  useQuery({
    queryKey: ["goals", "completed"],
    queryFn: fetchCompletedGoals,
    staleTime: 86400000, // set to 1 day
  });

export const Goals = () => {
  const { toggleModal } = useModalStore();
  const resetTempGoal = useGoalsStore().resetTempGoal;
  const activeGoals = useGetActiveGoals();
  const completedGoals = useGetCompletedGoals();

  useFetchActiveGoalsData();
  useFetchCompletedGoalsData();
  useFetchCategories();

  const openModal = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await resetTempGoal();

    await toggleModal({
      isOpen: true,
      content: <AddGoalModal />,
      title: "Add Goal",
      saveDisabled: false,
      onSave: saveGoal,
      disableAutoClose: true,
    });
  };

  return (
    <>
      <Container>
        <ContainerContent>
          <Title title="Goals" />
          <div>
            <IconButton onClick={openModal} secondary withCTA>
              <PlusIcon />
              Add goal
            </IconButton>
          </div>
          <div className="mt-20">
            {activeGoals.map((goal) => {
              return <Goal data={goal} />;
            })}
          </div>
          {completedGoals.length > 0 && (
            <>
              <h3 className="tasks__subtitle">Completed</h3>
              {completedGoals.map((goal) => {
                return <Goal data={goal} />;
              })}
            </>
          )}
        </ContainerContent>
      </Container>
    </>
  );
};
