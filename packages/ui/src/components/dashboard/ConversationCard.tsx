import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { formatRelativeTime } from "../../lib/date";
import { MessageSquare, ArrowUpRight } from "lucide-react";

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
  // Determine the model badge styling based on the model name
  const getModelStyle = () => {
    if (model.toLowerCase().includes("gpt")) {
      return "bg-green-100 text-green-800";
    }
    if (model.toLowerCase().includes("claude")) {
      return "bg-violet-100 text-violet-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card
      className="h-full flex flex-col hover:shadow-md transition-all duration-200 border border-border-default hover:border-primary/20 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-medium text-base truncate pr-2">{title}</h3>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getModelStyle()}`}
          >
            {model}
          </span>
        </div>
        <p className="text-sm text-text-secondary line-clamp-2 mb-2">
          {snippet}
        </p>
        <div className="flex items-center justify-between text-xs text-text-tertiary mt-auto">
          <span>{formatRelativeTime(lastMessageAt)}</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center text-primary">
              Continue <ArrowUpRight className="h-3 w-3 ml-1" />
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t border-border-default/50 mt-auto">
        <div className="w-full bg-background-secondary h-1">
          <div className="bg-primary h-full w-0 group-hover:w-full transition-all duration-500"></div>
        </div>
      </CardFooter>
    </Card>
  );
};
