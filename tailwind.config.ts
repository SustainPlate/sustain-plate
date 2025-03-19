
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                sustain: {
                    50: '#f5f8f5',
                    100: '#e6efe6',
                    200: '#cde0ce',
                    300: '#a4c7a6',
                    400: '#75a87a',
                    500: '#518b57',
                    600: '#3d7142',
                    700: '#335c38',
                    800: '#2c4c31',
                    900: '#264029',
                    950: '#122213',
                },
                warmth: {
                    50: '#fdf7ef',
                    100: '#fbecd7',
                    200: '#f6d7ae',
                    300: '#f0bc7c',
                    400: '#e99c4b',
                    500: '#e58529',
                    600: '#d66d22',
                    700: '#b2541e',
                    800: '#8f4420',
                    900: '#733a1e',
                    950: '#3e1c0e',
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-left': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' }
                },
                'slide-right': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' }
                },
                'scale-up': {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                'pulse-gentle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.7s ease-out',
                'fade-up': 'fade-up 0.8s ease-out',
                'slide-left': 'slide-left 0.8s ease-out',
                'slide-right': 'slide-right 0.8s ease-out',
                'scale-up': 'scale-up 0.7s ease-out',
                'pulse-gentle': 'pulse-gentle 3s infinite ease-in-out',
                'float': 'float 5s infinite ease-in-out'
			},
            fontFamily: {
                sans: [
                    '"SF Pro Display"',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Helvetica Neue"',
                    'sans-serif'
                ],
                serif: ['"New York"', 'Georgia', 'serif'],
            },
            boxShadow: {
                'subtle': '0 2px 15px -3px rgba(0, 0, 0, 0.05)',
                'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                'inner-light': 'inset 0 2px 10px 0 rgba(255, 255, 255, 0.15)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.09)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': 'url("/src/assets/images/hero-bg.svg")',
            },
            backdropBlur: {
                'subtle': '5px',
            },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
