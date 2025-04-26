import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import "./UserProfile.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  //   DropdownMenuLabel,
  //   DropdownMenuPortal,
  //   DropdownMenuSeparator,
  //   DropdownMenuSub,
  //   DropdownMenuSubContent,
  //   DropdownMenuSubTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Camera, Maximize, Trash2, Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Gender } from "../../../../types/enumTypes";

const UserProfile = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const [user, setUser] = useState(
    useSelector((state: RootState) => state.auth.user)
  );
  const [notEditable, setNotEditable] = useState<boolean>(true);

  const [startReset, setStartReset] = useState<boolean>(false);
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [confirmNewPass, setConfirmNewPass] = useState<string>("");

  if (!user) return <div>No user data available</div>;

  return (
    <div className="hide-scroll-bar overflow-y-auto h-full">
      <h1 className="text-3xl">Profile</h1>
      {/* bg-[#f7f7fe]  */}
      <div className="p-8 bg-[#E9EAED] rounded-sm">
        <div>
          {notEditable ? (
            <button
              onClick={() => setNotEditable(false)}
              className="float-right relative m-0 min-w-20 max-w-20 h-10 bg-[#10bc83] text-[#fff] font-semibold rounded cursor-pointer text-sm text-center w-[-webkit-fit-content]"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => setNotEditable(true)}
              className="float-right relative m-0 min-w-20 max-w-20 h-10 bg-[#ffffff] text-[#2a2a2add] font-semibold rounded cursor-pointer text-sm text-center w-[-webkit-fit-content]"
            >
              Cancel
            </button>
          )}

          <div className="relative flex">
            <div className="w-16 h-16">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="h-16 w-16 relative rounded-[50%] cursor-pointer box-border overflow-hidden bg-[#f7f7f7] bg-cover">
                    <div
                      className="dp_pic_blur_bg __web-inspector-hide-shortcut__"
                      //   style='background-image: url("https://contacts.zoho.in/file?fs=thumb&amp;ID=60027035740&amp;nps=404");'
                    >
                      {/* <img onload="setPhotoSize(this)" id="dp_pic" draggable="false" onerror="handleDpOption(this)" src="https://contacts.zoho.in/file?fs=thumb&amp;ID=60027035740&amp;nps=404" style="width: 100%; height: 100%;"> */}
                      <label id="file_lab">
                        <img
                          id="dp_pic"
                          draggable="false"
                          //   src={user?.profilePic}
                          src="https://contacts.zoho.in/file?fs=thumb&amp;ID=60027035740&amp;nps=404"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </label>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Camera width={24} height={24} className="text-white" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 text-xs">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Upload New
                      <DropdownMenuShortcut>
                        <Upload width={16} strokeWidth={1.5} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      View Full
                      <DropdownMenuShortcut>
                        <Maximize width={16} strokeWidth={1.5} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Delete
                      <DropdownMenuShortcut>
                        <Trash2 width={16} strokeWidth={1.5} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="ml-5">
              <div className="text-3xl">
                {user?.displayName || user?.displayName}
              </div>
              <div className="text-base">{user?.email}</div>
            </div>
            {/* <div></div> */}
          </div>

          <div className="flex flex-wrap outline-none overflow-hidden relative max-w-[1300px]">
            {/* Full Name */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Full Name
              <input
                type="text"
                value={user.displayName || user.displayName || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (user.employee) {
                    setUser({
                      ...user,
                      employee: {
                        ...user.employee,
                        name: e.target.value, // Update Employee name
                      },
                    });
                  } else if (user.customer) {
                    setUser({
                      ...user,
                      customer: {
                        ...user.customer,
                        name: e.target.value, // Update Customer name
                      },
                    });
                  }
                }}
                disabled={notEditable}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* Display name */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Display Name
              <input
                type="text"
                value={user.displayName || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUser({ ...user, displayName: e.target.value });
                }}
                disabled={notEditable}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* Email */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Email
              <input
                type="text"
                value={user.email || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUser({ ...user, email: e.target.value });
                }}
                disabled={notEditable}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* Gender */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Gender
              <input
                type="text"
                value={
                  user.customer?.gender ||
                  user.employee?.gender ||
                  "Not Provided"
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (user.employee) {
                    setUser({
                      ...user,
                      employee: {
                        ...user.employee,
                        gender: e.target.value as Gender, // Update Employee name
                      },
                    });
                  } else if (user.customer) {
                    setUser({
                      ...user,
                      customer: {
                        ...user.customer,
                        gender: e.target.value, // Update Customer name
                      },
                    });
                  }
                }}
                disabled={notEditable}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* DOB */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Date of Birth
              <input
                type="date"
                value={
                  `${user.customer?.dob || ""}` ||
                  `${user.employee?.dob || ""}` ||
                  ""
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (user.employee) {
                    setUser({
                      ...user,
                      employee: {
                        ...user.employee,
                        dob: e.target.value, // Update Employee name
                      },
                    });
                  } else if (user.customer) {
                    setUser({
                      ...user,
                      customer: {
                        ...user.customer,
                        gender: e.target.value, // Update Customer name
                      },
                    });
                  }
                }}
                disabled={notEditable}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* Mobile */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Mobile
              <input
                type="text"
                value={`+91 ${user.mobile || ""}`}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newValue = e.target.value;

                  if (/^[0-9]*$/.test(newValue) && newValue.length <= 10) {
                    setUser({ ...user, mobile: newValue });
                  }
                }}
                disabled={true}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px]`}
              />
            </div>

            {/* Languages */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Known Languages
              <input
                type="text"
                name=""
                id=""
                value={""}
                onChange={() => {}}
                disabled={notEditable}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* Time Zone */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 pointer-events-none flex flex-col`}
            >
              Time Zone
              <input
                type="text"
                value={""}
                disabled={true}
                className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "" : "px-2 ring-1"
                }`}
              />
            </div>

            {/* Country */}
            <div
              className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Country / Region
              <div className="flex items-center">
                <div>
                  <img src="" alt="" />
                </div>
                <input
                  type="text"
                  value="India"
                  disabled={true}
                  className={`min-w-80 max-w-80 text-base font-normal py-[2px]`}
                />
              </div>
            </div>

            {/* Address */}
            <div
              className={`mt-10 mr-10 ml-1 mb-1 ${
                notEditable ? "pointer-events-none" : ""
              } flex flex-col`}
            >
              Address
              <textarea
                // type="text"
                rows={2}
                cols={73}
                value={
                  user.customer?.address ||
                  user.employee?.address ||
                  "Not Provided"
                }
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  let value = e.target.value;

                  if (user.employee) {
                    setUser({
                      ...user,
                      employee: { ...user.employee, address: value },
                    });
                  } else if (user.customer) {
                    setUser({
                      ...user,
                      customer: { ...user.customer, address: value },
                    });
                  }
                }}
                disabled={notEditable}
                className={`hide-scroll-bar rounded outline-none min-w-80 text-base font-normal py-[2px] ${
                  notEditable ? "bg-transparent" : "px-2 ring-1"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#E9EAED] rounded-sm mt-5">
        {startReset ? (
          <div className="float-right relative m-0 flex gap-3">
            <button
              onClick={() => setStartReset(false)}
              className="min-w-20 max-w-20 h-10 bg-[#10bc83] text-[#ffffff] font-semibold rounded cursor-pointer text-sm text-center w-[-webkit-fit-content]"
            >
              Save
            </button>

            <button
              onClick={() => setStartReset(false)}
              className="min-w-20 max-w-20 h-10 bg-[#ffffff] text-[#2a2a2add] font-semibold rounded cursor-pointer text-sm text-center w-[-webkit-fit-content]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setStartReset(true)}
            className="float-right relative m-0 min-w-36 max-w-36 h-10 bg-red-500 text-[#ffffff] font-semibold rounded cursor-pointer text-sm text-center w-[-webkit-fit-content]"
          >
            Reset Password
          </button>
        )}

        <div>
          <p className="text-2xl">Reset Your Password</p>
          <p className="text-base">
            Enter a unique and strong password that is easy to remember so that
            you won't forget it the next time.
          </p>
        </div>

        <div className="max-w-[1300px] flex">
          <div
            className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
              startReset ? "" : "pointer-events-none"
            } flex flex-col`}
          >
            Current Password
            <input
              type="password"
              value={oldPass}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOldPass(e.target.value)
              }
              disabled={!startReset}
              className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                startReset ? "px-2 ring-1" : ""
              }`}
            />
          </div>
          <div
            className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
              startReset ? "" : "pointer-events-none"
            } flex flex-col`}
          >
            New Password
            <input
              type="password"
              value={newPass}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewPass(e.target.value)
              }
              disabled={!startReset}
              className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                startReset ? "px-2 ring-1" : ""
              }`}
            />
          </div>
          <div
            className={`mt-10 mr-10 ml-1 mb-0 h-10 ${
              startReset ? "" : "pointer-events-none"
            } flex flex-col`}
          >
            Confirm New Password
            <input
              type="password"
              value={confirmNewPass}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmNewPass(e.target.value)
              }
              disabled={!startReset}
              className={`min-w-80 max-w-80 text-base font-normal py-[2px] ${
                startReset ? "px-2 ring-1" : ""
              }`}
            />
          </div>
        </div>
      </div>

      <div>
        {/* <p>ID: {user.id}</p> */}
        <p>Name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Mobile: {user.mobile}</p>
        <p>
          User Type:{" "}
          {user.userType === "OFFICE" || user.userType === "TECHNICIAN"
            ? "EMPLOYEE"
            : user.userType}
        </p>
        {user.customer ? (
          <div>
            <p>Customer Name: {user.customer.name}</p>
            <p>Customer Type: {user.customer.customerType}</p>
            <p>
              Installation Date:{" "}
              {`${user.customer.installationDate.toString().split("T")[0]}`}
            </p>
          </div>
        ) : (
          <div>
            <p>Employee Name: {user.employee?.name}</p>
            <p>Employee Type: {user.employee?.employeeType}</p>
            <p>
              Joining Date:{" "}
              {`${user.employee?.joiningDate.toString().split("T")[0]}`}
            </p>
          </div>
        )}
      </div>
      {/* Render other user details as needed */}
    </div>
  );
};

export default UserProfile;
