import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CategoryFormModal = ({ category, onClose, onSave }) => {
    const [categoryName, setCategoryName] = useState(category?.categoryName || "");
    const [isSaving, setIsSaving] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        const trimmedName = categoryName.trim();
        if (!trimmedName) return;

        if (category) {
            const confirmed = window.confirm(
                `Rename category #${category.categoryId} from "${category.categoryName}" to "${trimmedName}"?`,
            );
            if (!confirmed) return;
        }

        setIsSaving(true);
        const wasSaved = await onSave(trimmedName);
        if (!wasSaved) setIsSaving(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
            onClick={onClose}
        >
            <form
                onSubmit={submit}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="category-form-title" className="text-xl font-bold text-slate-900">
                            {category ? "Edit category" : "Add category"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {category ? `Category #${category.categoryId}` : "Create a product category."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        aria-label="Close category form"
                    >
                        <FaTimes />
                    </button>
                </div>

                <label className="mt-6 block text-sm font-medium text-slate-700">
                    Category name
                    <input
                        autoFocus
                        value={categoryName}
                        onChange={(event) => setCategoryName(event.target.value)}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </label>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : category ? "Save changes" : "Create category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryFormModal;
