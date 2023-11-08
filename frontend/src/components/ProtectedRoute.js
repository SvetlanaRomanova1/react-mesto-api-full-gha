import React from "react";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({element: Element, ...props}) => {
    return (
        props.isAuthenticated ? <Element {...props}/> : <Navigate to="/sign-in" replace/>
    )
}

export default ProtectedRoute
