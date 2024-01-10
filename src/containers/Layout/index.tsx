import { Outlet } from "react-router-dom";

import { Header } from '../Header';
import { Modal } from '../../components/Modal';
import { Confirm } from '../../components/Confirm';

import './Layout.css';

export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Modal />
      <Confirm />
    </>
  );
};