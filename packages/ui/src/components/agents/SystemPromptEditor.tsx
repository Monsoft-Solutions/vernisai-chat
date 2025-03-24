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

  const characterCount = value.length;
  const isLongPrompt = characterCount > 2000;
  const maxRecommendedLength = 4000;

  // Calculate what percentage of the max recommended length we've used
  const percentUsed = Math.min(
    100,
    (characterCount / maxRecommendedLength) * 100,
  );

  // Determine color based on percentage
  let progressColor = "bg-green-500";
  if (percentUsed > 80) progressColor = "bg-yellow-500";
  if (percentUsed > 95) progressColor = "bg-red-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="system-prompt"
          className="text-gray-700 flex items-center gap-2"
        >
          System Prompt <span className="text-red-500">*</span>
          <span className="text-xs text-muted-foreground font-normal">
            (Instructions for how the agent should behave)
          </span>
        </Label>
        {onRequestSuggestions && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRequestSuggestions}
            type="button"
            className="group"
          >
            <span className="mr-1 text-base group-hover:animate-pulse">✨</span>
            Get Suggestions
          </Button>
        )}
      </div>

      <div className="relative">
        <Textarea
          id="system-prompt"
          value={value}
          onChange={handleChange}
          className={`font-mono text-sm resize-none ${!value ? "border-red-200 focus-visible:ring-red-400" : ""}`}
          placeholder="You are a helpful AI assistant that..."
          style={{ minHeight: `${height}px` }}
        />

        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
          {characterCount}/{maxRecommendedLength}
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300`}
          style={{ width: `${percentUsed}%` }}
        ></div>
      </div>

      {!value && (
        <p className="text-xs text-red-500 mt-1">System prompt is required</p>
      )}

      {isLongPrompt && (
        <p className="text-xs text-yellow-500 mt-1">
          Long prompts may affect performance. Consider being more concise.
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2 text-gray-700">
            Prompt Suggestions
          </h4>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-secondary/10 hover:bg-secondary/20 rounded-md text-sm cursor-pointer transition-colors border border-secondary/20"
                onClick={() => onChange(suggestion)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs">
                    Suggestion {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(suggestion);
                    }}
                  >
                    Use This
                  </Button>
                </div>
                <div className="text-muted-foreground">
                  {suggestion.length > 150
                    ? `${suggestion.slice(0, 150)}...`
                    : suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded-md">
        <p className="font-medium mb-1">Tips for effective prompts:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Be specific about the agent's role, knowledge, and tone</li>
          <li>
            Define clear boundaries for what the agent should and shouldn't do
          </li>
          <li>Include examples of desired responses when helpful</li>
          <li>Keep the prompt concise while providing necessary context</li>
        </ul>
      </div>
    </div>
  );
};
