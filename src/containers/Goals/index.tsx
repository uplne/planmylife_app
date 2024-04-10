import { Container } from "../../components/Container";
import { ContainerContent } from "../../components/ContainerContent";
import { Title } from "../../components/Title";
import { PlusIcon } from "../../components/Icons/PlusIcon";
import { BasicButton } from "../../components/Buttons/BasicButton";
import { AddGoalModal } from "./AddGoalModal";

import { useModalStore } from "../../store/Modal";

export const Goals = () => {
  const { toggleModal } = useModalStore();

  const openModal = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await toggleModal({
      isOpen: true,
      content: <AddGoalModal />,
      title: "Add Goal",
      onSave: () => {},
      disableAutoClose: true,
    });
  };

  return (
    <>
      <Container>
        <ContainerContent>
          <Title title="Goals" />
          <div>
            <BasicButton className="flex grow-0" onClick={openModal} withIcon>
              <PlusIcon />
              Add Goal
            </BasicButton>
          </div>
        </ContainerContent>
      </Container>
    </>
  );
};
