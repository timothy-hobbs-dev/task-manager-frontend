import React, { useState, useRef } from 'react';
import { Calendar, Clock, User, Trash2, Edit2, CheckCircle, MessageCircle } from 'lucide-react';

const Task = ({ task, onDelete, isAdmin, users, onUpdate }) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    status: false,
    responsibility: false,
    deadline: false,
    comment: false
  });

  const [editedTask, setEditedTask] = useState(task);
  const originalTask = useRef(task);
  const dateInputRef = useRef(null);

  const handleUpdate = async (field, value) => {
    const updatedTask = { ...editedTask, [field]: value };

    if (originalTask.current[field] !== value) {
      setEditedTask(updatedTask);
      onUpdate(updatedTask);
      originalTask.current = updatedTask;
    }

    setIsEditing({ ...isEditing, [field]: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired':
        return 'text-red-600 bg-red-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            {/* Task Name */}
            <h3 
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:bg-blue-50/50 px-2 py-1 rounded transition-colors"
              onClick={() => isAdmin && setIsEditing({ ...isEditing, name: true })}
            >
              {isEditing.name ? (
                <input
                  type="text"
                  value={editedTask.name}
                  onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                  onBlur={() => handleUpdate('name', editedTask.name)}
                  className="text-lg font-semibold focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 w-full transition-all"
                  autoFocus
                />
              ) : (
                editedTask.name
              )}
            </h3>

            {/* Status Handling */}
            {isAdmin ? (
              <select
                value={editedTask.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedTask.status)}`}
              >
                <option value="open">Open</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            ) : editedTask.status !== 'completed' ? (
              <button
                onClick={() => handleUpdate('status', 'completed')}
                className="flex items-center gap-1 text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-sm font-medium transition-all"
              >
                <CheckCircle className="h-4 w-4" />
                Complete
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-50">
                Completed
              </span>
            )}
          </div>

          {/* Description */}
          <p 
            className="text-gray-600 cursor-pointer hover:bg-blue-50/50 px-2 py-1 rounded transition-colors"
            onClick={() => isAdmin && setIsEditing({ ...isEditing, description: true })}
          >
            {isEditing.description ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                onBlur={() => handleUpdate('description', editedTask.description)}
                className="w-full focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 mb-4 transition-all resize-none"
                autoFocus
                rows={3}
              />
            ) : (
              editedTask.description
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Reassignment */}
            <div className="flex items-center gap-2 text-gray-500">
              <User className="h-4 w-4" />
              {isAdmin ? (
                <select
                  value={editedTask.responsibility}
                  onChange={(e) => handleUpdate('responsibility', e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-200 focus:ring-1"
                >
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm">{editedTask.responsibility}</span>
              )}
            </div>

            {/* Deadline Selection */}
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <Clock className="h-4 w-4" />
              {isAdmin ? (
                <input
                  type="datetime-local"
                  value={editedTask.deadline}
                  min={getMinDateTime()}
                  onChange={(e) => handleUpdate('deadline', e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-200 focus:ring-1"
                />
              ) : (
                <span className="text-sm">{formatDate(editedTask.deadline)}</span>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-4 p-2 border-t border-gray-300">
            <div className="flex items-center gap-2 text-gray-700">
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm">Comment</span>
            </div>
            {isEditing.comment ? (
              <textarea
                value={editedTask.comment || ''}
                onChange={(e) => setEditedTask({ ...editedTask, comment: e.target.value })}
                onBlur={() => handleUpdate('comment', editedTask.comment)}
                className="w-full mt-2 focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 transition-all resize-none"
                autoFocus
                rows={2}
              />
            ) : (
              <p 
                className="mt-2 text-sm text-gray-600 cursor-pointer hover:bg-blue-50/50 px-2 py-1 rounded transition-colors"
                onClick={() => setIsEditing({ ...isEditing, comment: true })}
              >
                {editedTask.comment ? editedTask.comment : 'Add a comment...'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
