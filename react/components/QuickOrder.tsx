import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation} from 'react-apollo';
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

const QuickOrder = () => {
    const CSS_HANDLES = [
        'quick__order-container',
        'quick__order-title',
        'quick__order-form',
        'quick__order-form-contain',
        'form__contain-lable',
        'form__contain-input',
        'form__contain-submit',
        'quick__order-notfound',
    ]
    const handles = useCssHandles(CSS_HANDLES)

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
            setNotFoundProduct('No has ingresado NADA');
        } else {
            setSearch(inputText);
            getProductBySku();
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
            updateAddtoCart(product?.product?.productId);
        } else {
            setNotFoundProduct('No existe el sku, ingresado');
        }
    }, [search, product])

    // useEffect(() => {
    //     getProductBySku()
    // }, [])

    return(
    <div className={`${handles['quick__order-container']}`}>
    <div className={`${handles['quick__order-title']}`}>Compra super rapida</div>
        <form onSubmit={searchProduct} className={`${handles['quick__order-form']}`}>
            <div className={`${handles['quick__order-form-contain']}`}>
                <label htmlFor='sku' className={`${handles['form__contain-lable']}`}>Ingrese su SKU</label>
                <input id='sku' type='text' onChange={handleChange} className={`${handles['form__contain-input']}`} />
            </div>
            <input type='submit' value='AÑADIR AL CARRITO' className={`${handles['form__contain-submit']}`}/>
            </form>
            {
                notFoundProduct && (
                    <h1 className={`${handles['quick__order-notfound']}`}>{notFoundProduct}</h1>
                )
            }
        </div>
    )
};

export default QuickOrder;