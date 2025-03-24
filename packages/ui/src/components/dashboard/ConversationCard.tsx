import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { formatRelativeTime } from "../../lib/date";

type ConversationCardProps = {
  id: string;
  title: string;
  lastMessageAt: Date;
  model: string;
  snippet: string;
  onClick?: () => void;
};

export const ConversationCard: React.FC<ConversationCardProps> = ({
  title,
  lastMessageAt,
  model,
  snippet,
  onClick,
}) => {
  return (
    <Card
      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-base truncate pr-2">{title}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            {model}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{snippet}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        {formatRelativeTime(lastMessageAt)}
      </CardFooter>
    </Card>
  );
};
