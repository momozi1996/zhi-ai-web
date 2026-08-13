/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        paper: "#FFFFFF",
        hall: "#F3F5FA",
        arcade: {
          blue: "#1E5EFF",
          yellow: "#FFC53D",
          "yellow-soft": "#FFD76B",
          red: "#F04438",
          green: "#22B07D",
        },
        body: "#4A5164",
        faint: "#8A90A0",
        hairline: "#E4E7EF",
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
      },
      fontFamily: {
        kuaile: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', "sans-serif"],
        silk: ['Silkscreen', "monospace"],
        vt: ['VT323', "monospace"],
        sans: ['"Noto Sans SC"', '"PingFang SC"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0",
        xl: "0",
        lg: "0",
        md: "0",
        sm: "0",
        xs: "0",
      },
      boxShadow: {
        hard: "4px 4px 0 #0B0B0F",
        "hard-sm": "2px 2px 0 #0B0B0F",
        "hard-lg": "8px 8px 0 #0B0B0F",
        "hard-blue": "8px 8px 0 #1E5EFF",
        "hard-yellow": "10px 10px 0 #FFC53D",
        "hard-red": "8px 8px 0 #F04438",
        "hard-green": "8px 8px 0 #22B07D",
        "hard-press": "1px 1px 0 #0B0B0F",
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}