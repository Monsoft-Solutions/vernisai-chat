import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

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
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Organization</h4>
          <p className="text-lg font-semibold">{name}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Users</h4>
          <p className="text-lg font-semibold">
            {activeUsers}{" "}
            <span className="text-sm text-muted-foreground">active</span> /{" "}
            {totalUsers}{" "}
            <span className="text-sm text-muted-foreground">total</span>
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Subscription</h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {subscriptionPlan}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <h4 className="text-sm font-medium">Monthly Usage</h4>
            <span className="text-sm font-medium">{usagePercent}%</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
