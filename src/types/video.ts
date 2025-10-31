export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  resolution: string;
  category: string;
  tags: string[];
  mood?: string;
  cameraAngle?: string;
}
