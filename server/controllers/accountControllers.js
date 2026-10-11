//get all accounts 

const Account = require("../model/accounts")


//get /api/accounts 
const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user._id });
        res.json(accounts)
    } catch (error) {
        res.status(500).json({
            msg: "Error from get accounts"
        })
    }
}



//disconnected account 
//delete /api/accounts/:id

const disconnectAccount = async () => {
    try {
        console.log(req.parms.id)
        const account = await Account.findOne({ _id: req.parms.id, user: req.user._id });
        if (!account) {
            res.status(404).json({
                msg: "Account not found "
            })
            return;
        }

        if (account.zernioAccountId) {
            try {
                await zernio.accounts.deleteAccount({ path: { accountId: account.zernioAccountId } })

            } catch (error) {
                res.status(500).json({
                    msg: error?.response?.data?.message || error?.message
                })
            }
        }
        await account.deleteOne()
        res.status(200).json({
            msg: "Accout deleted sucessfully "
        })
    } catch (error) {

    }
}


module.exports = { getAccounts, disconnectAccount }