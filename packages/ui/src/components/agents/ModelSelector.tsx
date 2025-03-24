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

  // Group models by provider
  const modelsByProvider = models.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, Model[]>,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="model-selector"
          className="text-gray-700 flex items-center gap-2"
        >
          AI Model <span className="text-red-500">*</span>
          <span className="text-xs text-muted-foreground font-normal">
            (Select a model that fits your use case)
          </span>
        </Label>
      </div>

      <Select value={selectedModelId} onValueChange={handleValueChange}>
        <SelectTrigger
          id="model-selector"
          className={`w-full ${!selectedModelId ? "border-red-200 focus-visible:ring-red-400" : ""}`}
        >
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {Object.entries(modelsByProvider).map(
            ([provider, providerModels]) => (
              <SelectGroup key={provider}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/30">
                  {provider}
                </div>
                {providerModels.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="py-2 pr-2"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{model.name}</span>
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="ml-2 text-xs">
                          {model.contextLength.toLocaleString()} tokens
                        </Badge>
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ),
          )}
        </SelectContent>
      </Select>

      {!selectedModelId && (
        <p className="text-xs text-red-500 mt-1">Please select an AI model</p>
      )}

      {selectedModel && (
        <div className="mt-4 p-4 bg-muted/10 rounded-md border border-muted">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-base">{selectedModel.name}</h3>
              <div className="text-sm text-muted-foreground">
                {selectedModel.provider}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-sm">Context Length</div>
              <div className="text-sm text-muted-foreground">
                {selectedModel.contextLength.toLocaleString()} tokens
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-medium mb-2">Capabilities</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedModel.capabilities.map((capability) => (
                <Badge key={capability} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>

          {selectedModel.costPerRequest && (
            <div className="text-sm">
              <div className="font-medium mb-1">Pricing</div>
              <div className="text-muted-foreground flex items-center gap-1">
                <span className="text-primary font-medium">
                  ${selectedModel.costPerRequest.toFixed(4)}
                </span>
                <span>per 1K tokens</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Choose a model that balances capabilities with cost for your specific
        use case
      </div>
    </div>
  );
};
