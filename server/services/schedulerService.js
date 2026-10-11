const corn = require("node-corn");
const post = require("../model/post");
const Account = require("../model/accounts");




const initSchrduler = () => {
    corn.schedule("* * * *", async () => {

        try {

            const now = new Date();
            const postsTopublish = await post.find({ status: "scheduledFor", scheduledfor: { $lte: now } });
            for (const ele of postsTopublish) {
                try {
                    const accounts = await Account.find({
                        user: post.user,
                        platfrom: {
                            $in: post.platfrom
                        },
                        status: "connected",
                        zernioAccountId: { $exists: true }
                    })
                    if (accounts.length === 0) {
                        console.log(` no connected zernio account found for post ${post_id}`)
                        continue;
                    }
                    const zernioPlatfroms = accounts.map((acc) => {
                        platfrom: acc.platfrom;
                        accountId: acc.zernioAccountId

                    })
                    const payload = {
                        content: post.content,
                        publishNow: true
                    }
                } catch (error) {

                }
            }
        }
        catch (error) {


        }
    })


}

module.exports = initSchrduler;