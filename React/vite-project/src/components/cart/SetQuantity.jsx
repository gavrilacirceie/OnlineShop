const SetQuantity = ({
    quantity,
    cardCounter,
    handleQtyIncrement,
    handleQtyDecrement,}) =>{
    return(
    <div className="flex gap-4 items-center">
        {cardCounter ? null : <div className="text-sm font-medium text-slate-600">Quantity</div>}
        <div className="flex flex-row gap-0 items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
                disabled={quantity<=1}
                className="px-3 py-1.5 text-slate-700 font-bold text-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                onClick={handleQtyDecrement}>
                −
            </button>
            <div className="px-4 py-1.5 text-sm font-semibold text-slate-800 border-x border-gray-200 bg-gray-50 min-w-[40px] text-center">{quantity}</div>
            <button
                className="px-3 py-1.5 text-slate-700 font-bold text-lg hover:bg-gray-100 transition-colors duration-150"
                onClick={handleQtyIncrement}>
                +
            </button>
        </div>
    </div>
    )
};

export default SetQuantity;