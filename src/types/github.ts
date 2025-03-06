export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  owner: {
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    url: string;
  };
  private: boolean;
  updated_at?: string | null;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string | null | undefined;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

export interface WorkflowRun {
  id: number;
  node_id: string;
  name?: string | null;
  head_branch: string | null;
  head_sha: string;
  run_number: number;
  event: string;
  status: string | null;
  conclusion: string | null;
  workflow_id: number;
  check_suite_id?: number;
  check_suite_node_id?: string;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at?: string;
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  previous_attempt_url?: string | null;
  workflow_url: string;
  display_title?: string;
  repository: {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
  };
  head_commit?: {
    id: string;
    tree_id?: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
    } | null;
    committer?: {
      name: string;
      email: string;
    } | null;
  } | null;
  actor?: {
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id?: string | null;
    url: string;
    html_url: string;
    type?: string;
    site_admin?: boolean;
  };
} 