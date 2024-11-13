import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation} from 'react-apollo';
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'
// import { useEffect } from 'react';

const QuickOrder = () => {
    const [getProductData, {data: product }] = useLazyQuery(GET_PRODUCT);
    const [addtoCart] = useMutation(UPDATE_CART);
    const [inputText, setInputText] = useState('');
    const [search, setSearch] = useState('');
    const [notFoundProduct, setNotFoundProduct] = useState('');

    const handleChange = (event: any) => {
        setInputText(event.target.value)
    }

    const searchProduct = (event: any) => {
        event.preventDefault();
        if(!inputText) {
            // alert('No a ingresado NADA')
            setNotFoundProduct('No a ingresado NADA')
        } else {
            setSearch(inputText)
            getProductBySku()
        }
    }

    const updateAddtoCart = (productId: string) => {
        const skuId = parseInt(productId)
        addtoCart({
            variables: {
                salesChannel: "1",
                items: [
                    {
                        id: skuId,
                        quantity: 1,
                        seller: "1"
                    }
                ]
            }
        })
        .then(() => {
            window.location.href = "/checkout"
        })
    };

    const getProductBySku = () => {
        getProductData({
            variables: {
                sku: inputText
            }
        })
    };

    useEffect(() => {
        console.log("Mi data es: ", product)
        if(product) {
            updateAddtoCart(product?.product?.productId)
        } else {
            setNotFoundProduct('No existe el sku, ingresado')
        }
    }, [search, product])

    // useEffect(() => {
    //     getProductBySku()
    // }, [])

    return(
        <>
    <div>Compra super rapida</div>
        <form onSubmit={searchProduct}>
            <div>
                <label htmlFor='sku'>Ingrese su SKU</label>
                <input id='sku' type='text' onChange={handleChange}></input>
            </div>
            <input type='submit' value='AÑADIR AL CARRITO'></input>
            </form>
            {
                notFoundProduct && (
                    <h1>{notFoundProduct}</h1>
                )
            }
        </>
    )
};

export default QuickOrder;