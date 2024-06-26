const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");

module.exports = {
  addToCart: async (req, res) => {
    const userId = req.user.id;
    const { cartItem, quantity } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId }).populate('products.cartItem');
  
      if (cart) {
        const existingProduct = cart.products.find(
          (product) => product.cartItem._id.toString() === cartItem
        );
  
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          const productDetails = await Product.findById(cartItem);
          cart.products.push({ cartItem, quantity, price: productDetails.price, title: productDetails.title, imageUrl: productDetails.imageUrl });
        }
  
        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate('products.cartItem');
        res.status(200).json(updatedCart);
      } else {
        const newCart = new Cart({
          userId,
          products: [
            {
              cartItem,
              quantity: quantity,
            },
          ],
        });
        await newCart.save();
        const updatedCart = await Cart.findOne({ userId }).populate('products.cartItem');
        res.status(200).json(updatedCart);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  
  getCart: async (req, res) => {
    const userId = req.user.id;
    try {
      const cart = await Cart.find({ userId: userId }).populate(
        "products.cartItem",
        "_id title supplier price imageUrl "
      );

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteCartItem: async (req, res) => {
    const cartItemId = req.params.cartItemId;
    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { "products._id": cartItemId },
        { $pull: { products: { _id: cartItemId } } },
        { new: true }
      );
      if (!updatedCart) {
        return res.status(404).json("Cart item not found");
      }

      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  incrementCartItem: async (req, res) => {
    const { userId, cartItem } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json("Cart not found");
      }

      const existingProduct = cart.products.find(
        (product) => product.cartItem.toString() === cartItem
      );

      if (!existingProduct) {
        return res.status(404).json("Product not found");
      }

      existingProduct.quantity += 1; // Increment the quantity

      await cart.save();

      res.status(200).json("Product updated");
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  decrementCartItem: async (req, res) => {
    const { userId, cartItem } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json("Cart not found");
      }

      const existingProduct = cart.products.find(
        (product) => product.cartItem.toString() === cartItem
      );

      if (!existingProduct) {
        return res.status(404).json("Product not found");
      }

      if (existingProduct.quantity === 1) {
        cart.products = cart.products.filter(
          (product) => product.cartItem.toString() !== cartItem
        );
      } else {
        existingProduct.quantity -= 1;
      }

      await cart.save();

      res.status(200).json("Product updated");
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  deleteCart: async (req, res) => {
    const userId = req.user.id;
    try {
      // Find the cart by userId and delete it
      const deletedCart = await Cart.findOneAndDelete({ userId });
      if (!deletedCart) {
        return res.status(404).json("Cart not found");
      }
      res.status(200).json("Cart deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },

};
