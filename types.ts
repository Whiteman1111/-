
export enum Mood {
  PEACE = 'طمأنينة',
  PATIENCE = 'صبر',
  HOPE = 'أمل',
  TRUST = 'توكل',
  STRENGTH = 'قوة',
  COMFORT = 'راحة',
  RELIEF = 'تفريج هم'
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
  view: 'home' | 'loading' | 'result';
  currentMessage: QuranicMessage | null;
  settings: {
    quietMode: boolean;
    minimalEffects: boolean;
  };
}
