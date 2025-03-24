import { cn } from "../../lib/utils";
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
  return (
    <div className={cn("flex flex-col p-4", className)}>
      {/* Agent information */}
      {agentName && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text-primary">
            {agentName}
          </h3>
          {agentDescription && (
            <p className="mt-1 text-sm text-text-secondary">
              {agentDescription}
            </p>
          )}
        </div>
      )}

      {/* Tools section */}
      {tools.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-text-primary">
            Available Tools
          </h3>
          <div className="space-y-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-md border border-border-default p-2"
              >
                <div className="flex items-center">
                  {tool.icon && (
                    <span className="mr-2 text-text-tertiary">{tool.icon}</span>
                  )}
                  <h4 className="text-sm font-medium text-text-primary">
                    {tool.name}
                  </h4>
                </div>
                {tool.description && (
                  <p className="mt-1 text-xs text-text-secondary">
                    {tool.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References section - to be implemented */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">
          References
        </h3>
        <p className="text-sm text-text-tertiary">No references available</p>
      </div>
    </div>
  );
}
