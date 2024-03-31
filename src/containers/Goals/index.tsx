import { Container } from "../../components/Container";
import { ContainerContent } from "../../components/ContainerContent";
import { Title } from "../../components/Title";
import { PlusIcon } from "../../components/Icons/PlusIcon";
import { BasicButton } from "../../components/Buttons/BasicButton";

export const Goals = () => {
  return (
    <>
      <Container>
        <ContainerContent>
          <Title title="Goals" />
          <div>
            <BasicButton className="flex grow-0" onClick={() => {}} withIcon>
              <PlusIcon />
              Add Goal
            </BasicButton>
          </div>
        </ContainerContent>
      </Container>
    </>
  );
};
