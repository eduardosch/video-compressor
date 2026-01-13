Below is a complete **README.md** generated from your `index.js` and `package.json`. It’s ready to drop into your repository.

---

# Video Compress CLI

A simple Node.js command-line tool to **reduce video file size** using FFmpeg, with a real-time progress bar and compression summary.

## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [How It Works](#how-it-works)
* [Configuration](#configuration)
* [Dependencies](#dependencies)
* [Example Output](#example-output)
* [Troubleshooting](#troubleshooting)
* [Author](#author)
* [License](#license)

## Introduction

This project provides a CLI script that compresses video files by re-encoding them with **H.264 (libx264)** while maintaining good visual quality. It automatically reports:

* Original file size
* Final file size
* Percentage saved
* Compression progress with ETA

It uses static FFmpeg binaries, so no system-wide FFmpeg installation is required.

## Features

* 📉 Reduces video file size using CRF-based compression
* 📊 Real-time progress bar with percentage and ETA
* 📁 Automatically generates an output file
* 🧮 Displays before/after file size comparison
* ⚙️ Cross-platform (Windows, macOS, Linux)

## Requirements

* **Node.js** v14 or newer
* npm (comes with Node.js)

## Installation

1. Clone the repository or copy the files into your project:

   ```bash
   git clone <your-repo-url>
   cd video_compress
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Run the script from the command line, passing the path to a video file:

```bash
node index.js path/to/video.mp4
```

### Output File

The compressed video will be saved in the **same directory** as the original file, with `_reduced` appended to the filename:

```
original.mp4 → original_reduced.mp4
```

## How It Works

1. Reads the input video metadata using `ffprobe`
2. Calculates the video duration for accurate progress reporting
3. Re-encodes the video with:

   * **Codec:** libx264
   * **CRF:** 23 (balanced quality vs size)
   * **Preset:** fast
   * **Pixel format:** yuv420p (maximum compatibility)
   * **Fast start:** enabled for streaming
4. Tracks compression progress and estimates completion
5. Prints a compression summary on completion

## Configuration

Compression settings are defined in `index.js`:

```js
.outputOptions([
  '-vcodec libx264',
  '-crf 23',
  '-preset fast',
  '-pix_fmt yuv420p',
  '-movflags +faststart'
])
```

You can tweak these values to:

* Lower `-crf` for higher quality (larger file)
* Increase `-crf` for more compression (lower quality)
* Use `slow` or `veryslow` preset for better compression efficiency

## Dependencies

The project relies on the following packages:

* **fluent-ffmpeg** – FFmpeg wrapper for Node.js
* **ffmpeg-static** – Static FFmpeg binary
* **ffprobe-static** – Static FFprobe binary
* **cli-progress** – Terminal progress bar

All dependencies are listed in `package.json`.

## Example Output

```
Original Size: 120.45 MB
Compressing | ████████████████░░░░ | 78% | ETA: 12s

--- Compression Summary ---
Before: 120.45 MB
After:  42.18 MB
Reduced by: 65.0%
Saved to: /videos/sample_reduced.mp4
```

## Troubleshooting

**“Usage: node compress.js <path_to_video>”**

* You didn’t provide a video file path.

**FFmpeg error or unsupported format**

* Ensure the input file is a valid video format supported by FFmpeg.

**Permission errors**

* Check read/write permissions in the target directory.

## Author

**Eduardo Schröder**
