import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          25: "hsla(var(--gray-25))",
          50: "hsla(var(--gray-50))",
          100: "hsla(var(--gray-100))",
          200: "hsla(var(--gray-200))",
          300: "hsla(var(--gray-300))",
          400: "hsla(var(--gray-400))",
          500: "hsla(var(--gray-500))",
          600: "hsla(var(--gray-600))",
          700: "hsla(var(--gray-700))",
          800: "hsla(var(--gray-800))",
          900: "hsla(var(--gray-900))",
          950: "hsla(var(--gray-950))"
        },
        brand: {
          25: "hsla(var(--brand-25))",
          50: "hsla(var(--brand-50))",
          100: "hsla(var(--brand-100))",
          200: "hsla(var(--brand-200))",
          300: "hsla(var(--brand-300))",
          400: "hsla(var(--brand-400))",
          500: "hsla(var(--brand-500))",
          600: "hsla(var(--brand-600))",
          700: "hsla(var(--brand-700))",
          800: "hsla(var(--brand-800))",
          900: "hsla(var(--brand-900))",
          950: "hsla(var(--brand-950))"
        },
        error: {
          25: "hsla(var(--error-25))",
          50: "hsla(var(--error-50))",
          100: "hsla(var(--error-100))",
          200: "hsla(var(--error-200))",
          300: "hsla(var(--error-300))",
          400: "hsla(var(--error-400))",
          500: "hsla(var(--error-500))",
          600: "hsla(var(--error-600))",
          700: "hsla(var(--error-700))",
          800: "hsla(var(--error-800))",
          900: "hsla(var(--error-900))",
          950: "hsla(var(--error-950))"
        },
        warning: {
          25: "hsla(var(--warning-25))",
          50: "hsla(var(--warning-50))",
          100: "hsla(var(--warning-100))",
          200: "hsla(var(--warning-200))",
          300: "hsla(var(--warning-300))",
          400: "hsla(var(--warning-400))",
          500: "hsla(var(--warning-500))",
          600: "hsla(var(--warning-600))",
          700: "hsla(var(--warning-700))",
          800: "hsla(var(--warning-800))",
          900: "hsla(var(--warning-900))",
          950: "hsla(var(--warning-950))"
        },
        success: {
          25: "hsla(var(--success-25))",
          50: "hsla(var(--success-50))",
          100: "hsla(var(--success-100))",
          200: "hsla(var(--success-200))",
          300: "hsla(var(--success-300))",
          400: "hsla(var(--success-400))",
          500: "hsla(var(--success-500))",
          600: "hsla(var(--success-600))",
          700: "hsla(var(--success-700))",
          800: "hsla(var(--success-800))",
          900: "hsla(var(--success-900))",
          950: "hsla(var(--success-950))"
        }
      }
    },
    fontSize: {
      "display-2xl": [
        "4.5rem",
        { lineHeight: "5.625rem", letterSpacing: "-0.02em" }
      ],
      "display-xl": [
        "3.75rem",
        { lineHeight: "4.5rem", letterSpacing: "-0.02em" }
      ],
      "display-lg": [
        "3rem",
        { lineHeight: "3.75rem", letterSpacing: "-0.02em" }
      ],
      "display-md": [
        "2.25rem",
        { lineHeight: "2.75rem", letterSpacing: "-0.02em" }
      ],
      "display-sm": ["1.875rem", { lineHeight: "2.375rem" }],
      "display-xs": ["1.5rem", { lineHeight: "2rem" }],
      "text-xl": ["1.25rem", { lineHeight: "1.875rem" }],
      "text-lg": ["1.125rem", { lineHeight: "1.75rem" }],
      "text-md": ["1rem", { lineHeight: "1.5rem" }],
      "text-sm": ["0.875rem", { lineHeight: "1.25rem" }],
      "text-xs": ["0.75rem", { lineHeight: "1.125rem" }]
    },
    boxShadow: {
      none: "0",
      "3xl": "0px 32px 64px -12px #10182824",
      "2xl": "0px 24px 48px -12px #1018282E",
      xl: "0px 20px 24px -4px #10182814, 0px 8px 8px -4px #10182808",
      lg: "0px 12px 16px -4px #10182814, 0px 4px 6px -2px #10182808",
      md: "0px 4px 8px -2px #1018281A, 0px 2px 4px -2px #1018280F",
      sm: "0px 1px 3px 0px #1018281A, 0px 1px 2px 0px #1018280F",
      xs: "0px 1px 2px 0px #1018280D",
      "focus-ring":
        "0px 0px 0px 2px hsla(var(--background)), 0px 0px 0px 4px hsla(var(--brand-500))",
      "focus-ring-gray":
        "0px 0px 0px 2px hsla(var(--background)), 0px 0px 0px 4px hsla(var(--gray-500))",
      "focus-ring-error":
        "0px 0px 0px 2px hsla(var(--background)), 0px 0px 0px 4px #F04438",
      "focus-ring-shadow-xs":
        "0px 1px 2px 0px #1018280D, 0px 0px 0px 2px hsla(var(--background)), 0px 0px 0px 4px hsla(var(--brand-500))",
      "focus-ring-shadow-sm":
        "0px 1px 3px 0px #1018281A, 0px 1px 2px 0px #1018280F, 0px 0px 0px 2px hsla(var(--background)), 0px 0px 0px 4px hsla(var(--brand-500))",
      "focus-ring-error-shadow-xs":
        "0px 1px 2px 0px #1018280D, 0px 0px 0px 2px hsla(var(--background)), 0px 0px 0px 4px #F04438"
    },
    borderRadius: {
      none: "0",
      xxs: "0.125rem",
      xs: "0.25rem",
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.625rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.25rem",
      "4xl": "1.5rem",
      full: "9999px"
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
