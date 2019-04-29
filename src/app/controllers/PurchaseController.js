const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../service/Queue')

class PurchaseController {
  async index (req, res) {
    const purchases = await Purchase.find()
      .where('purchaser')
      .equals(req.params.id)
      .populate('ad')

    res.json(purchases)
  }

  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({
      ad,
      content,
      purchaser: req.userId
    })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }

  async agreement (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate('ad')

    ad.purchasedBy = id

    await ad.save()

    res.json(ad)
  }
}

module.exports = new PurchaseController()
