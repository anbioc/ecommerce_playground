const asyncHandler = require('express-async-handler');
const Product = require("../model/product");
const { validateMongoDbID: idValidator } = require("../util/validateMongoDbID");
const slugify = require("slugify");

// Create product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const result = await Product.create(req.body);
        res.json({
            status: "success",
            product: result
        });
    } catch (e) {
        throw new Error("can't create product: " + e.messeage);
    }
});


// product list
const getProducts = asyncHandler(async (req, res) => {
    try {
        
        // filter
        const queryObject = { ...req.query };

        if (queryObject.minprice && queryObject.maxprice) {
            queryObject.price = {'$gte': queryObject.minprice, '$lte': queryObject.maxprice}
        }
       
         // sorting
         let sortBy 
         if (req.query.sort) {
            sortBy = {price: (req.query.sortOrder == "asc") ? -1 : 1}
         }

         // limit
         let fields
         if (req.query.fields) {
            fields = req.query.fields.split(',').join(" ");
         } else {
            fields = "-__v"
         }

         const page = req.query.page;
         const limit = req.query.limit;
         const skip = (page - 1) * limit;
         if (skip > await Product.countDocuments()) {
            throw new Error("this page doesn't exists");
         }
       
        const excludeFields = ['page', 'sort', 'sortOrder', 'limit', 'fields', 'minprice', 'maxprice']
        excludeFields.forEach((elem) => delete (queryObject[elem]));

        console.log(queryObject, excludeFields);

        res.status(200).json({
            status: "Success",
            products: await Product.find(queryObject)
            .sort(sortBy)
            .select(fields)
            .skip(skip)
            .limit(limit)
        });
    } catch (e) {
        throw new Error("Can't get product list: " + e.message);
    }
});

// get a product
const getProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            status: "success",
            product: product
        })
    } catch (e) {
        throw new Error("can't get the produc: " + e.message);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    try {

        idValidator(req.user.id);

        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const result = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        console.log(result);
        res.status(201).json({
            status: "success",
            product: result
        });
    } catch (e) {
        throw new Error("Can't update product " + e.message);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        res.status(201).json({
            status: "success",
            result: result
        });
    } catch (e) {
        throw new Error("Can't delete product: " + e.message);
    }
});

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };