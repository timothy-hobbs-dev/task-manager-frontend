import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const navigate = useNavigate();
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to TaskFlow
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Streamline your workflow and boost productivity with our intuitive task management platform.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  };

export default LandingPage;