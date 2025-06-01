import { use, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { 
  useLinearProjects, 
  useLinearTeams, 
  useLinearUsers, 
  useLinearWorkflowStates,
  useAutoSelection 
} from "@/hooks/useLinearData";

function ProjectSelectorContent({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
}) {
  const projects = use(useLinearProjects());
  useAutoSelection(projects, value, onValueChange);
  
  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
}

function TeamSelectorContent({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
}) {
  const teams = use(useLinearTeams());
  useAutoSelection(teams, value, onValueChange);
  
  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
}

function UserSelectorContent({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
}) {
  const users = use(useLinearUsers());
  useAutoSelection(users, value, onValueChange);
  
  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
}

function WorkflowStateSelectorContent({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
}) {
  const workflowStates = use(useLinearWorkflowStates());
  useAutoSelection(workflowStates, value, onValueChange);
  
  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-2">
    <Loader2 className="animate-spin w-4 h-4 text-gray-400" />
  </div>
);

export function ProjectSelector(props: { value: string; onValueChange: (value: string) => void }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProjectSelectorContent {...props} />
    </Suspense>
  );
}

export function TeamSelector(props: { value: string; onValueChange: (value: string) => void }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TeamSelectorContent {...props} />
    </Suspense>
  );
}

export function UserSelector(props: { value: string; onValueChange: (value: string) => void }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UserSelectorContent {...props} />
    </Suspense>
  );
}

export function WorkflowStateSelector(props: { value: string; onValueChange: (value: string) => void }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WorkflowStateSelectorContent {...props} />
    </Suspense>
  );
}
