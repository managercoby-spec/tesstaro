import { videos } from './videos';
import { extendedVideos } from './videosExtended';
import { finalVideos } from './videosFinal';

export const allVideos = [...videos, ...extendedVideos, ...finalVideos];
