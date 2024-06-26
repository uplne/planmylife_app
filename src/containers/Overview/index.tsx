import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "../../components/Container";
import { ContainerContent } from "../../components/ContainerContent";
import { WeekSelector } from "../../components/WeekSelector";
import { DailyQuote } from "../../components/DailyQuote";
import { Tasks } from "../../components/Tasks";
import { WeeklyGoals } from "../../components/WeeklyGoals";
import { Split } from "./Split";

export const Overview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // navigate("/login");
  }, []);

  return (
    <>
      <Container>
        <ContainerContent>
          <div className="container-content__split container-content__split--top overview__header">
            <WeekSelector />
            <DailyQuote />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start">
            <Split>
              <Tasks />
            </Split>

            <Split>
              <WeeklyGoals />
            </Split>
          </div>
        </ContainerContent>
      </Container>
    </>
  );
};
