// src/popup/App.tsx
import { useState, useEffect } from "react";
import { LinearClient } from "@linear/sdk";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { load, save } from "@/storage";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Loader2 } from "lucide-react";
import { 
  ProjectSelector, 
  TeamSelector, 
  UserSelector, 
  WorkflowStateSelector 
} from "@/components/LinearSelectors";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type ApiKeyState = 'init' | 'loading' | 'success' | 'failed';

export function App() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyState, setApiKeyState] = useState<ApiKeyState>('init');
  const [teamId, setTeamId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  // Load current tab
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.url) setUrl(tab.url);
      if (tab?.title) {
        setTitle(tab.title);
        setDescription(`URL: ${tab.url}`);
      }
    });
  }, []);

  // Load API key & last selections
  useEffect(() => {
    setApiKeyState('loading');
    load<string>("linearApiKey").then(val => {
      if (val !== undefined && val !== '') {
        setApiKey(val);
        setApiKeyState('success');
      } else {
        setApiKeyState('failed');
      }
    });
    load<string>("lastProjectId").then(val => val !== undefined ? setProjectId(val) : null);
    load<string>("lastAssigneeId").then(val => val !== undefined ? setAssigneeId(val) : null);
    load<string>("lastTeamId").then(val => val !== undefined ? setTeamId(val) : null);
    load<string>("lastStateId").then(val => val !== undefined ? setStateId(val) : null);
  }, []);



  const createIssue = async () => {
    if (!apiKey || !projectId || !teamId) return;
    setIsCreating(true);
    const client = new LinearClient({ apiKey });
    try {
      const issue = await client.createIssue({
        teamId,
        title: title,
        description: `URL: ${url}`,
        projectId,
        assigneeId: assigneeId || undefined,
        stateId: stateId || undefined,
      });
      
      // Get the created issue data
      const createdIssue = await issue.issue;
      const identifier = createdIssue?.identifier;
      
      // Copy identifier to clipboard
      if (identifier) {
        try {
          await navigator.clipboard.writeText(identifier);
          toast.success(`Issue ${identifier} created and copied to clipboard!`);
        } catch (clipboardError) {
          console.error("Failed to copy to clipboard:", clipboardError);
          toast.success(`Issue ${identifier} created!`);
        }
      } else {
        toast.success("Issue created!");
      }
      
      save("lastProjectId", projectId);
      save("lastAssigneeId", assigneeId);
      save("lastTeamId", teamId);
      save("lastStateId", stateId);
    } catch {
      toast.error("Failed to create issue");
    } finally {
      setIsCreating(false);
    }
  };

  if (apiKeyState === 'init' || apiKeyState === 'loading') {
    return (
      <div className="p-4 space-y-3 w-80">
        <h2 className="text-xl">New Linear Task</h2>
        <div className="text-center py-8">
          <Loader2 className="animate-spin w-8 h-8 mx-auto text-gray-400" />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  if (apiKeyState === 'failed') {
    return (
      <div className="p-4 space-y-3 w-80">
        <h2 className="text-xl">New Linear Task</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Linear API key is not set.
          </p>
          <Button
            onClick={() => {
              chrome.runtime.openOptionsPage();
            }}
          >
            Go to Settings
          </Button>
        </div>
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 w-80">
      <h2 className="text-xl">New Linear Task</h2>

      <ErrorBoundary>
        <div>
          <label className="block mb-1">Project</label>
          <ProjectSelector value={projectId} onValueChange={setProjectId} />
        </div>

        <div>
          <label className="block mb-1">Assignee</label>
          <UserSelector value={assigneeId} onValueChange={setAssigneeId} />
        </div>

        <div>
          <label className="block mb-1">Team</label>
          <TeamSelector value={teamId} onValueChange={setTeamId} />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <WorkflowStateSelector value={stateId} onValueChange={setStateId} />
        </div>
      </ErrorBoundary>

      <div>
        <label className="block mb-1">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
        />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Issue description"
          rows={4}
        />
      </div>

      <Button onClick={createIssue} disabled={!apiKey || !projectId || !teamId || isCreating} className="flex items-center gap-2">
        {isCreating && <Loader2 className="animate-spin w-4 h-4" />}
        Create Issue
      </Button>
      <div className="text-right pt-2">
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            // Chrome標準の拡張機能設定ページを開く
            chrome.runtime.openOptionsPage();
          }}
        >
          Settings
        </Button>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default App;
