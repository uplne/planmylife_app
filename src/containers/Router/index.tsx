import { redirect } from "react-router-dom";

import { Overview } from "../Overview";
import { Login } from "../Login";
import { LogOut } from "../LogOut";
import { Layout } from "../Layout";
import { Goals } from "../Goals";
import { Settings } from "../Settings";
import { parseUrlParameters, parseUrlPathname } from "../../services/parseurl";
import { useAuthStore } from "../../store/Auth";
import { useWeekStore } from "../../store/Week";

export const Router = [
  {
    path: "/",
    async loader() {
      if (!useAuthStore.getState().isLoggedIn) {
        const { week } = parseUrlParameters();
        const pathname = parseUrlPathname();
        let redirectPath = `/login?week=${week}`;

        if (!week) {
          const selectedWeekId = useWeekStore.getState().selectedWeekId;

          if (
            pathname !== "/myweek" &&
            pathname !== "/login" &&
            pathname !== "/create" &&
            pathname !== "/setup"
          ) {
            redirectPath = `/login?page=mygoals`;
          } else {
            redirectPath = `/login?week=${selectedWeekId}`;
          }
        }

        return redirect(redirectPath);
      }

      return null;
    },
    Component: Layout,
    children: [
      {
        path: "myweek",
        Component: Overview,
      },
      {
        path: "mygoals",
        Component: Goals,
      },
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
  {
    path: "logout",
    Component: LogOut,
  },
  {
    path: "login",
    Component: Login,
  },
];
