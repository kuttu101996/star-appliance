import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

const HomeTopLeftSide = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  return (
    <div className="mt-3 flex flex-col md:flex-row lg:flex-row">
      <div className="home-org-logo me-3 mt-3 d-inline-flex bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 466.62 512"
          className="icon icon-lg fill-grey-shaded align-center"
        >
          <path d="M407.33 207.07l-38.52-11.21V85.74c0-47.27-38.32-85.73-85.42-85.73H85.42C38.32 0 0 38.46 0 85.73V441.7c0 38.76 31.42 70.29 70.05 70.29h326.52c38.63 0 70.05-31.43 70.05-70.05V286.07c0-17.95-5.7-35.03-16.47-49.39s-25.58-24.6-42.82-29.62zM40 441.71V85.73C40 60.51 60.37 40 85.42 40H283.4c25.04 0 45.42 20.52 45.42 45.73v98.48L269.69 167c-25.09-7.3-51.48-2.5-72.38 13.19s-32.89 39.67-32.89 65.81v225.99H70.07c-16.57 0-30.05-13.59-30.05-30.29zm386.62.24c0 16.57-13.48 30.05-30.05 30.05h-61.06v-54.52c0-11.05-8.95-20-20-20s-20 8.95-20 20V472H204.4V246.01c0-13.43 6.16-25.76 16.9-33.82 10.74-8.06 24.3-10.53 37.19-6.78l137.65 40.06c17.94 5.22 30.47 21.92 30.47 40.6v155.87z"></path>
        </svg>
      </div>
      <div>
        <div className="text-xs md:text-lg lg:text-lg text-medium mt-3 text-[#63677a]">
          Hello,{" "}
          {user?.displayName?.charAt(0).toUpperCase() +
            user?.displayName?.slice(1).toLowerCase() || ""}
        </div>
        <div className="text-[#6c7184] text-xs mt-1">{user?.userType}</div>
      </div>
    </div>
  );
};

export default HomeTopLeftSide;
