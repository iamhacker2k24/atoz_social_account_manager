// Upload one image/video to Zernio storage.
const uploadToZernio = async (file) => {
    if (!allowedMediaTypes.has(file.mimetype)) {
        throw new Error(
            `Unsupported media type: ${file.mimetype}`
        );
    }

    const { data: presigned } =
        await zernio.media.getMediaPresignedUrl({
            body: {
                filename: file.originalname,
                contentType: file.mimetype,
                size: file.size,
            },
        });

    if (!presigned?.uploadUrl || !presigned?.publicUrl) {
        throw new Error(
            "Zernio did not return valid media upload URLs."
        );
    }

    await axios.put(presigned.uploadUrl, file.buffer, {
        headers: {
            "Content-Type": file.mimetype,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    });

    return {
        url: presigned.publicUrl,
        type: getMediaType(file.mimetype),
    };
};


module.exports = uploadToZernio;