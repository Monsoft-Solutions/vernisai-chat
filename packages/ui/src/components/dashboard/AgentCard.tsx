import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";

type AgentCardProps = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  onStartConversation?: () => void;
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  capabilities,
  avatarUrl,
  onStartConversation,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <img
              src={avatarUrl || `/avatars/default-agent.svg`}
              alt={name}
              className="h-full w-full object-cover"
            />
          </Avatar>
          <h3 className="font-medium">{name}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {capabilities.map((capability, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground"
            >
              {capability}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={onStartConversation}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Start Conversation
        </Button>
      </CardFooter>
    </Card>
  );
};
