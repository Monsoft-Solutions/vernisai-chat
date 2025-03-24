import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { RocketIcon, ChevronRightIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AgentCardProps = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatarUrl?: string;
  icon?: LucideIcon;
  onStartConversation?: () => void;
  onViewDetails?: () => void;
};

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  capabilities,
  avatarUrl,
  icon: Icon,
  onStartConversation,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);

  // Choose a color for the capabilities based on index
  const getCapabilityColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-rose-100 text-rose-800",
    ];
    return colors[index % colors.length];
  };

  // Check if Icon is provided and it's a valid component
  const hasValidIcon = Icon !== undefined;

  // Get the first letter of the agent name for fallback
  const nameInitial = name.charAt(0).toUpperCase();

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="h-full flex flex-col group hover:shadow-md transition-all duration-200 border border-border-default hover:border-primary/20">
      <CardContent className="p-6 flex-grow relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10"></div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Avatar className="h-12 w-12 bg-primary/10 flex items-center justify-center">
              {avatarUrl && !imageError ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              ) : hasValidIcon ? (
                <Icon className="h-6 w-6 text-primary" />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-primary font-medium text-lg">
                  {nameInitial}
                </div>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
              <RocketIcon className="h-3 w-3" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-base">{name}</h3>
            <div className="text-xs text-text-tertiary">Agent</div>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {capabilities.map((capability, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-0.5 rounded-full ${getCapabilityColor(index)}`}
            >
              {capability}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <Button
          onClick={onStartConversation}
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        >
          Start Conversation
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          className="p-0 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="View agent details"
          title="View agent details"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>

      {/* Interactive hover effect */}
      <div className="h-1 w-full bg-background-secondary">
        <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-500"></div>
      </div>
    </Card>
  );
};
