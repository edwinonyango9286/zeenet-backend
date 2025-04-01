const expressAsyncHandler = require("express-async-handler")
const ProductParentCategory = require("../models/productParentCategoryModel")
const _ = require("lodash")
const { sentenceFormater, paragraphFormater } = require("../utils/stringFormatters")
const validateMongodbId  = require("../utils/validateMongodbId")
const redis = require("../utils/redis")


const createAProductParentCategory = expressAsyncHandler(async(req,res)=>{
    try {
        const {name,description} = req.body
        if(!name || !description){
            throw new Error("Please provide all the required fileds.")
        }
        // check for already existing parent category
        const existingProductParentCategory = await ProductParentCategory.findOne({ name: sentenceFormater(name)})
        if(existingProductParentCategory) {
            throw new Error(`Product parent category ${existingProductParentCategory.name} already exist. `)
        }
        const createdProductParentCategory = await  ProductParentCategory.create({ ...req.body, createdBy:req.user._id , name:sentenceFormater(name), description: paragraphFormater(description)})

        // Invalidate the cached list of product parent categories
        if(createdProductParentCategory){
            const listCacheKey = `productParentCategories:*`;
            const keys = await redis.keys(listCacheKey);
            keys.forEach((key)=>{redis.del(key)})
        }

        return res.status(200).json({ status:"SUCCESS", message:"Parent ptoduct category created successfully.", data:createdProductParentCategory})
        
    } catch (error) {
        throw new Error(error)
    }
})


const updateAProductParentCategory = expressAsyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        validateMongodbId(id)
        const {name,description} = req.body
        if(!name || !description){
            throw new Error("Please provide all the required fileds.")
        }
        const updatedProductParentCategory = await ProductParentCategory.findOneAndUpdate({ _id: id, isDeleted:false}, { ...req.body , updatedBy:req.user._id, name: sentenceFormater(name), description:paragraphFormater(description)} ,{new:true,runValidators:true})
        if(!updatedProductParentCategory){
            throw new Error("Product parent category not found.")
        }

        if(updatedProductParentCategory){
            // invalidate the single product in the cache
            const singleCacheKey = `productParentCategory:${id}`
            await redis.del(singleCacheKey);

         // invalidate the whole cache
         const listCacheKey = `productParentCategories:*`;
         const  keys = await redis.keys(listCacheKey)
         keys.forEach((key)=> redis.del(key))
        }
        return res.status(200).json({ status:"SUCCESS", message:"Product parent category updated successfully.", data: updatedProductParentCategory})
    } catch (error) {
        throw new Error(error)
    }
})

const getAProductParentCategory = expressAsyncHandler(async(req,res)=>{
    try {
        const {id}= req.params;
        validateMongodbId(id);

        // get product parent category from the cached data
        const cacheKey = `productParentCategory:${id}`;
        const cachedProductParentCategory = await redis.get(cacheKey)

        if(cachedProductParentCategory){
            return res.status(200).json({ status:"SUCCESS", data: JSON.parse(cachedProductParentCategory)})
        }

        const productParentCategory = await ProductParentCategory.findOne({ _id:id, isDeleted:false}).populate({ path:"createdBy", select:"firstName lastName"}).populate({ path:"updatedBy", select:"firstName lastName"})
        if(!productParentCategory){
            throw new Error("Product parent category not found.")
        }

        await redis.set(cacheKey, JSON.stringify(productParentCategory), "EX" , 8640000);
        return res.status(200).json({ status:"SUCCESS", data: productParentCategory})
        
    } catch (error) {
        throw new Error(error)
    }
})


const getAllProductParentCategories = expressAsyncHandler(async(req,res)=>{
    try {
        const queryObject = {...req.query};
        excludedFields= ["page", "limit", "offset", "sort", "fields"];
        excludedFields.forEach((el)=> delete queryObject[el])

        let query = ProductParentCategory.findOne({ ...queryObject, isDeleted:false}).populate({ path :"createdBy", select: "firstName lastName"}).populate({ path: "updatedBy", select:"firstName lastName"});

        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt")
        }

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields)
        }else{
            query = query.select("-__v")
        }

        const limit = Math.min(parseInt(req.query.limit, 10) || 10,100);
        const offset = Math.max(parseInt(req.query.offset, 10) || 0,0);
        query = query.skip(offset).limit(limit)


        const cacheKey = `productParentCategories:${JSON.stringify(queryObject)}:${req.query.sort}:${req.query.fields}:${limit},${offset}`;
        const cachedProductParentCategory = await redis.get(cacheKey);

        if(cachedProductParentCategory){
            const cachedData = JSON.parse(cachedProductParentCategory);
            return res.status(200).json({status: "SUCCESS",data: cachedData.data,totalCount: cachedData.totalCount,totalPages: cachedData.totalPages,limit,offset})
        }


    const productParentCategories = await query;
    const totalCount = await ProductParentCategory.countDocuments({ ...queryObject, isDeleted: false });
    const totalPages = Math.ceil(totalCount / limit);

    // Cache the blog categories along with metadata
    const cacheData = {data: productParentCategories,totalCount,totalPages};
    await redis.set(cacheKey, JSON.stringify(cacheData), "EX", 8640000);

    return res.status(200).json({status: "SUCCESS",data: productParentCategories,totalCount,totalPages,limit,offset});
    } catch (error) {
        throw new Error(error)
    }
})

const deleteAProductParentCategory = expressAsyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        validateMongodbId(id)

        const deletedProductParentCategory = await ProductParentCategory.findOneAndUpdate({ _id:id, isDeleted:false}, {isDeleted:true, deletedAt:Date.now(),deletedBy: req.user._id }, { new:true, runValidators:true});
        if(!deletedProductParentCategory){
            throw new Error("Product parent category not found.")
        }
        
        if(deletedProductParentCategory){
            const singleCacheKey = `productParentCategory:${id}`;
            await redis.del(singleCacheKey)

            const listCacheKey = `productParentCategories:*`
            const keys = await redis.keys(listCacheKey);
            keys.forEach((key)=> redis.del(key))
        }
        return res.status(200).json({ status:"SUCCESS", message:"Product parent category deleted successfully.", data: deletedProductParentCategory})
    } catch (error) {
        throw new Error(error)
    }
})





module.exports ={ createAProductParentCategory,updateAProductParentCategory, getAProductParentCategory, deleteAProductParentCategory, getAllProductParentCategories}