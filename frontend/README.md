# Lumina Digital — Premium Agency Experience

Lumina Digital is a high-end, immersive web experience inspired by modern minimalist design (such as *Sohub.digital*) but redefined with a **"Deep Cosmic"** aesthetic and advanced, physics-based motion. This project leverages GSAP, Three.js, and Tailwind CSS to create a site that feels alive, responsive, and extremely premium.

---

## 🌌 The Vision: "Deep Cosmic" Unique Twist

While the inspiration uses a bright, minimalist aesthetic, **Lumina Digital** pivots to a sophisticated dark-mode direction:
- **Palette**: Deep Indigo-Blacks (`#020202`, `#0a0a0f`) with glowing neon accents (Electric Cyan, Pulsing Magenta).
- **Typography**: A high-impact contrast between a massive **Serif** for headers, a modern **Inter** for body text, and a sleek **Mono** font for metadata/labels.
- **Atmosphere**: Subtle grainy overlays and "Liquid Glass" (Glassmorphism) components that float in a 3D space.

---

## 🛠️ Technology Stack

| Category | Library | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Angular** | High-performance routing, SSR, and enterprise-grade architecture. |
| **Styling** | **Tailwind CSS v4** | Utility-first, lightning-fast styling with next-gen performance. |
| **Motion Engine**| **GSAP (GreenSock)** | Industry-standard animation for complex timelines and ScrollTrigger. |
| **Smooth Scroll** | **Lenis** | Butter-smooth, inertial scrolling for a luxury feel (essential). |
| **3D Rendering** | **Three.js** | Powering interactive 3D assets and custom shaders. |
| **UI Components**| **Angular Animations** | Integrated animations for state-based transitions. |

---

## 🎬 Animation Strategy & Styles

### 1. The "Liquid Text" Reveal (GSAP + SVG Filters)
Instead of a simple fade-in, text elements will "flow" into existence.
- **Library**: `gsap` + `SplitText`.
- **Style**: Text letters stagger upwards with a custom SVG warp filter that makes them look like liquid ink coalescing.
- **Usage**: Primary headers across all pages.

### 2. The "Magnetic" Interaction
Interactive elements (buttons, nav links) will exert a gravitational pull on the cursor.
- **Logic**: Custom GSAP routine that calculates cursor distance and transforms the element's position.
- **Style**: Subtle `0.3s` ease-out spring effect.

### 3. "Morphing" Liquid Cursor
The default cursor is replaced with a fluid orb that reacts to the environment.
- **Action**: On link hover, the cursor "swallows" the link text or expands into a ring.
- **Action**: On click, it emits a subtle "shockwave" ripple.

### 4. 3D Parallax Storytelling
Key sections will feature 3D depth that responds to both scroll and mouse movement.
- **Hero**: An abstract, glowing **Lumina Orb** (R3F) that distorts based on scroll velocity.
- **Assets**: Floating 3D "shards" throughout the background that move slower than the scrolling content (Deep Parallax).

---

## 🗺️ Page-by-Page Roadmap

### 🏠 Home: "The Singularity"
- **Start Animation**: A preloader that displays a percentage counter in a massive serif font, followed by a screen-wide shutter reveal.
- **Hero**: Interactive 3D Lumina Orb centered; scrolling reveals kinetic typography that "wraps" around the orb.
- **Work Showcase**: A horizontal scroll gallery where project cards scale up slightly and blur into focus as they enter the viewport.

### 💼 Services: "Technological Vector"
- **Grid Layout**: Features "Frosted Glass" cards with neon borders.
- **Micro-Animations**: Each service icon is an SVG that animates on hover (e.g., a "Code" icon that types itself).
- **GSAP Logic**: Cards staggered revealed using `ScrollTrigger.batch`.

### 🏛️ Studio/About: "The Origin"
- **Visuals**: A deep-dive into "Process" using large-scale typography.
- **Unique Twist**: Text distortion on scroll; sentences "bend" or "warp" as you scroll past them, creating a lens-like effect.

### ✉️ Contact: "The Gateway"
- **Greeting**: Dynamic greeting based on user's local time (e.g., "Good Evening from London").
- **Interface**: A 3D floating terminal where the form fields appear as holographic inputs.
- **Success State**: A cosmic "implosion" animation upon message submission.

---

## 🚀 Implementation Steps

1. **Foundations**: Configure Next.js, Tailwind themes (colors/fonts), and Lenis smooth scroll.
2. **Global Motion**: Implement the "Magnetic Cursor" and GSAP global entry timelines.
3. **Core Layouts**: Build the "Liquid Glass" UI components.
4. **3D Integration**: Add React Three Fiber hero assets and background shaders.
5. **Page Refinement**: Specific GSAP ScrollTriggers for every page.
6. **Polish**: Add grain textures, sound effects (optional), and performance optimizations.
