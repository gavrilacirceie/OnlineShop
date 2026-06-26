const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const getProductImageUrl = (image) => {
    if (!image) {
        return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    if (image.startsWith("/images/")) {
        return `${backendUrl}${image}`;
    }

    return `${backendUrl}/images/${image}`;
};
