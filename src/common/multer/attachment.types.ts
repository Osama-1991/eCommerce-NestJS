export const fileFormat: IFileFormat = {
  image: ['image/jpeg', 'image/png'],
  files: ['text/plain', 'application/pdf'],
  video: ['video/mp4'],
  audio: ['audio/mp3'],
  pdf: ['application/pdf'],
  document: ['application/word'],
  archive: ['application/zip'],
};

export interface IMulterParameters {
  path?: string;
  fileValidator?: string[];
  fileSize?: number;
}

export interface IFileFormat {
  image: string[];
  files: string[];
  video: string[];
  audio: string[];
  pdf: string[];
  document: string[];
  archive: string[];
}
