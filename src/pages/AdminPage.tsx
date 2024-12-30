import React, { useState } from 'react';
import { VideoForm } from '../components/VideoForm';
import { VideoFormData, Video } from '../types/video';
import { saveVideo, getVideos, deleteVideo, updateVideo } from '../utils/storage';
import { Trash2, Edit } from 'lucide-react';

export const AdminPage = () => {
  const [videos, setVideos] = useState<Video[]>(getVideos());
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const handleSubmit = async (data: VideoFormData) => {
    let subtitlesContent = '';
    if (data.subtitles) {
      subtitlesContent = await data.subtitles.text();
    }

    const video: Video = {
      id: editingVideo?.id || crypto.randomUUID(),
      url: data.url,
      title: data.title,
      description: data.description,
      subtitles: subtitlesContent,
      createdAt: editingVideo?.createdAt || Date.now(),
    };

    if (editingVideo) {
      updateVideo(video);
    } else {
      saveVideo(video);
    }

    setVideos(getVideos());
    setEditingVideo(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideo(id);
      setVideos(getVideos());
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {editingVideo ? 'Edit Video' : 'Add New Video'}
      </h1>
      
      <VideoForm
        onSubmit={handleSubmit}
        initialData={
          editingVideo
            ? {
                url: editingVideo.url,
                title: editingVideo.title,
                description: editingVideo.description,
              }
            : undefined
        }
      />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Saved Videos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <img
                src={`https://img.youtube.com/vi/${video.url.split('v=')[1]}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {video.description}
                  </p>
                )}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};