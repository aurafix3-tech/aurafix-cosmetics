import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant = null, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          item => 
            item.product._id === product._id && 
            JSON.stringify(item.variant) === JSON.stringify(variant)
        );

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
          toast.success('Cart updated!');
        } else {
          // Add new item
          const newItem = {
            id: `${product._id}-${Date.now()}`,
            product,
            variant,
            quantity,
            price: variant?.price || product.price
          };
          set({ items: [...items, newItem] });
          toast.success('Added to cart!');
        }
      },

      removeItem: (itemId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== itemId) });
        toast.success('Item removed from cart');
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },

      // Force clear cart on page load if needed
      validateCartItems: async () => {
        const { items } = get();
        if (items.length === 0) return;
        
        try {
          // Check if products still exist
          const validItems = [];
          for (const item of items) {
            try {
              const response = await fetch(`/api/products/${item.product._id}`);
              if (response.ok) {
                validItems.push(item);
              }
            } catch (error) {
              console.log(`Product ${item.product._id} no longer exists, removing from cart`);
            }
          }
          
          if (validItems.length !== items.length) {
            set({ items: validItems });
            toast.info('Some items were removed from cart as they are no longer available');
          }
        } catch (error) {
          console.error('Error validating cart items:', error);
        }
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingCost: () => {
        return 0; // No shipping cost for university delivery
      },

      getTax: () => {
        const total = get().getCartTotal();
        return total * 0.16; // 16% VAT in Kenya
      },

      getFinalTotal: () => {
        const subtotal = get().getCartTotal();
        const shipping = get().getShippingCost();
        const tax = get().getTax();
        return subtotal + shipping + tax;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export { useCartStore };

// Clear cart immediately to fix the product not found issue
if (typeof window !== 'undefined') {
  const cartData = localStorage.getItem('cart-storage');
  if (cartData) {
    localStorage.removeItem('cart-storage');
    console.log('Cleared cart due to invalid product references');
  }
}
