import { useEffect, useState } from "react";
import {
  ActivityIcon,
  CheckCircleIcon,
  ClockIcon,
  SendIcon,
  Share2Icon,
  TrendingUpIcon,
} from "lucide-react";

import {
  dummyAccountsData,
  dummyActivityData,
  dummyPostsData,
} from "../assets/assets";

const Dashboard = () => {
  const [stats, setStats] = useState({
    schedules: 0,
    published: 0,
    connectedAccounts: 0,
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = () => {
      try {
        const postRes = { data: dummyPostsData };
        const accountsRes = { data: dummyAccountsData };
        const activityRes = { data: dummyActivityData };

        const posts = postRes.data;
        const accounts = accountsRes.data;
        const activitiesData = activityRes.data;

        setStats({
          schedules: posts.filter((post) => post.status === "scheduled").length,
          published: posts.filter((post) => post.status === "published").length,
          connectedAccounts: accounts.length,
        });

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.schedules,
      icon: ClockIcon,
      trend: "+2 today",
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircleIcon,
      trend: "+2 today",
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      trend: "Active",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Good morning</h2>

        <p className="text-slate-500">
          Here's what's happening with your social accounts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-slate-900">
                  {card.value}
                </div>

                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUpIcon className="size-3" />
                  {card.trend}
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="size-4" />
                <p>{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Activity Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <span className="text-sm text-slate-400">
            {activities.length} events
          </span>
        </div>

        {/* Activity Content */}
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="size-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
              <ActivityIcon className="size-6 text-slate-400" />
            </div>

            <p className="font-medium text-slate-700">No activity yet</p>

            <p className="text-sm text-slate-400 mt-1 text-center">
              Connect accounts and schedule posts to see events here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Activity Icon */}
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-zinc-100 text-zinc-600">
                  <SendIcon className="size-4" />
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                      Published
                    </span>

                    <span className="text-xs text-slate-400">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
