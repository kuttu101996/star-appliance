// import Unauthorize from "@/Unauthorize";
import { useEffect } from "react";

const InventoryProtection = ({ children }: { children: JSX.Element }) => {
  // const [authorized, setAuthorized] = useState<boolean>(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    // console.log(user);
    // console.log(user.userType);
    // for specific routes we can check if userType is not these two and check for any route which should not be accessable by any other userType then redirect them to /not-authorize
    if (user.userType === "OFFICE" || user.userType === "ADMIN") {
      // setAuthorized(true);/
    } else {
      window.location.href = "/not-authorize";
    }
  }, [user]);

  // if (authorized === false) {
  //   return (window.location.href = "/not-authorize");
  //   // (window.location.href = "/not-authorize");
  // }

  // While unauthorized, render nothing (toast is displayed in the background, and redirect happens)
  return children;
};

export default InventoryProtection;
