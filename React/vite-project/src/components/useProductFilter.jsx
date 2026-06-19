import {useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchProducts} from "../store/actions/index.js";

const useProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {


        const params = new URLSearchParams(searchParams);
        const currentPage = searchParams.get("currentPage") ? Number(searchParams.get("currentPage")) : 1;
        params.set("pageNumber", currentPage - 1);

        const sortOrder = searchParams.get("sortBy") || "asc";
        const categoryParams = searchParams.get("category") || null;
        const keyword = searchParams.get("keyword") || null;

        params.set("sortBy", "productPrice");
        params.set("sortOrder", sortOrder);

        if(categoryParams){
            params.set("category", categoryParams);
        }

        if(keyword){
            params.set("keyword", keyword);
        }

        const queryString = params.toString();
        console.log("queryString", queryString);

        dispatch(fetchProducts(queryString));
    }, [dispatch, searchParams]);

};

export default useProductFilter;