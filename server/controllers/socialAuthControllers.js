//generate oQuth autorization URL

const zernio = require("../config/zernio");
const Account = require("../model/accounts");
const User = require("../model/User");
//this will help us to  ensure user has a zernio profile  or not 
const getOrCreatezernioProfile = async (user) => {
    try {
        // console.log(user)
        const result = await zernio.profiles.listProfiles();
        // console.log(result)
        const data = result.data;
        const profiles = Array.isArray(data) ? data : data?.profiles || data?.data || [];
        // console.log(profiles)
        if (profiles.length > 0) {
            const pid = profiles[0]._id || profiles[0].id;
            await User.findById(User._id, { zernioProfileId: pid })
            return pid;
        }
        const createResult = await zernio.profiles.createProfile({
            body: {
                name: `name :${user.name || user.email}'s workspace`

            }
        })
        console.log(createResult)
        const created = (createResult.data) ? profiles : createResult.data
        const pid = created?._id || created?.id;
        if (!pid) {
            throw new Error("Failed to create zernio profiles -no ID returened ")
        }
        console.log("getting profile id ... done")
        return pid;
    }
    catch (error) {
        console.log("create zernio profile error ", error?.message || error)
    }
}

// //get .api/auth/:platfrom //completed 
const generateAuthUrl = async (req, res) => {
    try {
        const platfrom = req.params.platform;
        // console.log(req.user)
        const profileId = await getOrCreatezernioProfile(req.user)

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

        const result = await zernio.accounts.listAccounts({ query: { profileId } });
        const data = result.data;
        // console.log(data)
        const zernioAccounts = data?.accounts || (Array.isArray(data) ? data : []);

        const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];
        const savedAccounts = [];
        let seenIds = [];
        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id;
            if (!zid) {
                console.warn("Skipping account with no ID");
                continue;
            }
            seenIds.push(zid);

            const platform = supportedPlatforms.find(
                (p) => (zAccount.platform || "").toLowerCase() === p
            );
            if (!platform) {
                console.warn(`Skipping unsupported platform: ${zAccount.platform}`);
                continue;
            }
            await Account.deleteMany({ user: req.user._id })
            const account = await Account.findOneAndUpdate(
                { zernioAccountId: zid },
                {
                    user: req.user._id,
                    platfrom: zAccount.platform,
                    handle: zAccount.username || zAccount.profileUrl,
                    status: zAccount.isActive,
                    avatarUrl: zAccount.profileUrl,
                    lastSyncedAt: new Date(),
                    status: zAccount.isActive
                },
                { upsert: true, returnDocument: "after" }
            );
            await Account.findOne({ user: req.user._id })
            savedAccounts.push(account);

        }

        const accounts = await Account.find({ user: req.user._id });
        res.json(accounts);

    } catch (error) {
        res.status(500).json({ msg: error?.message || "Server error" });
    }
};








module.exports = { syncAccounts, generateAuthUrl }


