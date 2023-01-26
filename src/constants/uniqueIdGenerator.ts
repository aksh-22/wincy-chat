const uniqueIdGenerator = () => {
    const deviceId = String(
        Date.now().toString(32) +
            Math.random().toString(32) +
            Math.random().toString(32)
    ).replace(/\./g, '');

    return deviceId;
};

export default uniqueIdGenerator;
