import Avatar from "react-avatar";

export default function Welcome({ user }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="flex items-center gap-4 mb-6">
      <Avatar name={user.name} round size="48" />
      <div>
        <div className="text-lg font-semibold">{greeting}, {user.name}!</div>
        <div className="text-sm text-gray-500">Welcome back to your finance dashboard.</div>
      </div>
    </div>
  );
}