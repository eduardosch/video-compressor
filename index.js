const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const path = require('path');
const fs = require('fs');
const cliProgress = require('cli-progress');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node compress.js <path_to_video>');
  process.exit(1);
}

const parsedPath = path.parse(inputPath);
const outputPath = path.join(parsedPath.dir, `${parsedPath.name}_reduced.mp4`);

// Helper to format bytes to MB
const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

// Get initial file size
const initialSize = fs.statSync(inputPath).size;

const progressBar = new cliProgress.SingleBar({
  format: 'Compressing | {bar} | {percentage}% | ETA: {eta}s',
  hideCursor: true
}, cliProgress.Presets.shades_classic);

ffmpeg.ffprobe(inputPath, (err, metadata) => {
  if (err) {
    console.error('Error reading metadata:', err.message);
    process.exit(1);
  }

  const duration = metadata.format.duration;

  ffmpeg(inputPath)
    .outputOptions([
      '-vcodec libx264',
      '-crf 23',
      '-preset fast',
      '-pix_fmt yuv420p',
      '-movflags +faststart'
    ])
    .on('start', () => {
      console.log(`\nOriginal Size: ${toMB(initialSize)} MB`);
      progressBar.start(100, 0);
    })
    .on('progress', (progress) => {
      if (progress.percent) {
        progressBar.update(Math.floor(progress.percent));
      } else if (progress.timemark) {
        const parts = progress.timemark.split(':');
        const seconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
        const percent = (seconds / duration) * 100;
        progressBar.update(Math.floor(Math.min(percent, 100)));
      }
    })
    .on('end', () => {
      progressBar.update(100);
      progressBar.stop();
      
      // Get final file size
      const finalSize = fs.statSync(outputPath).size;
      const savings = (((initialSize - finalSize) / initialSize) * 100).toFixed(1);

      console.log(`\n--- Compression Summary ---`);
      console.log(`Before: ${toMB(initialSize)} MB`);
      console.log(`After:  ${toMB(finalSize)} MB`);
      console.log(`Reduced by: ${savings}%`);
      console.log(`Saved to: ${outputPath}\n`);
    })
    .on('error', (err) => {
      progressBar.stop();
      console.error('\nError:', err.message);
    })
    .save(outputPath);
});
