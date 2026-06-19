import {useEffect, useState} from "react";
import {FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch} from "react-icons/fi";
import {Button, FormControl, InputLabel, MenuItem, Select, Tooltip} from "@mui/material";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

const Filter = ({categories}) => {

    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathName = useLocation().pathname;
    const navigate = useNavigate()

    const [category, setCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const currentCategory = searchParams.get("category") || "all";
        const sortOrder = searchParams.get("sortBy") || "asc";
        const currentSearchTerm = searchParams.get("keyword") || "";

        setCategory(currentCategory);
        setSortOrder(sortOrder);
        setSearchTerm(currentSearchTerm);
    }, [searchParams]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const currentParams = new URLSearchParams(window.location.search);
            if(searchTerm){
                currentParams.set("keyword", searchTerm);
            }else{
                currentParams.delete("keyword");
            }
            navigate(`${pathName}?${currentParams.toString()}`);
        }, 700);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, navigate, pathName]);
    const handleCategoryChange = (e) => {
      const selectedCategory = e.target.value;
      if (selectedCategory === "all") {
          params.delete("category");
      } else {
          params.set("category", selectedCategory);
      }
      navigate(`${pathName}?${params}`);
      setCategory(e.target.value);
    };
    const toggleSortOrder = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        params.set("sortBy", newOrder);
        navigate(`${pathName}?${params}`);
    };

    const handleClearFilters = () => {
        navigate({pathName : window.location.pathname});

    }
    return(
        <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
            {/* Search bar */}
            <div className="relative flex items-center 2xl:w-[450px] sm:w-[420px] w-full">
                <input type={"text"} placeholder={"Search..."}
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className={"border border-gray-400 text-slate-800 rounded-md py-2 pl-10 pr-4 w-full focus:outline-hidden focus:ring-2 focus:ring-[#1976d2]"} />
                <FiSearch className="absolute left-3 text-slate-800 size={20}"/>
            </div>

            <div className="flex sm:flex-row flex-col gap-4 items-center">
                <FormControl
                    className="text-slate-800 border-slate-700"
                    variant="outlined"
                    size="small">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        value={category}
                        onChange={handleCategoryChange}
                        label="Category"
                        className="min-w-[120px] text-slate-800 border-slate-700"
                    >
                        <MenuItem value="all">All</MenuItem>
                        {categories.map((item) => (
                            <MenuItem key={item.categoryId} value={item.categoryName}>
                                {item.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* SORT BUTTON & CLEAR FILTER */}
                <Tooltip title="Sorted by price: asc">
                    <Button variant="contained"
                            onClick={toggleSortOrder}
                            color="primary"
                            className="flex items-center gap-2 h-10">
                        Sort By
                        {sortOrder === "asc" ? (
                            <FiArrowUp size={20} />
                        ) : (
                            <FiArrowDown size={20} />
                        )}
                    </Button>
                </Tooltip>

                <button
                    className="flex items-center gap-2 bg-rose-900 text-white px-3 py-2 rounded-md transition duration-300 ease-in shadow-md focus:outline-hidden"
                    onClick={handleClearFilters}
                >
                    <FiRefreshCw className="font-semibold" size={16}/>
                    <span className="font-semibold">Clear Filter</span>
                </button>
            </div>
        </div>
    );
}

export default Filter;