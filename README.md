# Video Platform

A React.js-based video platform with admin and public views for managing and playing YouTube videos with subtitle support.

## Features

- Admin Section:
  - Add, edit, and delete videos
  - YouTube URL validation
  - Subtitle file upload support (.srt, .vtt)
  - Video metadata management

- Public Section:
  - List all available videos
  - Custom video player with:
    - Play/Pause control
    - Volume control
    - Progress bar with seek functionality
    - Playback speed options
    - Subtitle toggle
    - Fullscreen mode

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Admin Section (/admin)

1. Navigate to `/admin`
2. Use the form to add new videos:
   - Enter a valid YouTube URL
   - Provide a title
   - Optionally add a description
   - Upload subtitle files (.srt or .vtt format)
3. Manage existing videos:
   - Edit video details
   - Delete videos

### Public Section (/public)

1. Navigate to `/public`
2. Browse available videos
3. Use the custom video player to:
   - Control playback
   - Adjust volume
   - Toggle subtitles
   - Change playback speed
   - Enter fullscreen mode

## Technical Details

- Built with React 18+
- Uses React Router for navigation
- Implements React Hooks
- Utilizes localStorage for data persistence
- Responsive design with Tailwind CSS
- Cross-browser compatible

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request# custom-subtitle
