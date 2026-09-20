import type { AppRole, CaseStatus, CaseUrgency, RequestStatus, VerificationStatus } from "./nyaysetu";

export interface Party {
  role: string;
  name: string;
}

export interface CaseRecord {
  id: string;
  case_number: string;
  filing_number: string | null;
  title: string;
  description: string | null;
  category: string;
  urgency: CaseUrgency;
  status: CaseStatus;
  court: string | null;
  parties: Party[];
  citizen_id: string | null;
  assigned_lawyer_id: string | null;
  assigned_lawyer_profile_id?: string | null;
  is_demo: boolean;
  filed_on: string | null;
  next_hearing: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  file_name: string;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number;
  page_count: number | null;
  ocr_text: string | null;
  created_at: string;
}

export interface ExtractedFact {
  label: string;
  value: string;
  source: string;
  confidence: number;
}

export interface KeyDate {
  date: string;
  event: string;
  source: string;
}

export interface LegalInsight {
  heading: string;
  detail: string;
  source: string;
}

export interface SimilarCase {
  case_number: string;
  title: string;
  court: string;
  outcome: string;
  similarity: number;
}

export interface PrecedentRef {
  citation: string;
  title: string;
  holding: string;
  relevance: string;
}

export interface CaseAnalysis {
  id: string;
  case_id: string;
  summary: string;
  category: string | null;
  urgency: CaseUrgency | null;
  urgency_reason: string | null;
  extracted_facts: ExtractedFact[];
  key_dates: KeyDate[];
  parties: Party[];
  legal_insights: LegalInsight[];
  similar_cases: SimilarCase[];
  precedents: PrecedentRef[];
  recommended_specializations: string[];
  model: string | null;
  created_at: string;
}

export interface LawyerProfile {
  id: string;
  user_id: string | null;
  full_name: string;
  specializations: string[];
  experience_years: number;
  cases_handled: number;
  success_rate: number;
  bar_council_id: string | null;
  court: string | null;
  city: string | null;
  languages: string[];
  bio: string | null;
  consultation_fee: number;
  is_available: boolean;
  rating: number;
}

export interface CaseRequest {
  id: string;
  case_id: string;
  lawyer_id: string | null;
  lawyer_profile_id: string | null;
  citizen_id: string | null;
  status: RequestStatus;
  note: string | null;
  created_at: string;
  lawyer?: LawyerProfile | null;
}

export interface CaseMessage {
  id: string;
  case_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: AppRole;
  body: string;
  attachment_name: string | null;
  attachment_path: string | null;
  created_at: string;
}

export interface Hearing {
  id: string;
  case_id: string | null;
  case_number: string;
  court: string;
  court_room: string | null;
  judge_name: string | null;
  party_name: string | null;
  hearing_date: string;
  hearing_time: string | null;
  purpose: string | null;
  status: string;
  item_no: number | null;
}

export interface Precedent {
  id: string;
  citation: string;
  title: string;
  court: string;
  year: number;
  category: string;
  holding: string;
  relevance_note: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string | null;
  kind: string;
  case_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Me {
  userId: string;
  email: string | null;
  phone: string | null;
  profile: {
    full_name: string;
    email: string | null;
    phone: string | null;
    city: string | null;
  } | null;
  role: AppRole | null;
  verification: VerificationStatus | null;
  credentialId: string | null;
  advocateCode: string | null;
  isAdmin: boolean;
  phoneVerified: boolean;
  lawyerProfile: LawyerProfile | null;
}

