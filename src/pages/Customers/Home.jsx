import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import KeypadModal from "../../components/KeypadModal";
import CategoryButtons from "../../components/CategoryButtons";
import KeyPad from "../../assets/keyPad.png";
import { Link } from "react-router-dom";
import VendingIcon from "../../assets/VendingMachine.png";
import CartIcon from "../../assets/Cart.png";
import Ting from "../../assets/ting.mp3";
import { getCartItems, getProducts, addToCart as addItemToCart } from "../../api/api";

function Home() {
  const [category, setCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const machineId = localStorage.getItem("machineId");

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({ queryKey: ["products"], queryFn: () => getProducts() });

  const {
    data: cartItems,
    isLoading: cartLoading,
    error: cartError,
  } = useQuery({ queryKey: ["cartItems", machineId], queryFn: getCartItems });

  // Update filtered products when products data or category changes
  React.useEffect(() => {
    if (products) {
      setFilteredProducts(filterProducts(products.data.data, category));
    }
  }, [products, category]);

  const openKeypad = () => {
    setShowModal(true);
  };

  const closeKeypad = () => {
    setShowModal(false);
  };

  const sortByCat = (myCategory) => {
    setCategory(myCategory);
    setFilteredProducts(filterProducts(products.data.data, myCategory));
  };

  const filterProducts = (products, category) => {
    return category === ""
      ? products
      : products.filter((product) => product.category === category);
  };

  const filterProductsByProductNumber = (number) => {
    setInputValue(number);
    setFilteredProducts(
      products.data.data.filter((product) =>
        product.productNumber.toString().includes(number)
      )
    );
  };

  // const addToCart = async (product) => {
  //   const tingSound = new Audio(Ting);

  //   try {
  //     // const response = await addItemToCart(product._id)
  //     const {data: addCartData, isPending, error:addCartError, mutate: addToCartMutate} = useMutation({
  //       mutationFn: addItemToCart,
  //       onMutate: async () => { 
  //         await cartLoading(true);
  //         tingSound.play();
  //         },
  //     })

  //     const updatedProducts = products.data.data.map((p) =>
  //       p._id === product._id ? { ...p, stock: p.stock - 1 } : p
  //     );

  //     setFilteredProducts(updatedProducts);
  //   } catch (error) {
  //     console.error("Failed to add to cart:", error);
  //   }
  // };

  if (productsLoading || cartLoading) return <div>Loading...</div>;
  if (productsError || cartError) return <div>Error loading data</div>;

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <nav className="flex w-full justify-between bg-gray-200 p-4 mb-8 px-6 items-center">
        <Link to="/" className="flex items-center font-bold text-2xl">
          <img src={VendingIcon} alt="Vending Machine" />
          <h1>Vending</h1>
        </Link>
        <Link to="/carts">
          <img src={CartIcon} alt="Cart" className="w-8 h-8" />
        </Link>
      </nav>

      <CategoryButtons
        categories={["beverage", "snacks", "chocolate"]}
        onCategorySelect={sortByCat}
        activeCategory={category}
      />

      <div className="bg-white items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            id="product-container"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                myCart={cartItems.data.data}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-4 right-4 rounded-full px-3 pt-3 pb-2 bg-orange-400 cursor-pointer"
        onClick={openKeypad}
      >
        <img src={KeyPad} alt="Keypad" className="h-8 w-8" />
      </div>

      {showModal && (
        <KeypadModal
          inputValue={inputValue}
          onInputChange={filterProductsByProductNumber}
          onClose={closeKeypad}
          className={showModal ? "show" : "hide"}
        />
      )}
    </div>
  );
}

export default Home;
