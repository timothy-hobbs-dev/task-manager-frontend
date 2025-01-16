import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, User, Trash2, Edit2 } from 'lucide-react';

const Task = ({ task, onDelete, hideDelete, users, onUpdate }) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    status: false,
    responsibility: false,
    deadline: false,
    comment: false
  });
  
  const [editedTask, setEditedTask] = useState(task);
  const dateInputRef = useRef(null);

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

  const handleUpdate = async (field, value) => {
    const updatedTask = {
      ...editedTask,
      [field]: value
    };
    setEditedTask(updatedTask);
    onUpdate(updatedTask);
    setIsEditing({ ...isEditing, [field]: false });
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            {isEditing.name ? (
              <input
                type="text"
                value={editedTask.name}
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                onBlur={() => handleUpdate('name', editedTask.name)}
                className="text-lg font-semibold border rounded px-2 py-1 w-full"
                autoFocus
              />
            ) : (
              <h3 
                className="text-lg font-semibold text-gray-900 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
                onClick={() => setIsEditing({ ...isEditing, name: true })}
              >
                {editedTask.name}
              </h3>
            )}
            
            {isEditing.status ? (
              <select
                value={editedTask.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                onBlur={() => setIsEditing({ ...isEditing, status: false })}
                className="border rounded px-2 py-1"
                autoFocus
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            ) : (
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedTask.status)} cursor-pointer`}
                onClick={() => setIsEditing({ ...isEditing, status: true })}
              >
                {editedTask.status}
              </span>
            )}
          </div>
          
          {isEditing.description ? (
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              onBlur={() => handleUpdate('description', editedTask.description)}
              className="w-full border rounded px-2 py-1 mb-4"
              autoFocus
            />
          ) : (
            <p 
              className="text-gray-600 mb-4 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
              onClick={() => setIsEditing({ ...isEditing, description: true })}
            >
              {editedTask.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <User className="h-4 w-4" />
              {isEditing.responsibility ? (
                <select
                  value={editedTask.responsibility}
                  onChange={(e) => handleUpdate('responsibility', e.target.value)}
                  onBlur={() => setIsEditing({ ...isEditing, responsibility: false })}
                  className="text-sm border rounded px-2 py-1"
                  autoFocus
                >
                  {users.map((user) => (
                    <option key={user.attributes?.email} value={user.attributes?.email}>
                      {user.attributes?.email}
                    </option>
                  ))}
                </select>
              ) : (
                <span 
                  className="text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => setIsEditing({ ...isEditing, responsibility: true })}
                >
                  {editedTask.responsibility}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <Clock className="h-4 w-4" />
              {isEditing.deadline ? (
                <input
                  ref={dateInputRef}
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={new Date(editedTask.deadline).toISOString().slice(0, 16)}
                  onChange={(e) => handleUpdate('deadline', new Date(e.target.value).toISOString())}
                  onBlur={() => setIsEditing({ ...isEditing, deadline: false })}
                  className="text-sm border rounded px-2 py-1"
                  autoFocus
                />
              ) : (
                <span 
                  className="text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                  onClick={() => setIsEditing({ ...isEditing, deadline: true })}
                >
                  {formatDate(editedTask.deadline)}
                </span>
              )}
            </div>
          </div>
          
          {isEditing.comment ? (
            <textarea
              value={editedTask.comment || ''}
              onChange={(e) => setEditedTask({ ...editedTask, comment: e.target.value })}
              onBlur={() => handleUpdate('comment', editedTask.comment)}
              className="w-full mt-3 border rounded px-2 py-1 text-sm"
              autoFocus
            />
          ) : (
            <div 
              className="mt-3 text-sm text-gray-500 border-t pt-2 hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
              onClick={() => setIsEditing({ ...isEditing, comment: true })}
            >
              {editedTask.comment || 'Add a comment...'}
            </div>
          )}
        </div>
        
        {!hideDelete && (
          <button
            onClick={() => onDelete(task.TaskId)}
            className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;