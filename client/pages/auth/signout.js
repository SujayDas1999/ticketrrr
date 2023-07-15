import { useEffect } from "react";
import userequest from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const { doRequest, errors } = userequest({
    url: "/api/users/signout",
    body: {},
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default Signout;
