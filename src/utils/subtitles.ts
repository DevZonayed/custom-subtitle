export const createSubtitleTrack = (srtContent: string = '', language = 'en') => {
    // Handle Unicode characters properly
    const encoder = new TextEncoder();
    const bytes = encoder.encode(srtContent);
    const base64Content = btoa(String.fromCharCode(...bytes));
    const subtitleUrl = `data:text/srt;base64,${base64Content}`;
    //   console.log(subtitleUrl)

    return [{
        // src: subtitleUrl,
        src: "http://localhost:5173/subtitles/bn.srt",
        label: 'Bangla',
        language: 'bn'
    }];
};