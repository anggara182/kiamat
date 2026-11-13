#!/usr/bin/env bash
# Final encode: add film grain ONCE to the finished frames, tunable without re-rendering, then mux audio if present.
# Grain = coarse noise plate (half resolution, upscaled with nearest neighbour), refreshed every 2 frames,
# overlay-blended at low opacity. Coarser + 15 fps grain looks like film and compresses far better than per-pixel noise.
# usage: scripts/finish.sh in.mp4 out.mp4 [strength=0.30] [crf=23]
set -euo pipefail
in=$1; out=$2; g=${3:-0.30}; crf=${4:-23}
fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$in")
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
audio=(); [ -f public/audio/mix.wav ] && audio=(-i public/audio/mix.wav)
amap=(); [ -f public/audio/mix.wav ] && amap=(-map 2:a -c:a aac -b:a 192k -shortest)
ffmpeg -v error -y -i "$in" \
  -f lavfi -i "nullsrc=s=540x960:r=15:d=${dur},geq=lum='128+70*(random(1)-0.5)':cb=128:cr=128,scale=1080:1920:flags=neighbor,fps=${fps}" \
  "${audio[@]}" \
  -filter_complex "[1:v]format=yuv420p[g];[0:v]format=yuv420p[v];[v][g]blend=all_mode=overlay:all_opacity=${g}:shortest=1,format=yuv420p[o]" \
  -map "[o]" "${amap[@]}" -c:v libx264 -crf "$crf" -preset medium -tune grain -movflags +faststart "$out"
