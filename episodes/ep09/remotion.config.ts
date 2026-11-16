import { Config } from '@remotion/cli/config';
import fs from 'node:fs';
// Pure SVG/2D: software compositor, no WebGL needed.
Config.setChromiumOpenGlRenderer('swiftshader');
Config.setVideoImageFormat('jpeg');
if (fs.existsSync('/opt/pw-browsers/chromium')) Config.setBrowserExecutable('/opt/pw-browsers/chromium');
