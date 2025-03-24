import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  InfoIcon,
  HelpCircleIcon,
  Settings2Icon,
  SlidersHorizontalIcon,
} from "lucide-react";
import type { Tool } from "./types";

/**
 * Props for the ContextPanel component
 */
export type ContextPanelProps = {
  /**
   * Name of the current agent
   */
  agentName?: string;
  /**
   * Description of the current agent
   */
  agentDescription?: string;
  /**
   * List of available tools
   */
  tools?: Tool[];
  /**
   * Optional class name for custom styling
   */
  className?: string;
};

/**
 * ContextPanel component for displaying contextual information
 */
export function ContextPanel({
  agentName,
  agentDescription,
  tools = [],
  className,
}: ContextPanelProps) {
  const [activeTool, setActiveTool] = React.useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex flex-col bg-background-secondary border-l",
        className,
      )}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-border-default flex items-center justify-between">
        <h2 className="text-sm font-medium flex items-center">
          <InfoIcon className="h-4 w-4 mr-2 text-text-tertiary" />
          Context Information
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-text-tertiary"
          title="Settings"
        >
          <Settings2Icon className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Agent Information */}
        {agentName && (
          <Card className="border shadow-sm bg-background-primary">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {agentName}
                  </h3>
                  <span className="text-xs text-text-tertiary">Assistant</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              {agentDescription && (
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  {agentDescription}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tools section */}
        {tools.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary flex items-center">
                <SlidersHorizontalIcon className="h-4 w-4 mr-2 text-text-tertiary" />
                Available Tools
                <span className="ml-2 text-xs text-text-tertiary">
                  ({tools.length})
                </span>
              </h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {tools.slice(0, 4).map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  className={cn(
                    "h-auto py-2 px-3 justify-start text-left",
                    activeTool === tool.id && "border-primary/50 bg-primary/5",
                  )}
                  onClick={() =>
                    setActiveTool(activeTool === tool.id ? null : tool.id)
                  }
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-xs">
                      {tool.icon && <span className="mr-1">{tool.icon}</span>}
                      {tool.name}
                    </span>
                  </div>
                </Button>
              ))}
            </div>

            {activeTool && (
              <Card className="border mb-4 bg-background-primary">
                <CardContent className="p-3 text-xs">
                  <div className="font-medium mb-1 flex items-center justify-between">
                    <span>
                      {tools.find((t) => t.id === activeTool)?.name} Tool
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setActiveTool(null)}
                    >
                      Close
                    </Button>
                  </div>
                  <p className="text-text-secondary text-xs">
                    {tools.find((t) => t.id === activeTool)?.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {tools.length > 4 && (
              <div className="text-xs text-text-tertiary text-center">
                +{tools.length - 4} more tools available
              </div>
            )}
          </div>
        )}

        {/* Knowledge Base */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-primary flex items-center">
              <HelpCircleIcon className="h-4 w-4 mr-2 text-text-tertiary" />
              Knowledge Base
            </h3>
          </div>

          {/* Sources */}
          <div className="space-y-2">
            <div className="px-3 py-2 border rounded-md border-dashed text-center">
              <p className="text-xs text-text-tertiary">
                No references have been used in this conversation yet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-border-default">
        <Button
          variant="outline"
          className="w-full text-xs h-8 text-text-tertiary"
          size="sm"
        >
          Clear Context
        </Button>
      </div>
    </div>
  );
}
