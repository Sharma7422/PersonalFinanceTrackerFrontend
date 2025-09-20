import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/api/api";
import { FaBell, FaMoneyBillWave, FaChartPie, FaPiggyBank } from "react-icons/fa";

const typeIcons = {
  bill: <FaMoneyBillWave className="text-primary dark:text-yellow-400" />,
  budget: <FaChartPie className="text-secondary dark:text-purple-400" />,
  saving: <FaPiggyBank className="text-green-500 dark:text-green-300" />,
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchNotifications = async () => {
    setNotifications(await getNotifications());
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-primary/10 dark:hover:bg-primary/30 transition"
        onClick={() => setShowList((v) => !v)}
      >
        <FaBell className="text-2xl text-primary dark:text-yellow-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>
      {showList && (
        <div
          className="
            absolute left-1/2 -translate-x-1/2 top-12
            w-[90vw] max-w-xs
            bg-white dark:bg-gray-900 shadow-xl rounded-xl z-50
          "
        >
          <div className="p-4 border-b font-bold text-primary dark:text-yellow-400 text-center">Notifications</div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-4 text-gray-400 dark:text-gray-500 text-center">No notifications</li>
            )}
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`flex flex-col items-center gap-2 p-4 border-b last:border-b-0 ${
                  n.read
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-yellow-50 dark:bg-yellow-900"
                }`}
              >
                <span>{typeIcons[n.type]}</span>
                <div className="flex-1 text-center">
                  <div>{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <button
                    className="mt-2 text-xs text-primary dark:text-yellow-400 hover:underline"
                    onClick={() => handleMarkAsRead(n._id)}
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}