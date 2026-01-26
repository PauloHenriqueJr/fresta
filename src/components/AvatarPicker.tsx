import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Check, User } from "lucide-react";
import { useAuth } from "@/state/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

// DiceBear avatar seeds for consistent 3D-style avatars
const AVATAR_SEEDS = [
    "Felix", "Aneka", "Jasmine", "Oliver",
    "Maya", "Lucas", "Sofia", "Marcus",
    "Luna", "Leo", "Aria", "Noah"
];

// Use DiceBear "lorelei" style for friendly, illustrated avatars
const getAvatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

interface AvatarPickerProps {
    isOpen: boolean;
    onClose: () => void;
    currentAvatar?: string | null;
    onSelect?: (avatarUrl: string) => void;
}

export default function AvatarPicker({ isOpen, onClose, currentAvatar, onSelect }: AvatarPickerProps) {
    const { user, updateProfile } = useAuth();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar || null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSelectAvatar = (avatarUrl: string) => {
        setSelectedAvatar(avatarUrl);
    };

    const handleSave = async () => {
        if (!selectedAvatar) return;

        setIsSaving(true);
        try {
            await updateProfile({ avatar: selectedAvatar });
            onSelect?.(selectedAvatar);
            toast.success("Avatar atualizado!");
            onClose();
        } catch (err) {
            console.error("Error saving avatar:", err);
            toast.error("Erro ao salvar avatar");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('user-uploads')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('user-uploads')
                .getPublicUrl(filePath);

            setSelectedAvatar(publicUrl);
            toast.success("Foto carregada!");
        } catch (err) {
            console.error("Upload error:", err);
            toast.error("Erro ao carregar foto");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card rounded-3xl p-6 w-full max-w-md shadow-2xl border border-border"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-foreground">Escolha seu Avatar</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Current Selection Preview */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-muted overflow-hidden border-4 border-primary/20 shadow-lg">
                            {selectedAvatar ? (
                                <img src={selectedAvatar} alt="Avatar selecionado" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {AVATAR_SEEDS.map((seed) => {
                            const url = getAvatarUrl(seed);
                            const isSelected = selectedAvatar === url;
                            return (
                                <button
                                    key={seed}
                                    onClick={() => handleSelectAvatar(url)}
                                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <img src={url} alt={`Avatar ${seed}`} className="w-full h-full object-cover" />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <Check className="w-6 h-6 text-primary" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Upload Photo Option */}
                    <label className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors mb-6">
                        <Camera className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                            {isUploading ? "Carregando..." : "Ou envie uma foto sua"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPhoto}
                            disabled={isUploading}
                            className="hidden"
                        />
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!selectedAvatar || isSaving}
                            className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
