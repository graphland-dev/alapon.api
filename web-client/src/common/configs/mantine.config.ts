import { createTheme } from '@mantine/core';

export const mantineThemeConfig = createTheme({
  colors: {
    background: [
      'color-mix(in srgb, hsl(var(--background)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--background)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--background)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--background)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--background)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--background)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--background)), #fff 10%)', // 6
      'hsl(var(--background))', // 7 Base color
      'color-mix(in srgb, hsl(var(--background)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--background)), #000 35%)', // 9
    ],
    foreground: [
      'color-mix(in srgb, hsl(var(--foreground)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--foreground)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--foreground)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--foreground)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--foreground)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--foreground)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--foreground)), #fff 10%)', // 6
      'hsl(var(--foreground))', // 7 Base color
      'color-mix(in srgb, hsl(var(--foreground)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--foreground)), #000 35%)', // 9
    ],
    primary: [
      'color-mix(in srgb, hsl(var(--primary)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--primary)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--primary)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--primary)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--primary)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--primary)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--primary)), #fff 10%)', // 6
      'hsl(var(--primary))', // 7 Base color
      'color-mix(in srgb, hsl(var(--primary)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--primary)), #000 35%)', // 9
    ],
    'primary-foreground': [
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--primary-foreground)), #fff 10%)', // 6
      'hsl(var(--primary-foreground))', // 7 Base color
      'color-mix(in srgb, hsl(var(--primary-foreground)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--primary-foreground)), #000 35%)', // 9
    ],
    secondary: [
      'color-mix(in srgb, hsl(var(--secondary)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--secondary)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--secondary)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--secondary)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--secondary)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--secondary)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--secondary)), #fff 10%)', // 6
      'hsl(var(--secondary))', // 7 Base color
      'color-mix(in srgb, hsl(var(--secondary)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--secondary)), #000 35%)', // 9
    ],
    'secondary-foreground': [
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #fff 10%)', // 6
      'hsl(var(--secondary-foreground))', // 7 Base color
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--secondary-foreground)), #000 35%)', // 9
    ],
    muted: [
      'color-mix(in srgb, hsl(var(--muted)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--muted)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--muted)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--muted)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--muted)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--muted)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--muted)), #fff 10%)', // 6
      'hsl(var(--muted))', // 7 Base color
      'color-mix(in srgb, hsl(var(--muted)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--muted)), #000 35%)', // 9
    ],
    accent: [
      'color-mix(in srgb, hsl(var(--accent)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--accent)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--accent)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--accent)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--accent)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--accent)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--accent)), #fff 10%)', // 6
      'hsl(var(--accent))', // 7 Base color
      'color-mix(in srgb, hsl(var(--accent)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--accent)), #000 35%)', // 9
    ],
    destructive: [
      'color-mix(in srgb, hsl(var(--destructive)), #fff 70%)', // 0
      'color-mix(in srgb, hsl(var(--destructive)), #fff 60%)', // 1
      'color-mix(in srgb, hsl(var(--destructive)), #fff 50%)', // 2
      'color-mix(in srgb, hsl(var(--destructive)), #fff 40%)', // 3
      'color-mix(in srgb, hsl(var(--destructive)), #fff 30%)', // 4
      'color-mix(in srgb, hsl(var(--destructive)), #fff 20%)', // 5
      'color-mix(in srgb, hsl(var(--destructive)), #fff 10%)', // 6
      'hsl(var(--destructive))', // 7 Base color
      'color-mix(in srgb, hsl(var(--destructive)), #000 15%)', // 8
      'color-mix(in srgb, hsl(var(--destructive)), #000 35%)', // 9
    ],
  },
  primaryColor: 'primary',
  // components: {
  //   Button: Button.extend({
  //     defaultProps: { size: "md", color: "red" },
  //   }),
  //   Input: Input.extend({
  //     defaultProps: { size: "md" },
  //   }),
  //   MultiSelect: MultiSelect.extend({
  //     defaultProps: { size: "md" },
  //   }),
  //   Select: Select.extend({
  //     defaultProps: { size: "md" },
  //   }),
  //   PasswordInput: PasswordInput.extend({
  //     classNames: {
  //       wrapper: "input-bottom-spacing",
  //     },
  //   }),
  // },
});
