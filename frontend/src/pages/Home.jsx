import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to CampusConnect 🎓
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your smart, minimalistic college forum platform
        </p>
        {isAuthenticated ? (
          <p className="text-lg text-gray-700">
            Hello, <span className="font-semibold text-blue-600">{user?.name}</span>!
          </p>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/official"
          className="bg-blue-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📢</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Official</h3>
          <p className="text-gray-600">
            Official notices, announcements, and updates from faculty and administration
          </p>
        </Link>

        <Link
          to="/student"
          className="bg-green-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Student</h3>
          <p className="text-gray-600">
            Student discussions, questions, club activities, and peer support
          </p>
        </Link>

        <Link
          to="/anonymous"
          className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Anonymous</h3>
          <p className="text-gray-600">
            Share your thoughts anonymously without revealing your identity
          </p>
        </Link>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          About CampusConnect
        </h2>
        <div className="space-y-4 text-gray-600">
          <p>
            CampusConnect is designed to replace outdated WhatsApp groups and physical
            notice boards with a modern, efficient, and secure platform.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Official section for verified notices and announcements</li>
            <li>Student section for peer discussions and collaboration</li>
            <li>Anonymous section for free expression</li>
            <li>Real-time notifications for important updates</li>
            <li>Role-based access control for security</li>
            <li>Clean, modern UI for better user experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
