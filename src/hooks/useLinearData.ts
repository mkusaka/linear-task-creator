import { LinearClient, Project, Team, User, WorkflowState } from "@linear/sdk";
import { load } from "@/storage";

let clientCache: LinearClient | null = null;
let projectsPromiseCache: Promise<Project[]> | null = null;
let teamsPromiseCache: Promise<Team[]> | null = null;
let usersPromiseCache: Promise<User[]> | null = null;
let workflowStatesPromiseCache: Promise<WorkflowState[]> | null = null;

async function getLinearClient(): Promise<LinearClient> {
  if (clientCache) return clientCache;
  
  const apiKey = await load<string>("linearApiKey");
  if (!apiKey) throw new Error("No Linear API key found");
  
  clientCache = new LinearClient({ apiKey });
  return clientCache;
}

export function useLinearProjects(): Promise<Project[]> {
  if (!projectsPromiseCache) {
    projectsPromiseCache = getLinearClient().then(client => 
      client.projects().then(p => p.nodes)
    );
  }
  return projectsPromiseCache;
}

export function useLinearTeams(): Promise<Team[]> {
  if (!teamsPromiseCache) {
    teamsPromiseCache = getLinearClient().then(client => 
      client.teams().then(t => t.nodes)
    );
  }
  return teamsPromiseCache;
}

export function useLinearUsers(): Promise<User[]> {
  if (!usersPromiseCache) {
    usersPromiseCache = getLinearClient().then(client => 
      client.users().then(u => u.nodes)
    );
  }
  return usersPromiseCache;
}

export function useLinearWorkflowStates(): Promise<WorkflowState[]> {
  if (!workflowStatesPromiseCache) {
    workflowStatesPromiseCache = getLinearClient().then(client => 
      client.workflowStates().then(ws => ws.nodes)
    );
  }
  return workflowStatesPromiseCache;
}

export function useAutoSelection<T extends { id: string }>(
  items: T[],
  currentValue: string,
  setValue: (value: string) => void
) {
  if (items.length === 1 && !currentValue) {
    setValue(items[0].id);
  }
}
