import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-3xl">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>

              {user.department && (
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{user.department}</p>
                </div>
              )}

              {user.year && (
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium text-gray-800">{user.year}th Year</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-800">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
