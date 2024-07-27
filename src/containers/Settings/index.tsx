import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { ContainerContent } from "../../components/ContainerContent";
import { Split } from "../../components/Split";
import { Reset } from "../../components/Reset";

export const Settings = () => {
  return (
    <>
      <Container>
        <ContainerContent>
          <Title title="Settings" />
          <div className="flex flex-col md:flex-row justify-between items-start">
            <Split>
              <Reset />
            </Split>
          </div>
        </ContainerContent>
      </Container>
    </>
  );
};
