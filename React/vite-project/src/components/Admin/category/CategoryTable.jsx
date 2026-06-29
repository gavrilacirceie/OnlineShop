import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryTable = ({ categories, deletingId, onEdit, onDelete }) => {
    if (categories.length === 0) {
        return (
            <div className="px-6 py-16 text-center text-slate-500">
                No categories found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3.5">ID</th>
                        <th className="px-5 py-3.5">Category name</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {categories.map((category) => (
                        <tr key={category.categoryId} className="hover:bg-slate-50/80">
                            <td className="px-5 py-4 text-sm text-slate-500">
                                #{category.categoryId}
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-900">
                                {category.categoryName}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(category)}
                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                        aria-label={`Edit ${category.categoryName}`}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(category)}
                                        disabled={deletingId === category.categoryId}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                        aria-label={`Delete ${category.categoryName}`}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
