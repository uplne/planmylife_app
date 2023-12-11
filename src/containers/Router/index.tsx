import {
  redirect,
} from "react-router-dom";

import { PrivateRoute } from '../PrivateRoute';
import { Login } from '../Login';

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
    path: "/login",
    element: <Login />
  },
  {
    path: "/myweek",
    element: <PrivateRoute />,
  },
  {
    path: "/",
    async loader() {
      return redirect("/login");
    },
  },
]
