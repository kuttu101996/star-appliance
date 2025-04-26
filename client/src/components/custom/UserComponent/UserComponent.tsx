import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { deleteUser, getAllUsers } from "@/features/user/userSlice";
//  createUser,

const UserComponent = () => {
  const dispatch: AppDispatch = useDispatch();

  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  // const error = useSelector((state: RootState) => state.users.error);

  // Local state to handle error messages for individual users
  const [errorState, setErrorState] = useState<{ [id: string]: string | null }>(
    {}
  );

  useEffect(() => {
    dispatch(getAllUsers());
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
    <div>
      <h1>Users List</h1>
      {loading && <p>Loading...</p>}
      {/* {error && <p>Error: {error}</p>} */}
      <ul>
        {users.map((user) => (
          <li key={user._id + new Date().toISOString()}>
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
  );
};

export default UserComponent;
