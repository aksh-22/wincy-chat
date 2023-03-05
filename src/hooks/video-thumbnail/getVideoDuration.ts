import { importFileAndPreview } from './importFileAndPreview';

export const getVideoDuration = (videoFile: any) => {
    return new Promise((resolve, reject) => {
        if (videoFile) {
            if (videoFile.type.match('video')) {
                importFileAndPreview(videoFile).then((url) => {
                    let video: any = document.createElement('video');
                    video.addEventListener('loadeddata', function () {
                        resolve(video.duration);
                    });
                    video.preload = 'metadata';
                    video.src = url;
                    // Load video in Safari / IE11
                    video.muted = true;
                    video.playsInline = true;
                    video.play();
                    //  window.URL.revokeObjectURL(url);
                });
            }
        } else {
            reject(0);
        }
    });
};
