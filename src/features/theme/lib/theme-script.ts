export const themeInitializationScript = `
  (() => {
    try {
      const storedTheme = localStorage.getItem("dashboard-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle(
        "dark",
        storedTheme === "dark" || (!storedTheme && prefersDark)
      );

      const customization = JSON.parse(
        localStorage.getItem("lowpos-customization") || "null"
      );
      const isHex = (value) => /^#[0-9A-Fa-f]{6}$/.test(value);
      const fontVariables = {
        OUTFIT: "var(--font-outfit-sans)",
        INTER: "var(--font-inter-sans)",
        ROBOTO: "var(--font-roboto-sans)",
        POPPINS: "var(--font-poppins-sans)",
        MONTSERRAT: "var(--font-montserrat-sans)",
        NUNITO_SANS: "var(--font-nunito-sans)",
        LATO: "var(--font-lato-sans)",
        DM_SANS: "var(--font-dm-sans)",
        RUBIK: "var(--font-rubik-sans)",
        PLUS_JAKARTA_SANS: "var(--font-plus-jakarta-sans)",
        MERRIWEATHER: "var(--font-merriweather-serif)",
        PLAYFAIR_DISPLAY: "var(--font-playfair-serif)",
      };
      const toChannels = (color) => [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
      ];
      const toHex = (value) => Math.round(Math.max(0, Math.min(255, value)))
        .toString(16)
        .padStart(2, "0");
      const darken = (color) => {
        const [red, green, blue] = toChannels(color);
        return ("#" + toHex(red * 0.84) + toHex(green * 0.84) + toHex(blue * 0.84)).toUpperCase();
      };
      const foreground = (color) => {
        const [red, green, blue] = toChannels(color).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.48
          ? "#111827"
          : "#FFFFFF";
      };
      const luminance = (color) => {
        const [red, green, blue] = toChannels(color).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      };
      const contrast = (first, second) => {
        const lighter = Math.max(luminance(first), luminance(second));
        const darker = Math.min(luminance(first), luminance(second));
        return (lighter + 0.05) / (darker + 0.05);
      };
      const mixWithWhite = (color, amount) => {
        const [red, green, blue] = toChannels(color);
        return (
          "#" +
          toHex(red + (255 - red) * amount) +
          toHex(green + (255 - green) * amount) +
          toHex(blue + (255 - blue) * amount)
        ).toUpperCase();
      };
      const darkTextColor = (color) => {
        if (contrast(color, "#111827") >= 4.5) return color;
        for (let amount = 0.1; amount <= 1; amount += 0.1) {
          const candidate = mixWithWhite(color, amount);
          if (contrast(candidate, "#111827") >= 4.5) return candidate;
        }
        return "#FFFFFF";
      };

      if (
        customization &&
        isHex(customization.primaryColor) &&
        isHex(customization.secondaryColor) &&
        isHex(customization.tertiaryColor) &&
        isHex(customization.textColor) &&
        fontVariables[customization.fontFamily]
      ) {
        const root = document.documentElement;
        [
          ["primary", customization.primaryColor],
          ["secondary", customization.secondaryColor],
          ["tertiary", customization.tertiaryColor],
        ].forEach(([name, color]) => {
          root.style.setProperty("--theme-" + name, color);
          root.style.setProperty("--theme-" + name + "-hover", darken(color));
          root.style.setProperty("--theme-" + name + "-foreground", foreground(color));
        });
        root.style.setProperty("--theme-accent", customization.tertiaryColor);
        root.style.setProperty("--theme-accent-foreground", foreground(customization.tertiaryColor));
        root.style.setProperty("--theme-info", customization.secondaryColor);
        root.style.setProperty("--theme-info-foreground", foreground(customization.secondaryColor));
        root.style.setProperty("--theme-custom-foreground", customization.textColor);
        root.style.setProperty("--theme-custom-dark-foreground", darkTextColor(customization.textColor));
        root.style.setProperty("--theme-font-family", fontVariables[customization.fontFamily]);
      }
    } catch {
      document.documentElement.classList.remove("dark");
    }
  })();
`;
