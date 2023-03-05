import { importFileAndPreview } from './importFileAndPreview';

const getVideoThumbnail = (file: any, videoTimeInSeconds: any) => {
    return new Promise((resolve, reject) => {
        if (file.type.match('video')) {
            importFileAndPreview(file).then((urlOfFIle: any) => {
                var video = document.createElement('video');
                var timeupdate = function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata', function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate', timeupdate);
                    }
                });
                var snapImage = function () {
                    var canvas: any = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas
                        .getContext('2d')
                        .drawImage(video, 0, 0, canvas.width, canvas.height);
                    var image = canvas.toDataURL();
                    var success = image.length > 100000;
                    if (success) {
                        URL.revokeObjectURL(urlOfFIle);
                        resolve(image);
                    }
                    return success;
                };
                video.addEventListener('timeupdate', timeupdate);
                video.preload = 'metadata';
                video.src = urlOfFIle;
                // Load video in Safari / IE11
                video.muted = true;
                video.playsInline = true;
                video.currentTime = videoTimeInSeconds;
                video.play();
            });
        } else {
            reject('file not valid');
        }
    });
};

export default getVideoThumbnail;
