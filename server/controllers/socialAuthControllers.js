//generate oQuth autorization URL

const zernio = require("../config/zernio");
const Account = require("../model/accounts");
const User = require("../model/User");
//this will help us to  ensure user has a zernio profile  or not 
const getOrCreatezernioProfile = async (user) => {
    try {
        console.log("woking...")
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
        user.name = "Dev"
        const createResult = await zernio.profiles.createProfile({
            body: {
                // name: `name :${user.name || user.email}'s workspace`
                name: "dev's workspace"
            }
        })
        console.log(createResult)
        const created = (createResult.data) ? profiles : createResult.data

        const pid = created?._id || created?.id;
        if (!pid) {
            throw new Error("Failed to create zernio profiles -no ID returened ")
        }

        console.log("woking...")
        return pid;



    }
    catch (error) {
        console.log("create zernio profile error ", error?.message || error)
    }
}


// //get .api/auth/:platfrom

// const generateAuthUrl = async (req, res) => {
//     try {
//         const platfrom = "facebook";
//         console.log(req.parms)
//         const profileId = await getOrCreatezernioProfile(req.user)

//         // const origin = req.headers.origin;
//         // console.log("origin")
//         // console.log(origin)
//         // const redirectUrl = `${origin}/accounts`;
//         const result = await zernio.connect.getConnectUrl({
//             path: { platform: 'linkedin' },
//             query: {
//                 profileId,

//             }
//         })
//         const data = result.data;
//         console.log(data)
//         console.log("getConnectUrl response", JSON.stringify(data, null, 2));

//         const authUrl = data.authUrl;
//         if (!authUrl) {
//             throw new Error(`zernio returned o authUrl.Full response ${JSON.stringify(data)}`)
//         }
//         res.json({ url: authUrl })

//     } catch (error) {
//         res.json({
//             msg: error.message
//         })

//     }
// }


//connected accounts from zernio 

//get /api/auth/sync 

const syncAccounts = async (req, res) => {
    try {

        const profileId = await getOrCreatezernioProfile(req.user);
        console.log(profileId)
        const result = await zernio.accounts.listAccounts({
            query: { profileId }
        })
        const data = result.data;
        const zernioAccounts = data?.accounts || (Array.isArray(data) ? data : []);
        const supportedPlatfroms = ["twitter", "linkdin", "facebook", "Instagram"];
        const syncAccounts = [];
        let zid;
        for (const zAccount of zernioAccounts) { 
            zid = zAccount._id || zAccount.id;
        }
        if (!zid) {
            console.warn("Skipping account with no ID", zAccount);
            // continue;
        }
        const rawPlatfrom = (zAccount.platfrom || zAccount.type || " ").toLowerCase();
        const normalizedPlatfrom = supportedPlatfroms.find((p) => rawPlatfrom.includes(p));
        if (!normalizedPlatfrom) {
            console.warn(`Skipping account with no Id ${rawPlatfrom}`);
            // continue;
        }
        const Account = await Account.findOneAndUpdate(
            { zernioAccountId: zid },
            {
                user: req.user._id,
                platfrom: normalizedPlatfrom,
                handle: zAccount.username || zAccount.picture || zAccount.profile_image_url,

            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        )
        syncAccounts.push(Account);
        res.json(syncAccounts);

    } catch (error) {

        res.status(500).json({
            msg: error?.message || "Server error "
        })


    }
}

module.exports = { syncAccounts }