import React from 'react';
import { Calendar, Clock, User, Trash2 } from 'lucide-react';

const Task = ({ task, onDelete }) => {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{task.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <User className="h-4 w-4" />
              <span className="text-sm">{task.responsibility}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatDate(task.deadline)}</span>
            </div>
          </div>
          
          {task.comment && (
            <div className="mt-3 text-sm text-gray-500 border-t pt-2">
              {task.comment}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onDelete(task.TaskId)}
          className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Task;