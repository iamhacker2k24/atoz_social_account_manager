//get all accounts 

const zernio = require("../config/zernio");
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

const disconnectAccount = async (req, res) => {
    try {
        // console.log("disconnecting")
        console.log(req.params.id)
        console.log(req.user._id)
        const zernioAccountId = req.params.id;
        const user = req.user._id
        const account = await Account.findOne({ zernioAccountId: zernioAccountId, user: user });
        console.log(account)
        if (!account) {
            res.status(404).json({
                msg: "Account not found "
            })
            return;
        }

        if (zernioAccountId) {
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
        console.log(error.message)
    }
}


module.exports = { getAccounts, disconnectAccount }