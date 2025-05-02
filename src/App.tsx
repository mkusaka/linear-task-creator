// src/popup/App.tsx
import { useState, useEffect } from "react";
import { LinearClient, Project, Team, User } from "@linear/sdk";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { load, save } from "@/storage";

export function App() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [apiKey, setApiKey] = useState<string>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState<string>();
  const [projectId, setProjectId] = useState<string>();
  const [assigneeId, setAssigneeId] = useState<string>();

  // Load current tab
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.url) setUrl(tab.url);
      if (tab?.title) setTitle(tab.title);
    });
  }, []);

  // Load API key & last selections
  useEffect(() => {
    load<string>("linearApiKey").then(setApiKey);
    load<string>("lastProjectId").then(setProjectId);
    load<string>("lastAssigneeId").then(setAssigneeId);
  }, []);

  // Fetch projects & users once we have an API key
  useEffect(() => {
    if (!apiKey) return;
    const client = new LinearClient({ apiKey });
    client.viewer.then((me) => {
      return me.teams().then((t) => setTeams(t.nodes));
    });
    client.teams().then((t) => setTeams(t.nodes));
    client.projects().then((p) => setProjects(p.nodes));
    client.users().then((u) => setUsers(u.nodes));
  }, [apiKey]);

  const createIssue = async () => {
    if (!apiKey || !projectId || !teamId) return;
    const client = new LinearClient({ apiKey });
    await client.createIssue({
      teamId,
      title: title,
      description: `URL: ${url}`,
      projectId,
      assigneeId,
    });
    save("lastProjectId", projectId);
    save("lastAssigneeId", assigneeId);
    // Optionally show a toast here…
  };

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

      <Button
        onClick={createIssue}
        disabled={!apiKey || !projectId || !teamId}
      >
        Create Issue
      </Button>
    </div>
  );
}

export default App;