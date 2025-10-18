import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { X } from 'lucide-react';

export default function TaskForm({ onClose, editTask = null }) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    category: editTask?.category || 'personal',
    priority: editTask?.priority || 'medium',
    dueDate: editTask?.dueDate ? editTask.dueDate.split('T')[0] : '',
    estimatedHours: editTask?.estimatedHours || 1,
    tags: editTask?.tags?.join(', ') || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        estimatedHours: parseInt(formData.estimatedHours) || 1
      };

      let result;
      if (editTask) {
        result = await updateTask(editTask._id, taskData);
      } else {
        result = await createTask(taskData);
      }

      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95">
      <div className="bg-white border border-gray-200 shadow-lg w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-800">
            {editTask ? 'Edit Task' : 'Add Task'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form - No Scroll */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="What needs to be done?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Add details..."
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Date & Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Hours
              </label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="work, urgent, project"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded font-normal hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded font-normal hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Saving...' : (editTask ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}