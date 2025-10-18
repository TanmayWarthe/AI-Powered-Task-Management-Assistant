import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Check, Clock, Edit, Trash2, MoreVertical } from 'lucide-react';

export default function TaskItem({ task , onEdit}) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateTaskStatus(task._id, newStatus);
      setShowMenu(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTask(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => handleStatusUpdate(
              task.status === 'completed' ? 'todo' : 'completed'
            )}
            disabled={loading}
            className={`mt-1 p-1 rounded-full border-2 ${
              task.status === 'completed' 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 text-transparent hover:border-green-500'
            } transition-colors disabled:opacity-50`}
          >
            <Check className="w-3 h-3" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
              <h3 className={`font-medium ${
                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-2">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="capitalize">{task.category}</span>
              <span>•</span>
              <span className="capitalize">{task.priority} priority</span>
              <span>•</span>
              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              {task.estimatedHours > 0 && (
                <>
                  <span>•</span>
                  <span>{task.estimatedHours}h</span>
                </>
              )}
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {task.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-10">
              {task.status !== 'in-progress' && (
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Clock className="w-4 h-4" />
                  Mark In Progress
                </button>
              )}
              
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4" />
                  Mark Complete
                </button>
              )}

                        
            <button
            onClick={() => {
                onEdit(); // Call the edit function from props
                setShowMenu(false);
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
            <Edit className="w-4 h-4" />
            Edit Task
            </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ')}
        </span>
        
        <div className="text-xs text-gray-500">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}