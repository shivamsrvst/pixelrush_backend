const Product=require("../models/Product");


module.exports={

    createProduct:async(req,res) =>{
        const newProduct=new Product(req.body);
        try {
            await newProduct.save();
            res.status(201).json("Product created Succesfully")
            
        } catch (error) {
            res.status(500).json("Failed to create the product")
            console.log(error);
        }
    },

    getAllProducts:async(req,res) =>{
        try {
            const products=await Product.find().sort({ createdAt: -1})
            res.status(200).json(products)

        } catch (error) {
            res.status(500).json("failed to get the products")            
        }
    },

    getProduct: async (req,res) =>{
        try {
            const product=await Product.findById(req.params.id)
            res.status(200).json(product)

        } catch (error) {

            res.status(500).json("failed to get the product")            

            
        }
    },
    searchProduct: async (req,res) =>{
        try {
            const result=await Product.aggregate(
                [
                    {
                      $search: {
                        index: "gaming",
                        text: {
                          query: req.params.key,
                          path: {
                            wildcard: "*"
                          }
                        }
                      }
                    }
                  ]
            )
            res.status(200).json(result)

        } catch (error) {
            res.status(500).json("failed to get the products")            

            
        }
    },

    updateProduct: async (req, res) => {
        try {
          // Identify the product to update
          const { id } = req.params;
      
          // Access the product data from request body
          const updateData = req.body;
      
          // Update the product in the database
          const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // To return the updated document
          );
      
          if (!updatedProduct) {
            return res.status(404).json("Product not found");
          }
      
          // Send the updated product data in response
          res.status(200).json({
            message: "Product updated Successfully",
            updatedProduct, // Include the updated product data
          });
        } catch (error) {
          console.error(error);
          res.status(500).json("Failed to update product");
        }
      },
    deleteProduct: async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from request parameters

    // Find the product to delete
    const product = await Product.findById(id);

    if (!product) { // Check if product exists
      return res.status(404).json("Product not found");
    }

    // Delete the product
    await product.remove();

    // Send successful deletion response
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to delete product");
  }
}
      


}