import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Plus, Bell, LogOut, Menu, X } from 'lucide-react';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem'; // ← ADD THIS IMPORT

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user, logout } = useAuth();
  const { tasks, stats, loading } = useTasks();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm 
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null); // Reset editing task
          }} 
          editTask={editingTask} // Pass the task to edit
        />
      )}

      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between px-4">
                <h1 className="text-2xl font-bold text-gray-800">AI Task Assistant</h1>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <nav className="mt-8 px-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-100 text-blue-700">
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
                  <CheckSquare className="w-5 h-5" />
                  <span className="font-medium">My Tasks</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">AI Task Assistant</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 hidden sm:block">{user?.username}</span>
            </div>

            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome back, {user?.username}! 👋
                </h2>
                <p className="text-gray-600">
                  {totalTasks === 0 
                    ? "Ready to tackle your tasks with AI assistance?"
                    : `You have ${totalTasks} task${totalTasks === 1 ? '' : 's'} to manage`
                  }
                </p>
              </div>
              <button 
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600">Total Tasks</h3>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{totalTasks}</p>
              <p className="text-sm text-gray-500">
                {totalTasks === 0 ? 'Get started by creating your first task' : 'All your tasks'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600">Completed</h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{completedTasks}</p>
              <p className="text-sm text-gray-500">
                {completedTasks === 0 ? 'No tasks completed yet' : 'Great work! Keep going'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600">Productivity</h3>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{completionRate}%</p>
              <p className="text-sm text-gray-500">
                {completionRate === 0 ? 'Track your progress here' : 'Your completion rate'}
              </p>
            </div>
          </div>

          {/* Tasks List or Empty State */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your tasks...</p>
            </div>
          ) : totalTasks === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-6">
                  Start organizing your work and let AI help you prioritize and manage your tasks efficiently.
                </p>
                <button 
                  onClick={() => setShowTaskForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Your First Task
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Tasks</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskItem 
    key={task._id} 
    task={task} 
    onEdit={() => {
      setEditingTask(task);
      setShowTaskForm(true);
    }}
  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}