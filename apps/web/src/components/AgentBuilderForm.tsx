import React, { useState } from "react";
import {
  InfoCard,
  Input,
  Label,
  Switch,
  Textarea,
  ModelSelector,
  SystemPromptEditor,
  ToolSelector,
  TestInterface,
  Button,
  AgentTool,
} from "@vernisai/ui";
import {
  mockTools,
  mockModels,
  mockTestMessages,
  mockAgentTemplates,
} from "../mock/agentBuilderData";

export const AgentBuilderForm: React.FC = () => {
  // Basic information state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Capabilities state
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedTools, setSelectedTools] = useState<AgentTool[]>([]);

  // Testing state
  const [testMessages, setTestMessages] = useState(mockTestMessages);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Handle tool selection
  const handleSelectTool = (toolId: string) => {
    const tool = mockTools.find((t) => t.id === toolId);
    if (tool) {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  // Handle tool removal
  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter((tool) => tool.id !== toolId));
  };

  // Handle test message sending
  const handleSendMessage = (content: string) => {
    setIsRunningTest(true);

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      timestamp: new Date(),
    };

    setTestMessages([...testMessages, userMessage]);

    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: `This is a simulated response to: "${content}"`,
        timestamp: new Date(),
      };

      setTestMessages((prev) => [...prev, assistantMessage]);
      setIsRunningTest(false);
    }, 1500);
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    const template = mockAgentTemplates.find((t) => t.id === templateId);
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setSystemPrompt(template.systemPrompt);
      setSelectedModelId(template.model);

      // Set recommended tools
      const tools = mockTools.filter((tool) =>
        template.recommendedTools.includes(tool.id),
      );
      setSelectedTools(tools);
    }
  };

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">
          Start with a Template (Optional)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {mockAgentTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-md p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => handleSelectTemplate(template.id)}
            >
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Information Section */}
      <InfoCard title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agent name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-description">Description</Label>
            <Textarea
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent does"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public">
            Make this agent available to all organization members
          </Label>
        </div>
      </InfoCard>

      {/* Capabilities Section */}
      <InfoCard title="Capabilities">
        <div className="space-y-8">
          <SystemPromptEditor
            value={systemPrompt}
            onChange={setSystemPrompt}
            onRequestSuggestions={() => console.log("Request suggestions")}
          />

          <ModelSelector
            models={mockModels}
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
          />

          <div className="mt-8">
            <h3 className="text-base font-medium mb-4">Tools</h3>
            <ToolSelector
              availableTools={mockTools}
              selectedTools={selectedTools}
              onSelectTool={handleSelectTool}
              onRemoveTool={handleRemoveTool}
              onConfigureTool={(toolId, config) =>
                console.log("Configure tool", toolId, config)
              }
            />
          </div>
        </div>
      </InfoCard>

      {/* Test Section */}
      <InfoCard title="Test Your Agent">
        <TestInterface
          messages={testMessages}
          onSendMessage={handleSendMessage}
          isRunning={isRunningTest}
          onStopTest={() => setIsRunningTest(false)}
          onClearConversation={() => setTestMessages([])}
        />
      </InfoCard>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline">Save Draft</Button>
        <Button disabled={!name || !systemPrompt || !selectedModelId}>
          Publish Agent
        </Button>
      </div>
    </div>
  );
};
