import { sql } from "../config/db.js";

export const getProducts = async(req, res) => {
try{
    const products =await sql`
    SELECT * FROM products
    `
    res.status(200).json({
        success: true,
        products: products
    });
}
catch(error){
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}


export const createProduct = async(req, res) => {
const { name, image, price } = req.body;

if (!name || !image || !price) {
    return res.status(400).json({ error: 'All fields are required' });
}

try{
   const createProducts=await sql `
   INSERT INTO products (name,IMAGE,price) VALUES (${name},${image},${price})
   `

   if(createProducts.count===0){
       return res.status(400).json({ error: 'Failed to create product' });
   }

   res.status(201).json({
         success: true,
            message: 'Product created successfully',
            product:createProducts[0]
   })
}
catch(error){   
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}

};


export const getProduct=async(req,res,next)=>{
    const {id}=req.params;

    try{
      const product = await sql `
      SELECT * FROM products WHERE id=${id}
      `

      res.status(200).json({
          success: true,
          product: product[0] || null
      });
    }
    catch(error){
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateProduct = async(req, res) => {
const { id } = req.params;
const { name, image, price } = req.body;

if (!name || !image || !price) {
    return res.status(400).json({ error: 'All fields are required' });
}

try{
    const updateProduct = await sql `UPDATE products SET name=${name}, image=${image}, price=${price} WHERE id=${id}`;

    if (updateProduct.count === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: updateProduct[0]
    });
}
catch(error){
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};


export const deleteProduct = async(req, res) => {
const { id } = req.params;      

try{
    const deleteProduct = await sql `DELETE FROM products WHERE id=${id}`;
    if (deleteProduct.count === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        product: deleteProduct[0]
    });
}
catch(error){
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};