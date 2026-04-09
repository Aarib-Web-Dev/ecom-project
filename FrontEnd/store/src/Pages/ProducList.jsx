import { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";

function ProductList() {
    const [Products, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const BASEURL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        console.log(BASEURL)
        fetch(`${BASEURL}/api/products/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Fail to fetch products");

                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">Loading...</div>
        </div>
    }


    if (error) {
        return <div>Error:{error}</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-6 bg-white shadow-md ">Product List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {Products.length > 0 ? (
                    Products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">No products available</p>
                )
                }
            </div>
        </div>
    )
}

export default ProductList;