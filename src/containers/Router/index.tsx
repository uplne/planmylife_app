import { redirect } from "react-router-dom";

import { Overview } from "../Overview";
import { Login } from "../Login";
import { LogOut } from "../LogOut";
import { Layout } from "../Layout";
import { Goals } from "../Goals";
import { parseUrlParameters, parseUrlPathname } from "../../services/parseurl";
import { useAuthStore } from "../../store/Auth";
import { useWeekStore } from "../../store/Week";

// export default ({...props}) =>
//   <Switch>
//     <Route exact path="/login" component={Login} />
//     <Route exact path="/logout" component={LogOut} />
//     <Route exact path="/create" component={CreateAccount} />
//     <Route exact path="/unsubscribe" component={Unsubscribe} />
//     <PrivateRoute path="/setup" component={Setup} {...props} />
//     <PrivateRoute path="/myweek" component={Overview} {...props} />
//     <PrivateRoute exact path="/mygoals/:year" component={Goals} {...props} />
//     <PrivateRoute exact path="/weekly-review" component={WeeklyReview} {...props} />
//     <PrivateRoute exact path="/trends/:year" component={Statistics} {...props} />
//     <PrivateRoute path="/archive" component={Archive} {...props} />
//     <PrivateRoute path="/settings" component={Settings} {...props} />
//     <Redirect path="/" to="/login" />
//   </Switch>;

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
