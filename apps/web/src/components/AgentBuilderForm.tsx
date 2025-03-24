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

  // Form validation
  const isFormValid = name.trim() && systemPrompt.trim() && selectedModelId;

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
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Form Progress Indicator */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Agent
          </h2>
          <div className="text-sm text-muted-foreground">
            {isFormValid ? "Ready to publish" : "Complete required fields"}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${[
                name ? 25 : 0,
                systemPrompt ? 25 : 0,
                selectedModelId ? 25 : 0,
                selectedTools.length > 0 ? 25 : 0,
              ].reduce((a, b) => a + b, 0)}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h2 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
          <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-2 text-sm">
            1
          </span>
          Start with a Template (Optional)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAgentTemplates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-md p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${
                name === template.name
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : ""
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Information Section */}
      <InfoCard
        title={
          <div className="flex items-center">
            <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-2 text-sm">
              2
            </span>
            Basic Information
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name" className="text-gray-700">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter agent name"
              className={`${!name && "border-red-200 focus-visible:ring-red-400"}`}
            />
            {!name && (
              <p className="text-xs text-red-500 mt-1">Name is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent does"
            />
            <p className="text-xs text-muted-foreground">
              A brief description helps users understand what the agent does
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-6 py-2 px-3 bg-muted/20 rounded-md">
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <div>
            <Label htmlFor="public" className="text-gray-700 cursor-pointer">
              Make this agent available to all organization members
            </Label>
            <p className="text-xs text-muted-foreground">
              When enabled, all members of your organization can view and use
              this agent
            </p>
          </div>
        </div>
      </InfoCard>

      {/* Capabilities Section */}
      <InfoCard
        title={
          <div className="flex items-center">
            <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-2 text-sm">
              3
            </span>
            Capabilities
          </div>
        }
      >
        <div className="space-y-8">
          <div className="bg-muted/10 rounded-md p-5 border border-muted">
            <SystemPromptEditor
              value={systemPrompt}
              onChange={setSystemPrompt}
              onRequestSuggestions={() => console.log("Request suggestions")}
            />
            {!systemPrompt && (
              <p className="text-xs text-red-500 mt-1">
                System prompt is required
              </p>
            )}
          </div>

          <div className="bg-muted/10 rounded-md p-5 border border-muted">
            <ModelSelector
              models={mockModels}
              selectedModelId={selectedModelId}
              onSelectModel={setSelectedModelId}
            />
            {!selectedModelId && (
              <p className="text-xs text-red-500 mt-1">Please select a model</p>
            )}
          </div>

          <div className="bg-muted/10 rounded-md p-5 border border-muted">
            <h3 className="text-base font-medium mb-4 text-gray-700">
              Agent Tools
            </h3>
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
      <InfoCard
        title={
          <div className="flex items-center">
            <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-2 text-sm">
              4
            </span>
            Test Your Agent
          </div>
        }
      >
        <div className="bg-muted/10 rounded-md p-5 border border-muted">
          <TestInterface
            messages={testMessages}
            onSendMessage={handleSendMessage}
            isRunning={isRunningTest}
            onStopTest={() => setIsRunningTest(false)}
            onClearConversation={() => setTestMessages([])}
          />
        </div>
      </InfoCard>

      {/* Action Buttons */}
      <div className="sticky bottom-6 bg-white p-4 rounded-md shadow-md border flex justify-between items-center z-10">
        <div className="text-sm text-muted-foreground">
          {isFormValid
            ? "Your agent is ready to be published"
            : "Please complete all required fields marked with *"}
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button
            disabled={!isFormValid}
            className={isFormValid ? "animate-pulse" : ""}
          >
            Publish Agent
          </Button>
        </div>
      </div>
    </div>
  );
};
