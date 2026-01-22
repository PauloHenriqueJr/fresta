import { motion } from "framer-motion";
import { Sparkles, Gift, Box, Plus } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
}

const EmptyState = ({ title, description, buttonText, onClick }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {/* Illustration Container */}
            <div className="relative mb-12">
                {/* Main background circle/square */}
                <motion.div
                    className="w-64 h-64 bg-secondary rounded-[40px] flex items-center justify-center relative shadow-sm overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Decorative inner dotted border */}
                    <div className="absolute inset-6 border-2 border-dashed border-primary/20 rounded-[32px]" />

                    {/* Central Box Icon */}
                    <motion.div
                        className="w-32 h-32 bg-secondary-foreground/5 rounded-3xl flex items-center justify-center border border-primary/10"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 2, 0, -2, 0]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Box className="w-16 h-16 text-primary stroke-[1.5]" />
                    </motion.div>

                    {/* Background sparkles inside */}
                    <div className="absolute top-10 right-10 opacity-20">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                </motion.div>

                {/* Floating elements */}

                {/* Top Left Sparkle */}
                <motion.div
                    className="absolute -top-4 -left-4 text-primary"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <div className="relative">
                        <Sparkles className="w-10 h-10" />
                        <div className="absolute top-1 left-1 w-2 h-2 bg-primary rounded-full blur-[2px]" />
                    </div>
                </motion.div>

                {/* Top Right Star */}
                <motion.div
                    className="absolute top-12 -right-2 text-primary/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <span className="text-2xl">⭐</span>
                </motion.div>

                {/* Bottom Right Floating Gift */}
                <motion.div
                    className="absolute -bottom-4 -right-2 w-16 h-16 bg-card rounded-2xl shadow-card flex items-center justify-center border border-border"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <Gift className="w-8 h-8 text-primary" />
                </motion.div>
            </div>

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-xs space-y-4"
            >
                <h2 className="text-3xl font-black text-foreground leading-tight px-4">
                    {title}
                </h2>
                <p className="text-muted-foreground font-medium leading-relaxed px-2 text-[15px]">
                    {description}
                </p>
            </motion.div>

            {/* Action Button */}
            <motion.button
                className="btn-festive mt-10 w-full max-w-xs py-5 text-lg shadow-xl shadow-primary/20"
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {buttonText}
            </motion.button>
        </div>
    );
};

export default EmptyState;
