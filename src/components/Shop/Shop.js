import React, {useEffect, useState} from "react";
import "./Shop.scss";
import {Col, Container, Row} from "react-bootstrap";

import CartItem from '../CartItem/CartItem';
import VariationProductModal from "../VariationProductModal/VariationProductModal";
import ProductItem from "../ProductItem/ProductItem";
import OrderSummary from "../OrderSummary/OrderSummary";
import Filter from "../Filter/Filter";
import useProduct from "../../hooks/useProduct";
import useCategory from "../../hooks/useCategory";

const Shop = () => {
    const [products,allProduct, setProducts] = useProduct();
    const [categories] = useCategory();

    const [cart, setCart] = useState([]);

    const [show, setShow] = useState(false);
    const [variationProduct, setVariationProduct] = useState({})

    const createShoppingCart = selectedItem => {
        const exist = cart?.find((cartItem) => cartItem.unique_key === selectedItem.unique_key);
        if (exist) {
            setCart(cart.map((x) => x.unique_key === selectedItem.unique_key ? {...x, qty: x.qty + 1} : {...x}))
        } else {
            setCart([...cart, {...selectedItem, qty: 1}])
        }
    }


    const handleCart = product => {
        if (!product.multiple) {
            createShoppingCart(product)
        } else {
            setShow(true);
            setVariationProduct(product)
        }
    }

    const incDecHandle = (operationType, operationalProductID) => {
        if (operationType === "increment") {
            setCart(cart.map((x) => x.unique_key === operationalProductID ? {...x, qty: x.qty + 1} : {...x}))
        } else {
            setCart(cart.map((x) => x.unique_key === operationalProductID && x.qty > 1 ? {
                ...x,
                qty: x.qty - 1
            } : {...x}))
        }
    }
    const updateQuantity = (event, updatedProductID) => {
        const updatedQty = parseInt(event.target.value);
        if (updatedQty > 0) {
            setCart(cart.map((x) => x.unique_key === updatedProductID ? {...x, qty: updatedQty} : {...x}))
        } else {
            alert("Updated quantaty should be more then 1")
        }
    }
    const removeCartItem = (removedID) => {
        setCart(cart.filter((x) => x.unique_key !== removedID))
    }


    const filterProductByCat = (catID) => {
        catID ? setProducts(allProduct.filter((x) => x.category_id === catID)) : setProducts(allProduct)
        // setProducts(allProduct.filter((x) => x.category_id === catID))
    }
    const filterProductByName = (insertedProductName) => {
        // catID ? setProducts(allProduct.filter((x) => x.category_id === catID)) : setProducts(allProduct)
        // setProducts(allProduct.filter((x) => x.category_id === catID))
        // console.log(event.target.value)
        console.log(insertedProductName);
        // insertedProductName.length>3? setProducts(allProduct.filter(product => product) : setProducts(allProduct)
        insertedProductName.length > 2 ? setProducts(allProduct.filter((x) => x.name.toLowerCase().includes(insertedProductName.toLowerCase()))) : setProducts(allProduct)
    }
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>

                        <div className="shopping-page-wrapper">
                            <div className="shop-container">
                                <div>
                                    <Filter categories={categories} filterProductByCat={filterProductByCat} filterProductByName={filterProductByName}></Filter>

                                </div>
                                <div className="product-wrapper main-product-grid">
                                    {products?.map((product) => <ProductItem key={product.unique_key} product={product}
                                                                             handleCart={handleCart}></ProductItem>)}
                                </div>
                            </div>

                            <div className="cart-wrapper">
                                {/*<button onClick={()=> removeCartItem("Ami koi")}>Test</button>*/}
                                {cart.length > 0 && <OrderSummary cart={cart}></OrderSummary>}
                                {cart?.map((cartItem) => <CartItem key={cartItem.unique_key} cart={cartItem}
                                                                   removeCartItem={removeCartItem}
                                                                   updateQuantity={updateQuantity}
                                                                   incDecHandle={incDecHandle}> {cartItem.name} </CartItem>)}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <VariationProductModal show={show} setShow={setShow} variationProduct={variationProduct}
                                   handleCart={handleCart}></VariationProductModal>
        </div>
    );
};

export default Shop;
