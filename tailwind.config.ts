import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        nunito: ["Nunito", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        festive: {
          green: "hsl(var(--festive-green))",
          "green-light": "hsl(var(--festive-green-light))",
          yellow: "hsl(var(--festive-yellow))",
          "yellow-light": "hsl(var(--festive-yellow-light))",
        },
        carnaval: {
          purple: "hsl(var(--carnaval-purple))",
          "purple-light": "hsl(var(--carnaval-purple-light))",
          pink: "hsl(var(--carnaval-pink))",
          "pink-light": "hsl(var(--carnaval-pink-light))",
          yellow: "hsl(var(--carnaval-yellow))",
        },
        saojoao: {
          orange: "hsl(var(--saojoao-orange))",
          "orange-light": "hsl(var(--saojoao-orange-light))",
          brown: "hsl(var(--saojoao-brown))",
          yellow: "hsl(var(--saojoao-yellow))",
        },
        natal: {
          green: "hsl(var(--natal-green))",
          "green-light": "hsl(var(--natal-green-light))",
          red: "hsl(var(--natal-red))",
          "red-light": "hsl(var(--natal-red-light))",
          cream: "hsl(var(--natal-cream))",
        },
        pascoa: {
          lavender: "hsl(var(--pascoa-lavender))",
          "lavender-light": "hsl(var(--pascoa-lavender-light))",
          pink: "hsl(var(--pascoa-pink))",
          "pink-light": "hsl(var(--pascoa-pink-light))",
          yellow: "hsl(var(--pascoa-yellow))",
          "yellow-light": "hsl(var(--pascoa-yellow-light))",
          bg: "hsl(var(--pascoa-bg))",
        },
        romance: {
          red: "hsl(var(--romance-red))",
          "red-light": "hsl(var(--romance-red-light))",
          rose: "hsl(var(--romance-rose))",
          bg: "hsl(var(--romance-bg))",
        },
        wedding: {
          cream: "hsl(var(--wedding-cream))",
          card: "hsl(var(--wedding-card))",
          gold: "hsl(var(--wedding-gold))",
          "gold-soft": "hsl(var(--wedding-gold-soft))",
          ink: "hsl(var(--wedding-ink))",
          muted: "hsl(var(--wedding-muted))",
        },
        reveillon: {
          violet: "hsl(var(--reveillon-violet))",
          "violet-light": "hsl(var(--reveillon-violet-light))",
          gold: "hsl(var(--reveillon-gold))",
          bg: "hsl(var(--reveillon-bg))",
        },
        brasil: {
          green: "hsl(var(--br-green))",
          "green-light": "hsl(var(--br-green-light))",
          blue: "hsl(var(--br-blue))",
          "blue-light": "hsl(var(--br-blue-light))",
          yellow: "hsl(var(--br-yellow))",
          bg: "hsl(var(--br-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "confetti": "confetti 3s ease-out forwards",
      },
      boxShadow: {
        "festive": "0 8px 30px -10px hsl(145 30% 20% / 0.15)",
        "elevated": "0 20px 50px -15px hsl(145 30% 20% / 0.2)",
        "card": "0 4px 20px -4px hsl(145 30% 20% / 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
