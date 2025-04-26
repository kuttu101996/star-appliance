import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const CustomerEmpView = () => {
  return (
    <div className="min-h-full">
      <div className="flex flex-col">
        {/* top */}
        <div className="border-b border-gray-50 min-h-10 bg-white w-full flex items-center justify-between">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-1 items-end justify-between cursor-pointer">
                  <span className="text-lg font-medium">
                    All Service Requests
                  </span>
                  <ChevronDown
                    className=" text-[#4691fb]"
                    width={20}
                    strokeWidth={4}
                  />
                </div>
                {/* <Button variant="outline">Open</Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    All Service Requests
                    {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    All Pending Requests
                    {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    All Assigned Requests
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CustomerEmpView;
