import { Outlet } from "react-router-dom";

import { Header } from '../Header';
import { Modal } from '../../components/Modal';
import { Confirm } from '../../components/Confirm';
import { NotificationContainer } from '../../components/Notification';

export const Layout = () => {
  return (
    <main className="bg-main-background h-full">
      <Header />
      <Outlet />
      <Modal />
      <Confirm />
      <NotificationContainer />
    </main>
  );
};