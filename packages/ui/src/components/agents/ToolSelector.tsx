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
  const availableToolsFiltered = availableTools.filter(
    (tool) => !selectedTools.some((selected) => selected.id === tool.id),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Available Tools</h3>
          <Badge variant="outline" className="text-xs">
            {availableToolsFiltered.length} available
          </Badge>
        </div>

        {availableToolsFiltered.length === 0 ? (
          <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
            All available tools have been added
          </div>
        ) : (
          <div className="space-y-3">
            {availableToolsFiltered.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => onSelectTool(tool.id)}
                actionType="add"
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Selected Tools</h3>
          <Badge variant="secondary" className="text-xs">
            {selectedTools.length} selected
          </Badge>
        </div>

        {selectedTools.length === 0 ? (
          <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center">
            <div className="mb-2 opacity-50">No tools selected</div>
            <div className="text-xs max-w-md">
              Add tools from the available list to enhance your agent's
              capabilities
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTools.map((tool) => (
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
            ))}
          </div>
        )}
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
  // Map icon strings to emoji representations if no icon component is available
  const iconMap: Record<string, string> = {
    search: "🔍",
    "file-text": "📄",
    calculator: "🧮",
    code: "💻",
    cloud: "☁️",
    "bar-chart": "📊",
  };

  const icon = tool.icon ? iconMap[tool.icon] || "🔧" : "🔧";

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${
        actionType === "remove" ? "border-primary/20 bg-primary/5" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="text-xl mt-1">{icon}</div>
            <div>
              <h4 className="font-medium flex items-center gap-2">
                {tool.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {tool.description}
              </p>
              {tool.requiresConfig && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Requires Configuration
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant={actionType === "add" ? "default" : "destructive"}
              size="sm"
              onClick={onClick}
              className="min-w-20"
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
                className="min-w-20"
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
