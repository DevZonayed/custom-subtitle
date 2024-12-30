import { Video } from '../types/video';

const STORAGE_KEY = 'video_platform_videos';

export const getVideos = (): Video[] => {
  const videos = localStorage.getItem(STORAGE_KEY);
  return videos ? JSON.parse(videos) : [];
};

export const saveVideo = (video: Video): void => {
  const videos = getVideos();
  videos.push(video);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};

export const updateVideo = (updatedVideo: Video): void => {
  const videos = getVideos();
  const index = videos.findIndex((v) => v.id === updatedVideo.id);
  if (index !== -1) {
    videos[index] = updatedVideo;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }
};

export const deleteVideo = (id: string): void => {
  const videos = getVideos();
  const filteredVideos = videos.filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredVideos));
};