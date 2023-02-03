const getFileType = (file: any) => {
    if (file?.type) {
        if (file.type.match('image.*')) return 'image';

        if (file.type.match('video.*')) return 'video';

        if (file.type.match('audio.*')) return 'audio';
        return 'other';
    } else {
        if (file.match(/\.(jpg|jpeg|png|gif|avif)$/i) !== null) {
            return 'image';
        }
        if (file.match(/\.(mp4)$/i)) return 'video';
        if (file.match(/\.(zip)$/i)) return 'other';
    }
    // etc...
};

export default getFileType;
