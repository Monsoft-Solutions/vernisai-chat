import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

export type Model = {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextLength: number;
  costPerRequest?: number;
};

type ModelSelectorProps = {
  models: Model[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModelId,
  onSelectModel,
}) => {
  const handleValueChange = (value: string) => {
    onSelectModel(value);
  };

  const selectedModel = models.find((model) => model.id === selectedModelId);

  return (
    <div className="space-y-2">
      <Label htmlFor="model-selector">AI Model</Label>
      <Select value={selectedModelId} onValueChange={handleValueChange}>
        <SelectTrigger id="model-selector" className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{model.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {model.provider}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedModel && (
        <div className="mt-3 text-sm">
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedModel.capabilities.map((capability) => (
              <Badge key={capability} variant="secondary" className="text-xs">
                {capability}
              </Badge>
            ))}
          </div>
          <div className="text-muted-foreground">
            <div>
              Context Length: {selectedModel.contextLength.toLocaleString()}{" "}
              tokens
            </div>
            {selectedModel.costPerRequest && (
              <div>
                Cost: ${selectedModel.costPerRequest.toFixed(4)} per 1K tokens
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
