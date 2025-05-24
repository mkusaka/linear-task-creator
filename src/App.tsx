// src/popup/App.tsx
import { useState, useEffect } from "react";
import { LinearClient, Project, Team, User, WorkflowState } from "@linear/sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { load, save } from "@/storage";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Loader2 } from "lucide-react";

export function App() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([]);
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
    load<string>("linearApiKey").then(val => val !== undefined ? setApiKey(val) : null);
    load<string>("lastProjectId").then(val => val !== undefined ? setProjectId(val) : null);
    load<string>("lastAssigneeId").then(val => val !== undefined ? setAssigneeId(val) : null);
    load<string>("lastTeamId").then(val => val !== undefined ? setTeamId(val) : null);
    load<string>("lastStateId").then(val => val !== undefined ? setStateId(val) : null);
  }, []);

  // Fetch projects, users & workflow states once we have an API key
  useEffect(() => {
    if (!apiKey) return;
    const client = new LinearClient({ apiKey });
    client.viewer.then((me) => {
      return me.teams().then((t) => setTeams(t.nodes));
    });
    client.teams().then((t) => setTeams(t.nodes));
    client.projects().then((p) => setProjects(p.nodes));
    client.users().then((u) => setUsers(u.nodes));
    client.workflowStates().then((ws) => setWorkflowStates(ws.nodes));
  }, [apiKey]);

  const createIssue = async () => {
    if (!apiKey || !projectId || !teamId) return;
    setIsCreating(true);
    const client = new LinearClient({ apiKey });
    try {
      await client.createIssue({
        teamId,
        title: title,
        description: `URL: ${url}`,
        projectId,
        assigneeId: assigneeId || undefined,
        stateId: stateId || undefined,
      });
      save("lastProjectId", projectId);
      save("lastAssigneeId", assigneeId);
      save("lastTeamId", teamId);
      save("lastStateId", stateId);
      toast.success("Issue created!");
    } catch {
      toast.error("Failed to create issue");
    } finally {
      setIsCreating(false);
    }
  };

  if (!apiKey) {
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

      {/* Project Selector */}
      <div>
        <label className="block mb-1">Project</label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a project…" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assignee Selector */}
      <div>
        <label className="block mb-1">Assignee</label>
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an assignee…" />
          </SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Team Selector */}
      <div>
        <label className="block mb-1">Team</label>
        <Select value={teamId} onValueChange={setTeamId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a team…" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Selector */}
      <div>
        <label className="block mb-1">Status</label>
        <Select value={stateId} onValueChange={setStateId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a status…" />
          </SelectTrigger>
          <SelectContent>
            {workflowStates.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
