import { FaShoppingBag, FaShieldAlt, FaTruck, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom";


const features = [
    {
        icon: FaShoppingBag,
        title: "Curated Selection",
        description: "We handpick every product to ensure quality, style, and value for our customers.",
        color: "from-amber-400 to-orange-500",
    },
    {
        icon: FaShieldAlt,
        title: "Secure Shopping",
        description: "Your data and transactions are protected with industry-leading security standards.",
        color: "from-emerald-400 to-teal-500",
    },
    {
        icon: FaTruck,
        title: "Fast Delivery",
        description: "Enjoy swift and reliable shipping on every order, right to your doorstep.",
        color: "from-blue-400 to-indigo-500",
    },
    {
        icon: FaHeadset,
        title: "24/7 Support",
        description: "Our dedicated team is here to help you anytime — day or night.",
        color: "from-rose-400 to-pink-500",
    },
];

const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Products" },
    { value: "50+", label: "Brands" },
    { value: "99%", label: "Satisfaction" },
];

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <span className="text-sm font-semibold tracking-widest text-amber-400 uppercase">
                            Who We Are
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
                            We Build Shopping
                            <br />
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Experiences
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Welcome to E-Shop — your go-to destination for quality products at unbeatable prices.
                            We're passionate about connecting people with the things they love, all in one seamless platform.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="max-w-5xl mx-auto -mt-10 px-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center py-8 px-4">
                            <span className="text-3xl font-extrabold text-slate-800">{stat.value}</span>
                            <span className="text-sm text-gray-500 mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 space-y-6">
                        <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase">
                            Our Story
                        </span>
                        <h2 className="text-4xl font-extrabold text-slate-800 leading-tight">
                            From a simple idea to a
                            <span className="text-amber-500"> thriving marketplace</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            What started as a small passion project has grown into a platform trusted by thousands.
                            We believe shopping should be easy, enjoyable, and accessible to everyone.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Every product on our platform is carefully vetted to meet our high standards of quality,
                            so you can shop with confidence every time.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Explore Products
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-20" />
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                                alt="Our Story"
                                className="relative w-full h-80 object-cover rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center space-y-3 mb-14">
                        <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase">
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl font-extrabold text-slate-800">
                            What Makes Us Different
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="text-white text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
                    <div className="relative z-10 space-y-5">
                        <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to start shopping?</h2>
                        <p className="text-gray-400 max-w-lg mx-auto text-lg">
                            Join thousands of happy customers and discover products you'll love.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
                        >
                            Shop Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;



