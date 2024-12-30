import React from "react";
import { getVideos } from "../utils/storage";
import { VideoPlayer } from "../components/VideoPlayer";
import { createSubtitleTrack } from "../utils/subtitles";

export const PublicPage = () => {
  const videos = getVideos();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Video Library</h1>
      <div className="grid gap-12">
        {videos.map((video) => (
          <div key={video.id} className="space-y-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {video.title}
              </h2>
              {video.description && (
                <p className="text-gray-600 mb-4">{video.description}</p>
              )}
              <div className="w-full rounded-lg overflow-hidden shadow-lg">
                <VideoPlayer
                  url={video.url}
                  subtitles={
                    // createSubtitleTrack(video.subtitles, "bn")
                    // createSubtitleTrack('bn', "bn")
                    [{
                        label: "Bangla",
                        language: "bn",
                        content: video.subtitles,
                    }]
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No videos available. Add some videos in the admin section.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
