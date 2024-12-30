import React, { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { VideoFormData } from '../types/video';

interface Props {
  onSubmit: (data: VideoFormData) => void;
  initialData?: VideoFormData;
}

export const VideoForm = ({ onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState<VideoFormData>(
    initialData || {
      url: '',
      title: '',
      description: '',
    }
  );
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, subtitles: subtitleFile || undefined });
  };

  const validateYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          YouTube URL
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subtitles (.srt or .vtt)
        </label>
        <div className="mt-1 flex items-center">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Upload className="w-4 h-4 mr-2" />
              Choose file
            </span>
            <input
              type="file"
              className="sr-only"
              accept=".srt,.vtt"
              onChange={(e) =>
                setSubtitleFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </label>
          {subtitleFile && (
            <span className="ml-3 text-sm text-gray-600">
              {subtitleFile.name}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Video
      </button>
    </form>
  );
};