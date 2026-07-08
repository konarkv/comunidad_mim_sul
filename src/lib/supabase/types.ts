// Hand-written types mirroring supabase/migrations/0001_init.sql.
// (If you later run `supabase gen types typescript`, replace this file.)

export type Role =
  | "presidente"
  | "miembro_junta"
  | "vecino"
  | "administrador";

export type PostKind = "aviso" | "mensaje";
export type ProposalStatus = "abierta" | "cerrada";
export type VoteChoice = "si" | "no" | "abstencion";

export interface AccessRequest {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  dwellings: number | null;
  plan_interest: string | null;
  wants_call: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  dwellings: number | null;
  join_code: string;
  created_by: string;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: Role;
  created_at: string;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  kind: PostKind;
  title: string | null;
  body: string;
  created_at: string;
}

export interface Proposal {
  id: string;
  community_id: string;
  author_id: string;
  title: string;
  description: string | null;
  status: ProposalStatus;
  created_at: string;
  closed_at: string | null;
}

export interface Vote {
  id: string;
  proposal_id: string;
  user_id: string;
  choice: VoteChoice;
  created_at: string;
  updated_at: string;
}

export interface Acta {
  id: string;
  community_id: string;
  proposal_id: string | null;
  title: string;
  body: string | null;
  result_si: number;
  result_no: number;
  result_abstencion: number;
  decided_at: string;
  created_at: string;
}

// Minimal shape the @supabase/ssr generic expects. We keep table row types
// loose (using the interfaces above at call sites) to stay lightweight.
export type Database = {
  public: {
    Tables: {
      access_requests: {
        Row: AccessRequest;
        Insert: Partial<AccessRequest> & { email: string };
        Update: Partial<AccessRequest>;
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      communities: {
        Row: Community;
        Insert: Partial<Community>;
        Update: Partial<Community>;
      };
      community_members: {
        Row: CommunityMember;
        Insert: Partial<CommunityMember>;
        Update: Partial<CommunityMember>;
      };
      posts: {
        Row: Post;
        Insert: Partial<Post> & { community_id: string; body: string };
        Update: Partial<Post>;
      };
      proposals: {
        Row: Proposal;
        Insert: Partial<Proposal> & { community_id: string; title: string };
        Update: Partial<Proposal>;
      };
      votes: {
        Row: Vote;
        Insert: Partial<Vote> & { proposal_id: string; choice: VoteChoice };
        Update: Partial<Vote>;
      };
      actas: {
        Row: Acta;
        Insert: Partial<Acta> & { community_id: string; title: string };
        Update: Partial<Acta>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, unknown>;
    Enums: Record<string, never>;
  };
};
