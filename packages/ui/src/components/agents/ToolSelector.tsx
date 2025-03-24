import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

export type AgentTool = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requiresConfig?: boolean;
  configSchema?: Record<string, unknown>;
};

type ToolSelectorProps = {
  availableTools: AgentTool[];
  selectedTools: AgentTool[];
  onSelectTool: (toolId: string) => void;
  onRemoveTool: (toolId: string) => void;
  onReorderTools?: (toolIds: string[]) => void;
  onConfigureTool?: (toolId: string, config: Record<string, unknown>) => void;
};

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  availableTools,
  selectedTools,
  onSelectTool,
  onRemoveTool,
  onConfigureTool,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Available Tools</h3>
        <div className="space-y-2">
          {availableTools
            .filter(
              (tool) =>
                !selectedTools.some((selected) => selected.id === tool.id),
            )
            .map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => onSelectTool(tool.id)}
                actionType="add"
              />
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Selected Tools</h3>
        <div className="space-y-2">
          {selectedTools.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No tools selected. Add tools from the available list.
            </p>
          ) : (
            selectedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => onRemoveTool(tool.id)}
                actionType="remove"
                onConfigure={
                  tool.requiresConfig && onConfigureTool
                    ? () => onConfigureTool(tool.id, {})
                    : undefined
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

type ToolCardProps = {
  tool: AgentTool;
  onClick: () => void;
  actionType: "add" | "remove";
  onConfigure?: () => void;
};

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  actionType,
  onConfigure,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{tool.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {tool.description}
            </p>
            {tool.requiresConfig && (
              <Badge variant="outline" className="mt-2">
                Requires Configuration
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant={actionType === "add" ? "default" : "destructive"}
              size="sm"
              onClick={onClick}
            >
              {actionType === "add" ? "Add" : "Remove"}
            </Button>

            {onConfigure && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigure();
                }}
              >
                Configure
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
