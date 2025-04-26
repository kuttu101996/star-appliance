import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { deleteUser, getAllUsers } from "@/features/user/userSlice";
import { getAllCustomers } from "@/features/customer/customerSlice";
import { getAllEmployees } from "@/features/employee/employeeSlice";
//  createUser,

const AdminMainPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector((state: RootState) => state.users.users);
  const usersLoading = useSelector((state: RootState) => state.users.loading);

  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  const employeesLoading = useSelector(
    (state: RootState) => state.employees.loading
  );

  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );
  const customersLoading = useSelector(
    (state: RootState) => state.customers.loading
  );
  // const error = useSelector((state: RootState) => state.users.error);

  // Local state to handle error messages for individual users
  const [errorState, setErrorState] = useState<{
    [_id: string]: string | null;
  }>({});

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllCustomers());
    dispatch(getAllEmployees());
  }, [dispatch]);

  // const handleCreateUser = async (userData: any) => {
  //   const resultAction = await dispatch(createUser(userData));

  //   if (createUser.fulfilled.match(resultAction)) {
  //     dispatch(getAllUsers()); // Fetch the latest users after creation
  //   }
  // };

  const handleDelete = async (userId: string) => {
    try {
      const resultAction = await dispatch(deleteUser(userId));
      if (deleteUser.rejected.match(resultAction)) {
        setErrorState((prev) => ({
          ...prev,
          [userId]: resultAction.payload as string,
        }));
        setTimeout(() => {
          setErrorState((prev) => ({
            ...prev,
            [userId]: null,
          }));
        }, 3000); // Show the error message for 5 seconds
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  return (
    <div className="flex flex-wrap justify-between gap-5">
      <div className="min-w-[300px]">
        <h1 className="text-lg font-medium">Users List</h1>
        {usersLoading && <p>Loading...</p>}
        {/* {error && <p>Error: {error}</p>} */}
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {errorState[user._id] ? (
                <div>
                  <p>Error: {errorState[user._id]}</p>
                </div>
              ) : (
                <div>
                  <span>User Name - {user.displayName}</span>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-1 border bg-red-400 text-white rounded ml-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {/* Assuming you have a form to create a new user */}
        {/* <UserForm onSubmit={handleCreateUser} /> */}
      </div>

      <div className="min-w-[300px]">
        <h1 className="text-lg font-medium">Customers List</h1>
        {customersLoading && <p>Loading...</p>}
        <ul>
          {customers.map((customer) => (
            <li key={customer._id}>
              {errorState[customer._id] ? (
                <div>
                  <p>Error: {errorState[customer._id]}</p>
                </div>
              ) : (
                <div>
                  <span>Customer Name - {customer.name}</span>
                  {/* <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-1 border bg-red-400 text-white rounded ml-2"
                  >
                    Delete
                  </button> */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-[300px]">
        <h1 className="text-lg font-medium">Employees List</h1>
        {employeesLoading && <p>Loading...</p>}
        <ul>
          {employees.map((employee) => (
            <li key={employee._id}>
              {errorState[employee._id] ? (
                <div>
                  <p>Error: {errorState[employee._id]}</p>
                </div>
              ) : (
                <div>
                  <span>Employee Name - {employee.name}</span>
                  {/* <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-1 border bg-red-400 text-white rounded ml-2"
                  >
                    Delete
                  </button> */}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminMainPage;
