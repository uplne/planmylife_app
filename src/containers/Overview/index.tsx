import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from '../../components/Container';
import { ContainerContent } from "../../components/ContainerContent";
import { WeekSelector } from "../../components/WeekSelector";
import { DailyQuote } from "../../components/DailyQuote";
import { Tasks } from '../../components/Tasks';
import { WeeklyGoals } from "../../components/WeeklyGoals";

import './Overview.css';

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

        <div className="container-content__split">
          <div className="overview__split">
            <Tasks />
          </div>

          <div className="overview__split">
            <WeeklyGoals />
          </div>
        </div>
      </ContainerContent>
    </Container>
    </>
  );
};