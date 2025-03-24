import React from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

type SystemPromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
  onRequestSuggestions?: () => void;
  height?: number;
};

export const SystemPromptEditor: React.FC<SystemPromptEditorProps> = ({
  value,
  onChange,
  suggestions = [],
  onRequestSuggestions,
  height = 300,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="system-prompt">System Prompt</Label>
        {onRequestSuggestions && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRequestSuggestions}
            type="button"
          >
            Get Suggestions
          </Button>
        )}
      </div>
      <Textarea
        id="system-prompt"
        value={value}
        onChange={handleChange}
        className="font-mono text-sm"
        placeholder="Enter instructions for how the agent should behave..."
        style={{ minHeight: `${height}px` }}
      />

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Suggestions</h4>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-muted rounded-md text-sm cursor-pointer hover:bg-muted/80"
                onClick={() => onChange(suggestion)}
              >
                {suggestion.length > 150
                  ? `${suggestion.slice(0, 150)}...`
                  : suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-1">
        Be specific about the agent's role, knowledge, tone, and limitations.
      </div>
    </div>
  );
};
