import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { Plus, ClipboardList, ChevronDown } from "lucide-react";
import debounce from "lodash/debounce";
import Navbar from "../components/Navbar";
import Task from "../components/Task";
import AddTaskModal from "../components/AddTaskModal";
import Toast from "../components/Toast";

const TaskList = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [nextToken, setNextToken] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    responsibility: "",
    name: "",
  });

  const [sortConfig, setSortConfig] = useState("deadline:asc");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!auth.isLoading) {
      const userIsAdmin = auth?.user?.profile?.["cognito:groups"]?.includes("admin");
      setIsAdmin(userIsAdmin);
      fetchTasks(userIsAdmin, false);
      if (userIsAdmin) {
        fetchUsers();
      }
    }
  }, [auth]);

  useEffect(() => {
    if (!auth.isLoading) {
      setNextToken(null);
      fetchTasks(isAdmin, false);
    }
  }, [filters, sortConfig]);

  const buildQueryString = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    params.append("sort", sortConfig);

    if (nextToken) {
      params.append("next_token", nextToken);
    }

    return params.toString();
  };

  const fetchTasks = async (userIsAdmin, loadMore = false) => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString();
      const endpoint =  `${API_BASE_URL}/tasks/all?${queryString}`

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();

      setTasks(loadMore ? [...tasks, ...data.items] : data.items);
      setNextToken(data.next_token || null);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value) => {
    setSortConfig(value);
  };

  const handleAddTask = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add task");

      showToast("Task added successfully", "success");
      fetchTasks(isAdmin, false);
    } catch (error) {
      showToast(error.message, "error");
    }
  };


  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
        body: JSON.stringify({ TaskId: taskId }),
      });

      if (!response.ok) throw new Error(response?.error ?? "Failed to delete task");

      showToast('Task deleted successfully', 'success');
      const userIsAdmin = auth?.user?.profile?.["cognito:groups"][0] === 'admin';

      fetchTasks(userIsAdmin);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error(response?.error ?? "Failed to update task");

      showToast('Task updated successfully', 'success');
      const userIsAdmin = auth?.user?.profile?.["cognito:groups"][0] === 'admin';

      fetchTasks(userIsAdmin);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };


  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const EmptyState = () => (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
      <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Yet</h3>
      <p className="text-gray-500 mb-4">
        {auth?.user?.profile?.["cognito:groups"]?.[0] === "admin"
          ? "Get started by creating your first task!"
          : "You will be assigned a new task"}
      </p>
      {isAdmin && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Task
        </button>
      )}
    </div>
  );

  const loadMore = () => {
    fetchTasks(isAdmin, true);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <div className="mb-6 flex gap-4">
          <select className="border px-3 py-2" value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="open">Open</option>
          </select>

          <input type="text" placeholder="Search by name" className="border px-3 py-2" value={filters.name} onChange={(e) => handleFilterChange("name", e.target.value)} />

          <select className="border px-3 py-2" value={sortConfig} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="deadline:asc">Deadline (Ascending)</option>
            <option value="deadline:desc">Deadline (Descending)</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {tasks.map((task) => (
              <Task key={task.TaskId}
              task={task}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              users={users}
              isAdmin={isAdmin} />
            ))}

            {nextToken && (
              <button onClick={loadMore} className="w-full mt-4 px-4 py-2 bg-white border rounded-md text-gray-700 hover:bg-gray-50">
                Load More
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            )}
          </>
        )}

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddTask} users={users} />

        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </div>
    </>
  );
};

export default TaskList;
