import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type InfoCardProps = {
  children: React.ReactNode;
  title: React.ReactNode;
};

export const InfoCard: React.FC<InfoCardProps> = ({ children, title }) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
