export default function ProfilePage() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white dark:bg-black rounded-lg shadow border border-gray-200 dark:border-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Profile</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span>
          <span className="ml-2 text-black dark:text-white">John Doe</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
          <span className="ml-2 text-black dark:text-white">john.doe@example.com</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Role:</span>
          <span className="ml-2 text-black dark:text-white">User</span>
        </div>
      </div>
    </div>
  );
} 