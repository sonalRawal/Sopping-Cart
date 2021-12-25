const productModel = require("../model/productModel")
const { isValid, isValidAvailableSizes, isValidRequestBody, isValidObjectId, validString } = require("../validator/validate")
//const encrypt = require('../Encryption/Encrypt');
const URL = require('url').URL
const createProduct = async function (req, res) {

    try {
        const requestBody = req.body;
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = requestBody
        //console.log("hlo", req.body)
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide product details' })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'title is required' })
            return
        }

        const isTitleAlreadyUsed = await productModel.findOne({ title: title });
        if (isTitleAlreadyUsed) {
            res.status(400).send({ status: false, message: `${title} title is already registered`, });
            return;
        }
        if (!isValid(description)) {
            res.status(400).send({ status: false, message: `description is required` })
            return
        }
        if (!price) {
            res.status(400).send({ status: false, message: `price is required` })
            return
        }
        curRegExp = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/;
        if (!curRegExp.test(price)) {
            return res.status(400).send({ status: false, message: "provide valid price" })
        }

        if (!isValid(currencyId)) {
            res.status(400).send({ status: false, message: 'currencyId is required' })
            return
        }

        if (currencyId !== 'INR') {
            res.status(400).send({ status: false, message: 'provide valid currencyId' })
            return

        }
        if (!isValid(currencyFormat)) {
            res.status(400).send({ status: false, message: 'currencyFormat is required' })
            return
        }
        if (currencyFormat !== '₹') {
            res.status(400).send({ status: false, message: 'provide valid currencyFormat' })
            return
        }

        if (isValid(availableSizes)) {
            if (!isValidAvailableSizes(availableSizes)) {
                res.status(400).send({ status: false, message: 'plz provide one availableSize : ["S", "XS","M","X", "L","XXL", "XL"]' })
                return
            }
        }
        requestBody.productImage = req.urlimage
        const productData = await productModel.create(requestBody)
        res.status(201).send({ status: true, msg: "successfully created", data: productData })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
const updateProduct = async function (req, res) {
    try {
        let requestBody = req.body
        const productId = req.params.productId

        //atleast one value for update
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details to update' })
            return
        }

        if (!isValidObjectId(productId)) {
            return res.status(404).send({ status: false, message: "productId is not valid" })
        }

        //finding product exist or not
        const product = await productModel.findOne({ _id: productId, isDeleted: false, })

        if (!product) {
            res.status(404).send({ status: false, message: `product not found` })
            return
        }
        //filter
        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = requestBody
        const productImage = req.urlimage
        const filterQuery = {};
        if (isValid(title)) {
            const isTitleAlreadyUsed = await productModel.findOne({ title: title });
            if (isTitleAlreadyUsed) {
                res.status(400).send({ status: false, message: `${title} title is already registered`, });
                return;
            }
            filterQuery['title'] = title
        }

        if (isValid(description)) {
            filterQuery['description'] = description
        }

        if (price) {
            curRegExp = /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/;
            if (curRegExp.test(price)) {
                filterQuery['price'] = price
            } else {
                return res.status(400).send({ status: false, message: "provide valid price" })
            }
        }

        if (isValid(currencyId)) {
            if (currencyId !== 'INR') {
                res.status(400).send({ status: false, message: 'provide valid currencyId' })
                return
            } filterQuery['currencyId'] = currencyId
        }

        if (isValid(currencyFormat)) {
            if (currencyFormat !== '₹') {
                res.status(400).send({ status: false, message: 'provide valid currencyFormat' })
                return
            } filterQuery['currencyFormat'] = currencyFormat
        }

        if (isValid(style)) {
            filterQuery['style'] = style
        }

        if (availableSizes) {
            if (!isValidAvailableSizes(availableSizes)) {
                return res.status(400).send({ status: false, message: 'plz provide one availableSize : ["S", "XS","M","X", "L","XXL", "XL"]' })
            }
            filterQuery['availableSizes'] = availableSizes
        }
        if (installments) {
            if (typeof installments !== 'number') {
                return res.status(400).send({ status: false, message: 'installment should be number' })
            } filterQuery['installments'] = installments
        }

        filterQuery.productImage = productImage;
        //updating details
        const updatedProductDetails = await productModel.findOneAndUpdate({ productId }, filterQuery, { new: true })
        return res.status(200).send({ status: true, message: "successfully updated product Details", data: updatedProductDetails })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}
// const getProduct = async function (req, res) {
//     try {
//         // console.log(req.query)
//         const queryParams = req.query
//         if (!isValidRequestBody(queryParams)) {
//             return res.status(400).send({ status: false, message: 'Please provide book details' })
//         }
//     //     let { size, name, price, priceSort } = req.query
//            let  {size,name} = queryParams
//          let query = {isDeleted:false};
//         if (isValid(size)) {
//             if (!isValidAvailableSizes(size)) {
//                 return res.status(400).send({ status: false, message: ' Please provide size' })
//             } else {
//                 query['availableSizes'] = size
//             }
//         }

//         if (isValid(name)) {
//             query['title'] = name.trim();
//         }

//     //     if (price){
//     //         console.log(JSON.parse(price))
//     //         price = JSON.parse(price)
//     //         console.log(price)
//     //         if (Object.keys(price).length == 1) {
//     //             if (price.priceGreaterThan) {
//     //                 if (typeof price.priceGreaterThan !== 'number') {
//     //                     return res.status(400).send({ status: false, message: ' Please provide priceGreaterThan' })
//     //                 }
//     //                 query['prices.priceGreaterThan'] = price.priceGreaterThan
//     //             }
//     //             if (price.priceLessThan) {
//     //                 if (typeof price.priceLessThan !== 'number') {
//     //                     return res.status(400).send({ status: false, message: ' Please provide priceGreaterThan' })
//     //                 }
//     //                 query['prices.priceLessThan'] = price.priceLessThan
//     //             }
//     //         }
//     //         if (Object.keys(price).length == 2) {
//     //             if (price.priceGreaterThan && price.priceLessThan) {
//     //                 if (typeof price.priceGreaterThan !== 'number') {
//     //                     return res.status(400).send({ status: false, message: ' Please provide priceGreaterThan' })
//     //                 }
//     //                 if (typeof price.priceLessThan !== 'number') {
//     //                     return res.status(400).send({ status: false, message: ' Please provide priceGreaterThan' })
//     //                 }
//     //                 query['prices'] = price
//     //             }
//     //         }
//     //     }

//     //     if (priceSort) {
//     //         if (priceSort == -1 || priceSort == 1) {
//     //             query['priceSorts'] = priceSort
//     //         } else {
//     //             return res.status(400).send({ status: false, message: ' Please provide priceSort' })
//     //         }
//     //     }
//     //     let { availableSizes, title, prices, priceSorts } = query

//      //let products = await productModel.find({availableSizes, title: /.*titlebar.*/i, price : { '$gt' : prices.priceGreaterThan , '$lt' : prices.priceLessThan }})
//     //     if (Array.isArray(products) && products.length === 0) {  
//     //         return res.status(404).send({ status: false, message: 'No products found' })
//     //     }

//         //let productsOfQuery = await productModel.find({availableSizes, title: /.title./i, price : { '$gt' : prices.priceGreaterThan , '$lt' : prices.priceLessThan }, isDeleted:false}).sort({ price: priceSorts })
//        const productsOfQuery = await productModel.find({availableSizes:size, title: /.*title.*/i})
//         return res.status(200).send({ status: true, message: 'Books list', data: productsOfQuery })

//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message })
//     }
// }
// console.log(req.query)
// const myURL = new URL(req.url, 'https://localhost:3000/');
// console.log(myURL)
const getProduct = async function (req, res) {
    try {
        const queryParams = req.query
        if (!isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: 'Please provide book details' })
        }
        let { size, name, price, priceSort } = req.query

        let query = { isDeleted: false };
        if (isValid(size)) {
            if (!isValidAvailableSizes(size)) {
                return res.status(400).send({ status: false, message: ' Please provide size' })
            } else {
                query['availableSizes'] = size
            }
        }
        if (isValid(name)) {
            query['title'] = { $regex: /.*$name.*/i }
        }
        if (price) {
            price = JSON.parse(price)
            if (Object.keys(price).length == 1) {
                if (price.priceGreaterThan) {
                    if (typeof price.priceGreaterThan !== 'number') {
                        return res.status(400).send({ status: false, message: ' priceGreaterThan should be number' })
                    }
                    query['price'] = price.priceGreaterThan
                }
                if (price.priceLessThan) {
                    if (typeof price.priceLessThan !== 'number') {
                        return res.status(400).send({ status: false, message: ' pricelessThan should be number' })
                    }
                    query['price'] = price.priceLessThan
                }
            }
            if (Object.keys(price).length == 2) {
                if (price.priceGreaterThan && price.priceLessThan) {
                    if (typeof price.priceGreaterThan !== 'number') {
                        return res.status(400).send({ status: false, message: ' priceGreaterThan should be number' })
                    }
                    if (typeof price.priceLessThan !== 'number') {
                        return res.status(400).send({ status: false, message: ' pricelessThan should be number' })
                    }
                    query['price'] = { '$gt': price.priceGreaterThan, '$lt': price.priceLessThan }
                }
            }
        }

        if (priceSort) {
            if (!(priceSort == -1 || priceSort == 1)) {
                return res.status(400).send({ status: false, message: ' Please provide priceSort value 1 ||-1' })
            }
        }
        let productsOfQuery = await productModel.find(query).sort({ price: priceSort })
        if (Array.isArray(productsOfQuery) && productsOfQuery.length === 0) {
            return res.status(404).send({ status: false, message: 'No products found' })
        }
        return res.status(200).send({ status: true, message: 'product list', data: productsOfQuery })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
const getProductById = async function (req, res) {
    try {
        const productId = req.params.productId
       
        if (!(isValid(productId) && isValidObjectId(productId))) {
            return res.status(400).send({ status: false, message: "productId is not valid" })
        }
        const product = await productModel.findOne({ _id: productId, isDeleted:false })
        if (!product) {
            res.status(404).send({ status: false, message: `product not found` })
            return
        }
          res.status(200).send({ status: true, message: "Product Details", data: product })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
const deleteProduct = async function(req,res){
    try{
        const productId = req.params.productId
        if (!(isValid(productId) && isValidObjectId(productId))) {
            return res.status(404).send({ status: false, message: "productId is not valid" })
        }
        const deletedProduct = await productModel.findOneAndUpdate({_id:productId,isDeleted:false},{isDeleted:true,deletedAt:new Date()},{new:true})
        if(deletedProduct){
        res.status(200).send({status:true,msg:"This book has been succesfully deleted"})
        return
    }
        res.status(404).send({ status: false, message: `product alredy deleted not found` })
    }catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createProduct, updateProduct, getProduct,getProductById,deleteProduct }