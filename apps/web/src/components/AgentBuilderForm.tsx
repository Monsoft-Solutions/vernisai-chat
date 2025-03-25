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
} from "@vernisai/ui";
import { trpc } from "../utils/trpc";
import type { Tool, TestMessage, AgentTemplate } from "../types/dashboard";

export const AgentBuilderForm: React.FC = () => {
  // Basic information state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Capabilities state
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);

  // Testing state
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Fetch data using tRPC
  const { data: tools, isLoading: isToolsLoading } =
    trpc.dashboard.getTools.useQuery();
  const { data: models, isLoading: isModelsLoading } =
    trpc.dashboard.getModels.useQuery();
  const { data: testMessageData, isLoading: isTestMessagesLoading } =
    trpc.dashboard.getTestMessages.useQuery();
  const { data: templates, isLoading: isTemplatesLoading } =
    trpc.dashboard.getAgentTemplates.useQuery();

  // Set initial test messages when data is loaded
  React.useEffect(() => {
    if (
      testMessageData &&
      testMessageData.length > 0 &&
      testMessages.length === 0
    ) {
      setTestMessages(testMessageData);
    }
  }, [testMessageData, testMessages.length]);

  // Form validation
  const isFormValid = name.trim() && systemPrompt.trim() && selectedModelId;

  // Handle tool selection
  const handleSelectTool = (toolId: string) => {
    const tool = tools?.find((t: Tool) => t.id === toolId);
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
    const userMessage: TestMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setTestMessages([...testMessages, userMessage]);

    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a simulated response to: "${content}"`,
        timestamp: new Date(),
      };

      setTestMessages((prev) => [...prev, assistantMessage]);
      setIsRunningTest(false);
    }, 1500);
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    if (!templates) return;

    const template = templates.find((t: AgentTemplate) => t.id === templateId);
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setSystemPrompt(template.systemPrompt);
      setSelectedModelId(template.model);

      // Set recommended tools
      if (tools) {
        const selectedTools = tools.filter((tool: Tool) =>
          template.recommendedTools.includes(tool.id),
        );
        setSelectedTools(selectedTools);
      }
    }
  };

  // Loading state
  if (
    isToolsLoading ||
    isModelsLoading ||
    isTestMessagesLoading ||
    isTemplatesLoading
  ) {
    return <div className="p-6 text-center">Loading agent builder data...</div>;
  }

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
          {templates?.map((template: AgentTemplate) => (
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
          <Label htmlFor="public" className="font-medium text-sm text-gray-700">
            Make this agent public
          </Label>
          <p className="text-xs text-muted-foreground ml-1">
            Public agents are visible to all members of your organization
          </p>
        </div>
      </InfoCard>

      {/* Agent Capabilities Section */}
      <InfoCard
        title={
          <div className="flex items-center">
            <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 mr-2 text-sm">
              3
            </span>
            Agent Capabilities
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <Label htmlFor="system-prompt" className="text-gray-700 block mb-2">
              System Prompt <span className="text-red-500">*</span>
            </Label>
            <SystemPromptEditor
              value={systemPrompt}
              onChange={setSystemPrompt}
            />
            {!systemPrompt && (
              <p className="text-xs text-red-500 mt-1">
                System prompt is required
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              The system prompt establishes your agent's role, capabilities, and
              constraints.
            </p>
          </div>

          <div>
            <Label htmlFor="model" className="text-gray-700 block mb-2">
              Model <span className="text-red-500">*</span>
            </Label>
            <div className="bg-muted/10 rounded-md p-5 border border-muted">
              <ModelSelector
                models={models || []}
                selectedModelId={selectedModelId}
                onSelectModel={setSelectedModelId}
              />
              {!selectedModelId && (
                <p className="text-xs text-red-500 mt-1">
                  Model selection is required
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="tools" className="text-gray-700 block mb-2">
              Tools
            </Label>
            <div className="bg-muted/10 rounded-md p-5 border border-muted">
              <ToolSelector
                availableTools={tools || []}
                selectedTools={selectedTools}
                onSelectTool={handleSelectTool}
                onRemoveTool={handleRemoveTool}
              />
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Testing Section */}
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
        <div className="bg-muted/10 rounded-lg border border-muted p-4">
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
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button disabled={!isFormValid}>Create Agent</Button>
      </div>
    </div>
  );
};
