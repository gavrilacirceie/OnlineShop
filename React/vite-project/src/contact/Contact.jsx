import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState } from "react";

const contactInfo = [
    {
        icon: FaPhone,
        title: "Phone",
        detail: "0772594123",
        subtitle: "Mon-Fri, 09-18",
        color: "from-emerald-400 to-teal-500",
    },
    {
        icon: FaEnvelope,
        title: "Email",
        detail: "support@onlineshop.com",
        subtitle: "We reply within 24h",
        color: "from-blue-400 to-indigo-500",
    },
    {
        icon: FaMapMarkerAlt,
        title: "Address",
        detail: "Strada Ciresilor",
        subtitle: "Bucharest, Romania",
        color: "from-amber-400 to-orange-500",
    },
    {
        icon: FaClock,
        title: "Working Hours",
        detail: "Mon - Fri: 09 - 18",
        subtitle: "Sat: 10 - 14",
        color: "from-rose-400 to-pink-500",
    },
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <span className="text-sm font-semibold tracking-widest text-amber-400 uppercase">
                            Get In Touch
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
                            We'd Love to
                            <br />
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Hear From You
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Have a question, suggestion, or just want to say hello?
                            Drop us a message and our team will get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="max-w-6xl mx-auto -mt-10 px-6 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactInfo.map((info, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <info.icon className="text-white text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{info.title}</h3>
                            <p className="text-slate-700 font-medium">{info.detail}</p>
                            <p className="text-gray-400 text-sm mt-1">{info.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form + Map Section */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-3 mb-8">
                            <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase">
                                Send a Message
                            </span>
                            <h2 className="text-4xl font-extrabold text-slate-800 leading-tight">
                                Contact <span className="text-amber-500">Form</span>
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300"
                            >
                                Send Message
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Map / Visual Side */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-20" />
                            <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-2xl p-10 text-white shadow-xl overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
                                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />

                                <div className="relative z-10 space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Let's Connect</h3>
                                        <p className="text-gray-400">
                                            Whether you have a question about products, pricing, or anything else, our team is ready to answer all your questions.
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                                <FaEnvelope className="text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Email us at</p>
                                                <p className="font-semibold">support@eshop.com</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                                <FaPhone className="text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Call us at</p>
                                                <p className="font-semibold">0772594123</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-gray-400 text-sm">
                                            Average response time: <span className="text-amber-400 font-semibold">2 hours</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

