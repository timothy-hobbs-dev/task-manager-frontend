import React, { useState, useRef } from 'react';
import { Calendar, Clock, User, Trash2, Edit2, CheckCircle } from 'lucide-react';

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
    const updatedTask = { ...editedTask, [field]: value };

    if (originalTask.current[field] !== value) {
      setEditedTask(updatedTask);
      onUpdate(updatedTask);
      originalTask.current = updatedTask;
    }

    setIsEditing({ ...isEditing, [field]: false });
  };

  const markAsCompleted = () => {
    handleUpdate('status', 'completed');
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const renderEditableField = (field, content, editComponent) => {
    const canEdit = field === 'comment' || isAdmin;

    if (isEditing[field] && canEdit) {
      return editComponent;
    }

    const baseClasses = field === 'comment' 
      ? "mt-3 text-sm text-gray-500 border-t pt-2 hover:bg-blue-50/50 px-2 py-1 rounded cursor-pointer transition-colors group"
      : "hover:bg-blue-50/50 px-2 py-1 rounded transition-colors group";

    return (
      <div 
        className={`${baseClasses} ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => canEdit && setIsEditing({ ...isEditing, [field]: true })}
      >
        {content}
        {canEdit && <Edit2 className="h-4 w-4 ml-2 inline-block opacity-0 group-hover:opacity-50 transition-opacity" />}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            {renderEditableField(
              'name',
              <h3 className="text-lg font-semibold text-gray-900">{editedTask.name}</h3>,
              <input
                type="text"
                value={editedTask.name}
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                onBlur={() => handleUpdate('name', editedTask.name)}
                className="text-lg font-semibold focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 w-full transition-all"
                autoFocus
              />
            )}

            {/* Status: Admin can edit; Regular users see "Complete" button */}
            {isAdmin ? (
              renderEditableField(
                'status',
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedTask.status)}`}>
                  {editedTask.status}
                </span>,
                <select
                  value={editedTask.status}
                  onChange={(e) => handleUpdate('status', e.target.value)}
                  onBlur={() => setIsEditing({ ...isEditing, status: false })}
                  className="focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 transition-all"
                  autoFocus
                >
                  <option value="open">Open</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              )
            ) : editedTask.status !== 'completed' ? (
              <button
                onClick={markAsCompleted}
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

          {renderEditableField(
            'description',
            <p className="text-gray-600 mb-4">{editedTask.description}</p>,
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              onBlur={() => handleUpdate('description', editedTask.description)}
              className="w-full focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 mb-4 transition-all resize-none"
              autoFocus
              rows={3}
            />
          )}

          {renderEditableField(
            'comment',
            <div className="mt-3 text-sm text-gray-500 border-t pt-2">
              {editedTask.comment || 'Add a comment...'}
            </div>,
            <textarea
              value={editedTask.comment || ''}
              onChange={(e) => setEditedTask({ ...editedTask, comment: e.target.value })}
              onBlur={() => handleUpdate('comment', editedTask.comment)}
              className="w-full mt-3 focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 text-sm transition-all resize-none"
              autoFocus
              rows={2}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <User className="h-4 w-4" />
              {renderEditableField(
                'responsibility',
                <span className="text-sm">{editedTask.responsibility}</span>,
                <select
                  value={editedTask.responsibility}
                  onChange={(e) => handleUpdate('responsibility', e.target.value)}
                  onBlur={() => setIsEditing({ ...isEditing, responsibility: false })}
                  className="text-sm focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 transition-all"
                  autoFocus
                >
                  {users.map((user) => (
                    <option key={user.attributes?.email} value={user.attributes?.email}>
                      {user.attributes?.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <Clock className="h-4 w-4" />
              {renderEditableField(
                'deadline',
                <span className="text-sm">{formatDate(editedTask.deadline)}</span>,
                <input
                  ref={dateInputRef}
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={new Date(editedTask.deadline).toISOString().slice(0, 16)}
                  onChange={(e) => handleUpdate('deadline', new Date(e.target.value).toISOString())}
                  onBlur={() => setIsEditing({ ...isEditing, deadline: false })}
                  className="text-sm focus:ring-1 focus:ring-blue-200 outline-none border border-blue-100 rounded px-2 py-1 transition-all"
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
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
