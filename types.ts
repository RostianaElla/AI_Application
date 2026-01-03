
export type Gender = 'Female' | 'Male' | 'Other';
export type WorkoutFrequency = '0-2' | '3-5' | '6+';
export type ReferralSource = 'TikTok' | 'YouTube' | 'Instagram' | 'Google' | 'Play Store' | 'Facebook' | 'Other';
export type Goal = 'Lose Weight' | 'Maintain' | 'Gain Weight';
export type DietType = 'classic' | 'Pescatarian' | 'vegetarian' | 'Vegan';
export type Speed = 'Koala' | 'Rabbit' | 'Puma';

export interface GoogleProfile {
  name: string;
  email: string;
  picture: string;
}

export interface UserData {
  gender?: Gender;
  workoutFrequency?: WorkoutFrequency;
  referralSource?: ReferralSource;
  triedOtherApps?: boolean;
  height?: number; // cm
  weight?: number; // kg
  birthDate?: string;
  goal?: Goal;
  desiredWeight?: number;
  speed?: Speed;
  obstacles?: string[];
  diet?: DietType;
  accomplishments?: string[];
  referralCode?: string;
  isRegistered?: boolean;
  googleProfile?: GoogleProfile;
}

export type View = 'LOGIN' | 'ONBOARDING' | 'DASHBOARD';
