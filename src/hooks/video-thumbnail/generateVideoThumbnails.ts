import { getVideoDuration } from './getVideoDuration';
import getVideoThumbnail from './getVideoThumbnail';

export const generateVideoThumbnails = async (
    videoFile: any,
    numberOfThumbnails: any
) => {
    let thumbnail: any = [];
    let fractions: any = [];
    return new Promise(async (resolve, reject) => {
        if (!videoFile.type?.includes('video'))
            reject('not a valid video file');
        await getVideoDuration(videoFile).then(async (duration: any) => {
            // divide the video timing into particular timestamps in respective to number of thumbnails
            // ex if time is 10 and numOfthumbnails is 4 then result will be -> 0, 2.5, 5, 7.5 ,10
            // we will use this timestamp to take snapshots
            for (let i = 0; i <= duration; i += duration / numberOfThumbnails) {
                fractions.push(Math.floor(i));
            }
            // the array of promises
            let promiseArray = fractions.map((time: any) => {
                return getVideoThumbnail(videoFile, time);
            });
            // console.log('promiseArray', promiseArray)
            // console.log('duration', duration)
            // console.log('fractions', fractions)
            await Promise.all(promiseArray)
                .then((res: any) => {
                    res.forEach((res: any) => {
                        // console.log('res', res.slice(0,8))
                        thumbnail.push(res);
                    });
                    resolve(thumbnail);
                    return res;
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    // console.log(res);
                    resolve(thumbnail);
                });
        });
        reject('something went wront');
    });
};
