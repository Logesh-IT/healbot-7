
export enum Severity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  CRITICAL = 'CRITICAL'
}

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface DiseasePrediction {
  name: string;
  confidence: number;
  severity: Severity;
  description: string;
  causes: string[];
  precautions: string[];
  specialist: string;
  medications: string[];
  workouts: string[];
  diets: string[];
  matchedSymptoms: { name: string; category: string; weight: number }[];
}

export interface UserHealthProfile {
  name: string;
  email: string;
  patientId: string;
  age: number;
  gender: string;
  allergies: string[];
  history: string[];
  lastPeriod?: string;
}

export interface User {
  patientId: string;
  username: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  securityQuestion: string;
  securityAnswer: string;
  role: UserRole;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  prediction?: DiseasePrediction;
  isEmergency?: boolean;
  groundingUrls?: { title: string; uri: string }[];
  visualData?: any[];
  image?: string; 
}

export enum Language {
  EN = 'en',
  TA = 'ta',
  HI = 'hi',
  ES = 'es',
  AR = 'ar'
}

export interface InsurancePlan {
  id: string;
  name: string;
  type: 'Individual' | 'Family' | 'Senior' | 'Critical';
  premium: number;
  coverage: string;
  benefits: string[];
  waitingPeriod: string;
  taxBenefit: string;
}

export interface InsuranceRequest {
  id: string;
  planId: string;
  planName: string;
  userName: string;
  userEmail: string;
  premium: number;
  status: 'Submitted' | 'Processing' | 'Active';
  timestamp: string;
}
