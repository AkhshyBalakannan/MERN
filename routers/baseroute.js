const express = require('express');
const UserProfile = require('../Schemas/userprofile');
const router = express.Router()

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

router.get('/asisa', (req, res) => {
    res.render('index');
})

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/signin', (req, res) => {
    res.render('signin');
})

router.post('/home', wrapAsync(async (req, res) => {
    const { userid } = req.body;
    const user = await UserProfile.findOne({ userid })
    if (user) {
        console.log(user)
        res.redirect(`/home/${user._id}`)
    } else {
        res.redirect('/signup')
    }
}))

router.post('/signup', wrapAsync(async (req, res) => {
    const val = req.body;
    const data = new UserProfile(val);
    await data.save();
    const id = data._id;
    await data.transaction.push({ currentAmount: 0, amount: 0, mode: 'DEPOSIT' })
    await data.save();
    res.redirect(`/home/${id}`)
}))

router.get('/home/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    res.render('home', { user })

}))

router.get('/deposit/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    res.render('deposit', { user })
}))

router.post('/deposit/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const val = req.body;
    const data = await UserProfile.findById(id)
    await data.transaction.push({ currentAmount: data.bankbalance, amount: val.bankbalance, mode: 'DEPOSIT' })
    await data.save();
    val.bankbalance = parseInt(data.bankbalance) + parseInt(val.bankbalance)
    const user = await UserProfile.findByIdAndUpdate(id, val, { new: true })
    res.render('home', { user })
}))

router.get('/withdraw/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    res.render('withdraw', { user })
}))

router.post('/withdraw/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const val = req.body;
    const data = await UserProfile.findById(id)
    await data.transaction.push({ currentAmount: data.bankbalance, amount: val.bankbalance, mode: 'WITHDRAW' })
    await data.save();
    if (data.bankbalance > -1) {
        val.bankbalance = parseInt(data.bankbalance) - parseInt(val.bankbalance)
        if (val.bankbalance > -1) {
            const user = await UserProfile.findByIdAndUpdate(id, val, { new: true })
            res.render('home', { user })
        }
        else {
            res.alert('This is an Zero balance account You cant withdraw the amount you typed')
        }
    }
    else {

    }
}))

router.get('/update/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    res.render('update', { user });
}))

router.patch('/update/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const val = req.body;
    const user = await UserProfile.findByIdAndUpdate(id, val, { new: true })
    res.render('home', { user })
}))

router.get('/delete/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    res.render('delete', { user });
}))

router.delete('/delete/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await UserProfile.findByIdAndDelete(id)
    res.redirect('/asisa')
}))

router.get('/netbanking/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    const tos = await UserProfile.find({})
    res.render('netbanking', { user, tos });
}))

router.post('/netbanking/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    var { toAccount, transferAmount } = req.body;
    toAccount = toAccount.trim();
    if (toAccount === "stop") { res.redirect(`/netbanking/${id}`) }

    const toUser = await UserProfile.findById(toAccount)
    await toUser.transaction.push({ currentAmount: toUser.bankbalance, amount: transferAmount, mode: 'NET_TRANS_DEPOSITED' })
    await toUser.save();
    toUser.bankbalance = parseInt(toUser.bankbalance) + parseInt(transferAmount)
    var tosave = await UserProfile.findByIdAndUpdate(toAccount, toUser)
    tosave.save();

    const fromUser = await UserProfile.findById(id)
    await fromUser.transaction.push({ currentAmount: fromUser.bankbalance, amount: transferAmount, mode: 'NET_TRANS_WITHDRAWED' })
    await fromUser.save();
    fromUser.bankbalance = parseInt(fromUser.bankbalance) - parseInt(transferAmount)
    tosave = await UserProfile.findByIdAndUpdate(id, fromUser)
    tosave.save();

    res.redirect(`/home/${id}`)
}))

router.get('/transaction/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const user = await UserProfile.findById(id)
    res.render('transaction', { user })
}))


module.exports = router