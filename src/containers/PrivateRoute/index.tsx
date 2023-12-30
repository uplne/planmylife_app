import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from '../Header';
import { Container } from '../../components/Container';
import { ContainerContent } from "../../components/ContainerContent";
import { WeekSelector } from "../../components/WeekSelector";
import { DailyQuote } from "../../components/DailyQuote";

import './App.css';

export const PrivateRoute = () => {
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
      </ContainerContent>
    </Container>
    </>
  );
};