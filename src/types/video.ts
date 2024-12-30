export interface Video {
  id: string;
  url: string;
  title: string;
  description?: string;
  subtitles?: string;
  createdAt: number;
}

export interface VideoFormData {
  url: string;
  title: string;
  description?: string;
  subtitles?: File;
}