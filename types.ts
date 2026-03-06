
export enum Mood {
  PEACE = 'طمأنينة',
  PATIENCE = 'صبر',
  HOPE = 'أمل',
  TRUST = 'توكل',
  STRENGTH = 'قوة',
  COMFORT = 'راحة',
  RELIEF = 'تفريج هم',
  GUIDANCE = 'هداية'
}

export interface QuranicMessage {
  id: number;
  ayah: string;
  surah: string;
  ayahNumber: number;
  mood: Mood;
  explanation: string;
  wisdom: string;
  audioUrl?: string; // رابط الملف الصوتي للتلاوة
}

export interface AppState {
  view: 'home' | 'loading' | 'result' | 'morning_azkar' | 'evening_azkar' | 'muawwidhat' | 'duas';
  currentMessage: QuranicMessage | null;
  settings: {
    quietMode: boolean;
    minimalEffects: boolean;
  };
}
