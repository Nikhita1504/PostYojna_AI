
import {
    createBrowserRouter,
    Router,
    RouterProvider,
} from "react-router-dom";

import Landing from "../Landing";


const router=createBrowserRouter([
    {
        path:"/",
        element:<Landing/>,
        // children:[
        //     {
        //         path:'/about',
        //         element:<About/>

        //     }
        // ]
    },


])
export default router;