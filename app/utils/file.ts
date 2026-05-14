const units = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatFileSize(bytes: number): string {
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return (
    new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 2,
    }).format(value)
    + ' '
    + units[unitIndex]
  );
}

export function getFileExtension(file: File) {
  const name = file.name;

  const lastDot = name.lastIndexOf('.');

  // No extension or hidden file like ".gitignore"
  if (lastDot <= 0) {
    return '';
  }

  return name.slice(lastDot + 1).toLowerCase();
}

/**
 * Generates a thumbnail from a video File object.
 *
 * @param {File} file - The MP4 File object.
 * @returns {Promise<Blob>} A Promise that resolves with the JPEG Blob.
 */
export function generateVideoThumbnail(file: File | Blob, startingQuarter: number) {
  return new Promise<Blob | null>((resolve, reject) => {
    // 1. Create an invisible video element
    const video = document.createElement('video');
    video.muted = true; // Prevents autoplay blocking issues
    video.playsInline = true;

    // 2. Create an Object URL from the File
    const videoUrl = URL.createObjectURL(file);
    video.src = videoUrl;

    // 3. Once metadata is loaded, seek to the middle

    video.addEventListener('loadedmetadata', () => {
      const quarterDuration = video.duration / 4;
      video.currentTime = Math.floor(quarterDuration * startingQuarter);
    });

    // 4. Once the video has seeked to the timestamp, draw it
    video.addEventListener('seeked', () => {
      // Create a canvas with the exact dimensions of the video
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 5. Convert the canvas to a JPEG Blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(videoUrl); // Memory cleanup
          resolve(blob);
        },
        'image/jpeg',
        0.85,
      ); // 0.85 is the JPEG quality (0.0 to 1.0)
    });

    // Handle any loading errors
    video.addEventListener('error', () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video file'));
    });
  });
}
