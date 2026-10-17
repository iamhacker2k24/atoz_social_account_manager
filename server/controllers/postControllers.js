const axios = require("axios");
const Post = require("../model/post");
const Account = require("../model/accounts");
const zernio = require("../config/zernio");
const uploadToZernio = require("../config/UploadInZernio");
const textGen = require("../services/textGen");
const allowedPlatform = [
    "instagram",
    "linkedin",
    "facebook",
    "twitter",
];

const allowedMediaTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/avi",
    "video/x-msvideo",
    "video/webm",
    "video/x-m4v",
]);

// yea duplicate value ko arrehnge korega 
const cleanValue = (value) => {
    if (Array.isArray(value)) {
        value = value[value.length - 1];
    }

    return typeof value === "string" ? value.trim() : value;
};

const parseBoolean = (value) =>
    value === true ||
    (typeof value === "string" &&
        value.toLowerCase() === "true");

const getMediaType = (mimetype) => {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    return null;
};

const ComposePost = async (req, res) => {
    let localPost = null;
    let zernioAccepted = false;
    let zernioPostId = null;

    try {
        // 1. Authenticate user.
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        // 2. Normalize FormData.
        const content = cleanValue(req.body?.content);
        const platformsInput = cleanValue(req.body?.platforms);
        const publishNow = parseBoolean(
            cleanValue(req.body?.publishNow)
        );
        const scheduledForInput = cleanValue(
            req.body?.scheduledFor
        );
        const timezone =
            cleanValue(req.body?.timezone) || "Asia/Kolkata";

        if (typeof content !== "string" || !content) {
            return res.status(400).json({
                success: false,
                message: "Post content is required.",
            });
        }

        // 3. Parse platforms.
        let requestedPlatforms;

        try {
            requestedPlatforms =
                typeof platformsInput === "string"
                    ? JSON.parse(platformsInput)
                    : platformsInput;
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid platforms JSON.",
            });
        }

        if (
            !Array.isArray(requestedPlatforms) ||
            requestedPlatforms.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Select at least one platform.",
            });
        }

        requestedPlatforms = [
            ...new Set(
                requestedPlatforms.map((p) =>
                    String(p).trim().toLowerCase()
                )
            ),
        ];

        const invalidPlatforms = requestedPlatforms.filter(
            (p) => !allowedPlatform.includes(p)
        );

        if (invalidPlatforms.length) {
            return res.status(400).json({
                success: false,
                message: "Unsupported platform.",
                invalidPlatforms,
            });
        }

        // 4. Validate scheduling.
        let scheduledDate = null;

        if (!publishNow) {
            if (!scheduledForInput) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Provide scheduledFor or set publishNow=true.",
                });
            }

            scheduledDate = new Date(scheduledForInput);

            if (
                Number.isNaN(scheduledDate.getTime()) ||
                scheduledDate.getTime() <= Date.now()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Provide a valid future scheduledFor date.",
                });
            }

            try {
                Intl.DateTimeFormat("en-US", {
                    timeZone: timezone,
                });
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Invalid timezone.",
                });
            }
        }

        // 5. Find connected accounts for this user.
        const accounts = await Account.find({
            user: userId,
            platfrom: { $in: requestedPlatforms },
        }).select("zernioAccountId platfrom");

        const accountByPlatform = new Map();

        for (const account of accounts) {
            if (
                account.zernioAccountId &&
                !accountByPlatform.has(account.platfrom)
            ) {
                accountByPlatform.set(account.platfrom, account);
            }
        }

        const missingPlatforms = requestedPlatforms.filter(
            (p) => !accountByPlatform.has(p)
        );

        if (missingPlatforms.length) {
            return res.status(400).json({
                success: false,
                message: "Connect the missing accounts first.",
                missingPlatforms,
            });
        }

        const zernioPlatforms = requestedPlatforms.map(
            (platform) => ({
                platform,
                accountId:
                    accountByPlatform.get(platform).zernioAccountId,
            })
        );

        // 6. Validate media.
        const files = req.files || [];

        if (files.length > 10) {
            return res.status(400).json({
                success: false,
                message: "Upload at most 10 media files.",
            });
        }

        for (const file of files) {
            if (!allowedMediaTypes.has(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: `Unsupported media type: ${file.mimetype}`,
                });
            }
        }

        const imageFiles = files.filter((f) =>
            f.mimetype.startsWith("image/")
        );

        const videoFiles = files.filter((f) =>
            f.mimetype.startsWith("video/")
        );

        if (videoFiles.length > 1) {
            return res.status(400).json({
                success: false,
                message: "Only one video is supported.",
            });
        }

        if (
            requestedPlatforms.includes("linkedin") &&
            imageFiles.length > 0 &&
            videoFiles.length > 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "For LinkedIn, use images or one video, not both.",
            });
        }

        // 7. Upload media before creating the post record.
        const mediaItems = [];

        for (const file of files) {
            mediaItems.push(await uploadToZernio(file));
        }

        // 8. Save MongoDB record FIRST.
        // Ensure platformResults is an array of subdocuments
        // in your Post schema, not a String.
        localPost = await Post.create({
            user: userId,
            content,
            mediaItems,
            platforms: requestedPlatforms,
            platformResults: requestedPlatforms.map((platform) => ({
                platform,
                platformPostId: null,
                platformPostUrl: null,
                status: "pending",
            })),
            scheduledFor: publishNow ? null : scheduledDate,
            timezone,
            postId: null,
            status: publishNow ? "publishing" : "scheduling",
        });

        // 9. Call Zernio ONLY after the local save succeeds.
        const body = {
            content,
            platforms: zernioPlatforms,
            publishNow,
        };

        if (mediaItems.length) {
            body.mediaItems = mediaItems;
        }

        if (!publishNow) {
            body.scheduledFor = scheduledForInput;
            body.timezone = timezone;
        }

        const { data: result } =
            await zernio.posts.createPost({ body });

        const zernioPost = result?.post;

        if (!zernioPost?._id) {
            throw new Error(
                "Zernio returned no post ID; publishing outcome is uncertain."
            );
        }

        zernioAccepted = true;
        zernioPostId = zernioPost._id;

        // 10. Map results for each platform.
        const platformResults = (zernioPost.platforms || []).map(
            (item) => ({
                platform: item.platform,
                platformPostId: item.platformPostId || null,
                platformPostUrl: item.platformPostUrl || null,
                status: item.status || "pending",
            })
        );

        for (const platform of requestedPlatforms) {
            if (
                !platformResults.some(
                    (item) => item.platform === platform
                )
            ) {
                platformResults.push({
                    platform,
                    platformPostId: null,
                    platformPostUrl: null,
                    status: zernioPost.status || "pending",
                });
            }
        }

        // 11. Update the existing MongoDB record.
        const updatedPost = await Post.findByIdAndUpdate(
            localPost._id,
            {
                $set: {
                    postId: zernioPost._id,
                    status: zernioPost.status || "pending",
                    scheduledFor: zernioPost.scheduledFor || null,
                    timezone: zernioPost.timezone || timezone,
                    platformResults,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedPost) {
            throw new Error(
                "Zernio succeeded, but the MongoDB record could not be updated."
            );
        }

        return res.status(201).json({
            success: true,
            message: result.message || "Post created successfully.",
            post: updatedPost,
            zernio: zernioPost,
        });
    } catch (error) {
        console.error(
            "ComposePost error:",
            error.response?.data || error.message
        );

        // 12. Roll back the local record on failure.
        if (localPost?._id) {
            try {
                await Post.deleteOne({
                    _id: localPost._id,
                    user: req.user?._id,
                });
            } catch (deleteError) {
                console.error(
                    "Failed to delete local post:",
                    localPost._id,
                    deleteError.message
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: zernioAccepted
                ? "Zernio accepted the post, but saving the final result failed. The local record was scheduled for cleanup; check Zernio before retrying."
                : "Post creation failed. The local record was scheduled for cleanup.",
            zernioAccepted,
            zernioPostId,
            error:
                error.response?.data?.message ||
                error.response?.data ||
                error.message,
        });
    }
};

const PublishedPost = async (req, res) => {
    try {
        const userId = req.user._id;

        const posts = await Post.find({ user: userId }).select(
            "content platforms mediaItems status scheduledFor postId platformResults"
        );

        const updatedPosts = await Promise.all(
            posts.map(async (post) => {
                if (!post.postId) return post;

                try {
                    const { data: fetched } = await zernio.posts.getPost({
                        path: { postId: post.postId },
                    });

                    const latestPost = fetched?.post;

                    if (!latestPost) return post;

                    // Update overall post status
                    if (latestPost.status) {
                        post.status = latestPost.status;
                    }

                    // Update individual platform results
                    if (Array.isArray(latestPost.platformResults)) {
                        post.platformResults = latestPost.platformResults.map(
                            (result) => ({
                                platform: result.platform,
                                platformPostId: result.platformPostId ?? null,
                                platformPostUrl: result.platformPostUrl ?? null,
                                status: result.status ?? "pending",
                            })
                        );
                    }

                    await post.save();

                    return post;
                } catch (error) {
                    console.error(
                        `Failed to sync post ${post.postId}:`,
                        error?.response?.data || error.message || error
                    );

                    return post;
                }
            })
        );

        return res.status(200).json(
            updatedPosts);
    } catch (error) {
        console.error("PublishedPost error:", error);

        return res.status(500).json({
            success: false,
            msg: error.message || "Failed to fetch published posts",
        });
    }
};


const generateContent = async (req, res) => {
    try {

        const { prompt, tone } = req.body;
        if (prompt == null) {
            return res.status(400).json({
                msg: "Please add all fields"
            });
        }
        const result = await textGen(prompt, tone)
        res.status(200).json(result)
    } catch (error) {
        console.error(
            `Failed to call agent  post `,
            error?.response?.data || error.message || error
        );

    }

}

module.exports = { ComposePost, PublishedPost, generateContent };
