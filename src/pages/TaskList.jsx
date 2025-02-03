import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import { Plus, ClipboardList } from 'lucide-react';
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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isAdmin, setIsAdmin] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!auth.isLoading) {
      const userIsAdmin = auth?.user?.profile?.["cognito:groups"][0] === 'admin';
      setIsAdmin(userIsAdmin);
      console.log(userIsAdmin,'from profile');
      console.log(isAdmin);
      fetchTasks(userIsAdmin);
      if (userIsAdmin) {
        fetchUsers();
      }
    }
  }, [auth,isAdmin]);

  const fetchTasks = async (userIsAdmin) => {
    setIsLoading(true);
    try {
      const endpoint = userIsAdmin ? `${API_BASE_URL}/tasks/all` : `${API_BASE_URL}/tasks`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.user?.id_token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error(response?.error ?? "Failed to fetch tasks");
    
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      showToast(error.message, 'error');
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
    
      if (!response.ok) throw new Error(response?.error ?? "Failed to fetch users");
    
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast(error.message, 'error');
    }
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

      if (!response.ok) throw new Error(response?.error ?? "Failed to add task");

      showToast('Task added successfully', 'success');
      const userIsAdmin = auth?.user?.profile?.["cognito:groups"][0] === 'admin';

      fetchTasks(userIsAdmin);
    } catch (error) {
      showToast(error.message, 'error');
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
      <p className="text-gray-500 mb-4">Get started by creating your first task!</p>
      {isAdmin && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Task
        </button>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-gray-600 mt-1">Total tasks: {tasks.length}</p>
          </div>
        </div>

        {isAdmin && tasks.length > 0 && (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 mb-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
          >
            <Plus className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600 font-medium">Add New Task</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <EmptyState />
            ) : (
              tasks.map((task) => (
                <Task
                  key={task.TaskId}
                  task={task}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                  users={users}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </div>
        )}

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
          users={users}
        />

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </>
  );
};

export default TaskList;