import { createBrowserRouter, Form } from "react-router-dom";
import { Navigate } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/dashboard/Dashboard";
import DemographicInsights from "../pages/demographic-insights/DemographicInsights";
import GraphComponent from "../pages/demographic-insights/graphs/GraphComponent";
import Maps from "../pages/demographic-insights/Maps/Maps";
import Recommendations from "../pages/recommendations/Recommendations";
import Calendar from "../pages/calender/Calendar";
import Voiceinput from "../pages/Feedback/Voiceinput";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/demographic-insights",
                element: <DemographicInsights />,

            },
            {
                path: "/demographic-insights/maps",
                element: <Maps />,

            },
            {
                path: '/demographic-insights/maps/graphs',
                element: <GraphComponent />
            },
            {
                path: '/calendar',
                element: <Calendar />
            }, 
            {
                path:"/recommendations",
                element:<Recommendations/>

        },{
  path:'/Feedback',
  element:<Voiceinput></Voiceinput>
        },

          
        ]

    },



]);

export default router;
