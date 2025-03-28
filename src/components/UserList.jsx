import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  // ✅ Token Expiry and Check
  const checkToken = () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token || !tokenExpiry || new Date().getTime() > Number(tokenExpiry)) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  };

  const fetchUsers = async (page) => {
    try {
      const { data } = await getUsers(page);
      setUsers(data.data);
      setFilteredUsers(data.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        `${user.first_name} ${user.last_name} ${user.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        User List
      </h2>

      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.first_name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() =>
                  navigate(`/edit/${user.id}`, { state: { user } })
                }
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } transition`}
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
