// import React from 'react'

import { AppDispatch, RootState } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Side Nav & top Nav to be created
// On profile photo click dropdown will contain logout btn & profile view & update
// If Office or Admin userType login then Inventory will display

const Navbar = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // const user = useSelector((state: RootState) => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return (
    <div className="px-6 w-full min-h-12 bg-[#f7f7fe] border-b border-gray-200 text-[#1b1b1b] flex items-center">
      <div className="w-full flex items-center justify-between">
        <div className="text-lg">Star Appliance</div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <div className="flex items-center cursor-pointer"> */}
              {/* <div className="h-10 flex items-center bg-[#ededff] px-2 rounded"> */}
              {/* <p className="font-semibold mr-2">
                    {user?.displayName?.charAt(0).toUpperCase() +
                      user?.displayName?.slice(1).toLowerCase() || ""}
                  </p> */}
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {/* <p className="font-semibold ml-2">Debkumar</p> */}
              {/* </div> */}
              {/* </div> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => dispatch(logout())}>
                Log out
                <DropdownMenuShortcut>
                  <LogOut width={16} strokeWidth={1.5} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
