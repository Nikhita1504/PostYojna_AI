import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import Signup from "../components/Signup";
import AddScheme from "../components/AddScheme";
import Addlocation from "../components/Addlocation";
import Accounts from "../components/Accounts";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      {
        path: "/AddScheme",
        element: <AddScheme></AddScheme>,

      },
      {
        path: "/AddLocation",
        element: <Addlocation></Addlocation>,

      },
      {
        path: "/AccountData",
        element: <Accounts></Accounts>,

      },
    ]
  }]
);

export default router;
