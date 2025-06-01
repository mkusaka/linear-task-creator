import { LinearClient, Project, Team, User, WorkflowState } from "@linear/sdk";
import { load } from "@/storage";

let clientCache: LinearClient | null = null;

async function getLinearClient(): Promise<LinearClient> {
  if (clientCache) return clientCache;
  
  const apiKey = await load<string>("linearApiKey");
  if (!apiKey) throw new Error("No Linear API key found");
  
  clientCache = new LinearClient({ apiKey });
  return clientCache;
}

export function useLinearProjects(): Promise<Project[]> {
  return getLinearClient().then(client => 
    client.projects().then(p => p.nodes)
  );
}

export function useLinearTeams(): Promise<Team[]> {
  return getLinearClient().then(client => 
    client.teams().then(t => t.nodes)
  );
}

export function useLinearUsers(): Promise<User[]> {
  return getLinearClient().then(client => 
    client.users().then(u => u.nodes)
  );
}

export function useLinearWorkflowStates(): Promise<WorkflowState[]> {
  return getLinearClient().then(client => 
    client.workflowStates().then(ws => ws.nodes)
  );
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
