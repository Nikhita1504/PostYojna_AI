import { createBrowserRouter, Form } from "react-router-dom";
import { Navigate } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/dashboard/Dashboard";
import DemographicInsights from "../pages/demographic-insights/DemographicInsights";
import GraphComponent from "../pages/demographic-insights/graphs/GraphComponent";
import Maps from "../pages/demographic-insights/Maps/Maps";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {
                path:"/",
                element:<Dashboard/>
            },
            {
                path:"/demographic-insights",
                element:<DemographicInsights/>,
            
            },
            {
                path:"/demographic-insights/maps",
                element:<Maps/>,
            
            },
            {
                path:'/demographic-insights/maps/graphs',
                element:<GraphComponent/>
            }
        ]

    },



]);

export default router;
