//generate oQuth autorization URL

const zernio = require("../config/zernio");
const Account = require("../model/accounts");
const User = require("../model/User");
//this will help us to  ensure user has a zernio profile  or not 

const getOrCreateZernioProfile = async (user) => {
    try {
        if (!user?._id) {
            throw new Error("User is required");
        }

        // 1. Reuse this user's existing profile.
        if (user.zernioProfileId) {
            return user.zernioProfileId;
        }

        // 2. Create a new profile for this user.
        const createResult = await zernio.profiles.createProfile({
            body: {
                name: `${user.name || user.email}'s workspace`,
            },
        });

        console.log("Zernio profile response:", createResult);

        const created = createResult.data?.profile ?? createResult.data;

        const profileId = created?._id || created?.id;

        if (!profileId) {
            throw new Error("Zernio did not return a profile ID");
        }

        // 3. Save the profile ID to the correct user.
        await User.findByIdAndUpdate(user._id, {
            $set: { zernioProfileId: profileId },
        });

        console.log("Zernio profile created and saved:", profileId);

        return profileId;
    } catch (error) {
        console.error(
            "Zernio profile error:",
            error?.response?.data || error?.message || error
        );

        throw error;
    }
};


// //get .api/auth/:platfrom //completed 
const generateAuthUrl = async (req, res) => {
    try {
        const platfrom = req.params.platform;
        console.log(req.user)
        const profileId = await getOrCreateZernioProfile(req.user)
        console.log(profileId)
        // const origin = req.headers.origin;
        // console.log("origin")
        // console.log(origin)
        // const redirectUrl = `${origin}/accounts`;
        const result = await zernio.connect.getConnectUrl({
            path: { platform: platfrom },
            query: {
                profileId,

            }
        })
        const data = result.data;
        console.log(data)
        console.log("getConnectUrl response", JSON.stringify(data, null, 2));

        const authUrl = data.authUrl;
        if (!authUrl) {
            throw new Error(`zernio returned o authUrl.Full response ${JSON.stringify(data)}`)
        }
        res.json({ url: authUrl })

    } catch (error) {
        res.json({
            msg: error.message
        })

    }
}


//connected accounts from zernio 

//get /api/auth/sync 
//post man configuration done 
const syncAccounts = async (req, res) => {
    try {
        const profileId = await getOrCreatezernioProfile(req.user);
        console.log(profileId)
        const result = await zernio.accounts.listAccounts({
            query: { profileId }
        });

        const data = result.data;

        const zernioAccounts =
            data?.accounts || (Array.isArray(data) ? data : []);

        const supportedPlatforms = [
            "twitter",
            "linkedin",
            "facebook",
            "instagram",
            "facebook_page",
            "linkedin_page",
            "instagram_business"
        ];

        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id;

            if (!zid) {
                console.warn("Skipping account with no ID");
                continue;
            }

            const platform = (zAccount.platform || "").toLowerCase();

            if (!supportedPlatforms.includes(platform)) {
                console.warn(
                    `Skipping unsupported platform: ${zAccount.platform}`
                );
                continue;
            }

            const handle = zAccount.username || zAccount.profileUrl;

            if (!handle) {
                console.warn(`Skipping account with no handle: ${zid}`);
                continue;
            }

            await Account.findOneAndUpdate(
                {
                    user: req.user._id,
                    zernioAccountId: zid
                },
                {
                    $set: {
                        platfrom: platform,
                        handle,
                        status: Boolean(zAccount.isActive),
                        avatarUrl: zAccount.profileUrl,
                        lastSyncedAt: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );
        }

        const accounts = await Account.find({
            user: req.user._id
        });

        return res.status(200).json({
            success: true,
            accounts
        });

    } catch (error) {
        console.error("Sync accounts error:", error);

        return res.status(500).json({
            msg: error.message || "Server error"
        });
    }
};








module.exports = { syncAccounts, generateAuthUrl }


