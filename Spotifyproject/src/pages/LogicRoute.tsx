import React, { useContext } from "react";
import { Redirect } from "react-router";
import { AuthContext } from "../context/ContextProvider";
import { AuthContextType } from "../context/ContextProvider";

const LogicRoute: React.FC = () => {
  const authContext = useContext(AuthContext) as AuthContextType;
  const { auth } = authContext;

  return auth ? <Redirect to="/tab1" /> : <Redirect to="/login" />;
};

export default LogicRoute;
