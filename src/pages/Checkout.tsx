import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, updateQuantity, clearCart } = useCart();
    const totalPrice = getTotalPrice();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/16140274/uekqixn/";

        if (formData.name && items.length > 0) {
            try {
                const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
                const { db } = await import("@/firebaseConfig");

                const now = new Date().toLocaleString();

                // Save to Firebase AND Send to Webhook for each item
                const processOrders = items.map(async (item) => {
                    // 1. Firebase Save
                    const firebasePromise = addDoc(collection(db, "order_records"), {
                        customerName: formData.name,
                        itemName: item.name,
                        quantity: item.quantity,
                        category: item.category,
                        timestamp: serverTimestamp(),
                    });

                    // 2. Zapier Webhook (Individual request per item for individual sheet rows)
                    const webhookPromise = fetch(ZAPIER_WEBHOOK_URL, {
                        method: "POST",
                        mode: "no-cors", // Use no-cors to avoid preflight issues with Zapier hooks
                        body: JSON.stringify({
                            Name: formData.name,
                            Timestamp: now,
                            Item: item.name,
                            Quantity: item.quantity,
                            Category: item.category
                        })
                    });

                    return Promise.all([firebasePromise, webhookPromise]);
                });

                await Promise.all(processOrders);
                setIsSubmitted(true);
            } catch (error) {
                console.error("Error submitting order:", error);
                alert("There was an error placing your order. Please try again.");
            }
        }
    };

    const handleBackToMenu = () => {
        clearCart();
        navigate("/");
    };

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/60 backdrop-blur-xl"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.6
                        }
                    }}
                    className="relative bg-background border border-border p-8 md:p-12 max-w-lg w-full text-center shadow-2xl overflow-hidden"
                >
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
                    />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 10 }}
                            className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                            <CheckCircle2 size={40} className="text-primary" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="font-heading text-4xl font-light text-foreground mb-4 tracking-tight"
                        >
                            Thank you, {formData.name.split(' ')[0]}!
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-4"
                        >
                            <p className="text-muted-foreground text-lg">
                                Your order for <span className="font-semibold text-foreground">{items.length} items</span> has been placed successfully.
                            </p>
                            <div className="h-px w-12 bg-border mx-auto my-6" />
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            onClick={handleBackToMenu}
                            className="bg-primary text-primary-foreground px-10 py-4 rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:opacity-90 transition-all mt-10 w-full hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Explore More Menu
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="font-heading text-3xl font-light mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Add some delicious items from our menu to get started.</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-none text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 max-w-4xl mx-auto w-full px-6 py-12"
        >
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="flex flex-col gap-8">
                    <h1 className="font-heading text-4xl font-light text-foreground tracking-tight">
                        Complete Your Order
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Gwyneth Paltrow"
                                className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-none text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity w-full mt-4"
                        >
                            Place My Order
                        </button>
                    </form>
                </div>

                <div className="p-8 bg-muted/30 border border-border sticky top-24">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6">Order Summary</h2>
                    <div className="flex flex-col gap-4 mb-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
                                <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className="text-xs text-muted-foreground w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-foreground">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Delivery</span>
                            <span className="font-medium text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 text-lg border-t border-border mt-4">
                            <span className="font-heading font-light tracking-tight">Total</span>
                            <span className="font-bold">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Checkout;
