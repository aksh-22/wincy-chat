export const importFileAndPreview = (file: any, revoke?: any) => {
    return new Promise((resolve, reject) => {
        window.URL = window.URL || window.webkitURL;
        let preview = window.URL.createObjectURL(file);
        // remove reference
        if (revoke) {
            window.URL.revokeObjectURL(preview);
        }
        setTimeout(() => {
            resolve(preview);
        }, 100);
    });
};
