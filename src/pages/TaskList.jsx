import React, { useEffect, useState } from 'react';
import { useAuth } from "react-oidc-context";
import { Plus } from 'lucide-react';
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!auth.isLoading) {
      fetchTasks();
      fetchUsers();
    }
  }, [auth]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
        let response;
        if(auth?.user?.profile?.["cognito:groups"][0] !== 'admin'){
            response = await fetch(`${API_BASE_URL}/tasks`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${auth.user?.id_token}`,
                  "Content-Type": "application/json",
                },
              });
        }else{
            response = await fetch(`${API_BASE_URL}/tasks/all`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${auth.user?.id_token}`,
                  "Content-Type": "application/json",
                },
              });
        }
     
    
        if (!response.ok) throw new Error(response?.error ?? "Failed to update task");
    
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
    
      if (!response.ok) throw new Error(response?.error ?? "Failed to update task");
    
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

      if (!response.ok) throw new Error(response?.error ?? "Failed to update task");

      showToast('Task added successfully', 'success');
      fetchTasks();
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

      if (!response.ok) throw new Error(response?.error ?? "Failed to update task");

      showToast('Task deleted successfully', 'success');
      fetchTasks();
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
      fetchTasks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>

        {/* Add Task Button styled like a task card */}
        {auth?.user?.profile?.["cognito:groups"][0] === 'admin' ?(

          <div 
          onClick={() => setIsModalOpen(true)}
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 mb-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
        >
          <Plus className="h-6 w-6 text-gray-400 mr-2" />
          <span className="text-gray-600 font-medium">Add New Task</span>
        </div>
        ):null}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
             <Task
             key={task.TaskId}
             task={task}
             onDelete={handleDeleteTask}
             onUpdate={handleUpdateTask}
             users={users}
             isAdmin={auth?.user?.profile?.["cognito:groups"][0] === 'admin'}
           />
            ))}
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