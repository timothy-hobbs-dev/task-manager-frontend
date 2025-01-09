import Navbar from "../components/Navbar";

const Dashboard = () => {
    const tasks = [
      { id: 1, title: "Complete project proposal", status: "In Progress", due: "2025-01-15" },
      { id: 2, title: "Review team presentations", status: "Pending", due: "2025-01-20" },
      { id: 3, title: "Update documentation", status: "Completed", due: "2025-01-12" },
    ];
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Tasks</h2>
            <p className="text-gray-600">Welcome back! Here's what's on your plate today.</p>
          </div>
          
          <div className="grid gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-gray-500 mt-1">Due: {task.due}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default Dashboard;