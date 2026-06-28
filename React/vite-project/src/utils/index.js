import {
    FaBox,
    FaClipboardList,
    FaStore,
    FaTags,
    FaTachometerAlt,
} from "react-icons/fa";

export const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: FaTachometerAlt },
    { name: "Products", href: "/admin/products", icon: FaBox },
    { name: "Sellers", href: "/admin/sellers", icon: FaStore },
    { name: "Orders", href: "/admin/orders", icon: FaClipboardList },
    { name: "Categories", href: "/admin/categories", icon: FaTags },
];

export const sellerNavigation = [
    { name: "Dashboard", href: "/seller", icon: FaTachometerAlt },
    { name: "Products", href: "/seller/products", icon: FaBox },
    { name: "Orders", href: "/seller/orders", icon: FaClipboardList },
];

export const bannerLists = [
    {
        id: 1,
        title: "🔥 Best Deals",
        subtitle: "Spring Collection",
        description: "Up to 50% off on our latest arrivals. Don't miss out on these amazing deals!",
        image: "/favicon.svg",
    },
    {
        id: 2,
        title: "🆕 New Arrivals",
        subtitle: "Summer Sale",
        description: "Fresh styles just dropped. Discover trending products at unbeatable prices!",
        image: "/favicon.svg",
    },
    {
        id: 3,
        title: "⭐ Top Picks",
        subtitle: "Exclusive Offers",
        description: "Handpicked premium items curated by our experts, just for you!",
        image: "/favicon.svg",
    },
];
