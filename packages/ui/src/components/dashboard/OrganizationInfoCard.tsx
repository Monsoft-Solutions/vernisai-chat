import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, Crown, HelpCircle } from "lucide-react";

type OrganizationInfoCardProps = {
  name: string;
  activeUsers: number;
  totalUsers: number;
  subscriptionPlan: string;
  usagePercent: number;
};

export const OrganizationInfoCard: React.FC<OrganizationInfoCardProps> = ({
  name,
  activeUsers,
  totalUsers,
  subscriptionPlan,
  usagePercent,
}) => {
  // Determine the plan color and icon
  const getPlanDetails = () => {
    switch (subscriptionPlan.toLowerCase()) {
      case "enterprise":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: <Crown className="h-3 w-3 mr-1" />,
        };
      case "pro":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: <Crown className="h-3 w-3 mr-1" />,
        };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: null };
    }
  };

  const planDetails = getPlanDetails();

  return (
    <Card className="h-full border border-border-default overflow-hidden">
      <CardHeader className="px-6 py-5 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border-default">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Organization Information</span>
          <button
            className="text-text-tertiary hover:text-text-secondary"
            title="Learn more about your organization"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        <div>
          <h4 className="text-sm font-medium mb-2 text-text-tertiary">
            Organization
          </h4>
          <div className="flex items-center">
            <div className="h-10 w-10 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center font-medium text-lg">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold">{name}</p>
              <p className="text-xs text-text-tertiary">
                Created on: Jan 15, 2025
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 text-text-tertiary">Users</h4>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-background-secondary flex items-center justify-center">
              <Users className="h-5 w-5 text-text-secondary" />
            </div>
            <div>
              <p className="text-base font-semibold">
                <span className="text-primary">{activeUsers}</span>
                <span className="text-sm text-text-tertiary font-normal">
                  {" "}
                  active
                </span>
                <span className="mx-1 text-text-tertiary">/</span>
                <span>{totalUsers}</span>
                <span className="text-sm text-text-tertiary font-normal">
                  {" "}
                  total
                </span>
              </p>
              <div className="h-1.5 w-20 bg-background-secondary rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(activeUsers / totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 text-text-tertiary">
            Subscription
          </h4>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-background-secondary flex items-center justify-center">
              <Crown className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${planDetails.color}`}
                >
                  {planDetails.icon}
                  {subscriptionPlan} Plan
                </span>
                <span className="ml-2 text-xs text-text-tertiary">
                  Auto-renews: Feb 15, 2026
                </span>
              </div>
              <div className="text-xs text-text-tertiary mt-1">
                Plan includes all core features plus premium support.
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <h4 className="text-sm font-medium text-text-tertiary">
              Monthly Usage
            </h4>
            <div className="flex items-center">
              <span
                className={`text-sm font-medium ${usagePercent > 75 ? "text-amber-500" : ""} ${usagePercent > 90 ? "text-red-500" : ""}`}
              >
                {usagePercent}%
              </span>
              <span className="text-xs text-text-tertiary ml-1">of limit</span>
            </div>
          </div>

          {/* Custom progress bar implementation */}
          <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePercent > 90
                  ? "bg-red-500"
                  : usagePercent > 75
                    ? "bg-amber-500"
                    : "bg-primary"
              }`}
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-text-tertiary">
            <span>0</span>
            <span>Usage Limit: 10,000 messages/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
