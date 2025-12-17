# Ahmed Irfan - Full Stack Developer Portfolio

## Project Overview

A professional, unique, and visually stunning portfolio website for a Full Stack Developer. The design philosophy is **"Less reading, more visual understanding"** - users should understand everything through visual cues without needing to read extensively.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Framework (App Router, Server Components) |
| **React 19.2.1** | UI Library (PATCHED for CVE-2025-55182) |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | Component library |
| **Three.js + React Three Fiber + Drei** | 3D graphics |
| **GSAP** | Advanced animations |
| **Framer Motion** | React animations |
| **next-themes** | Dark/light mode |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Backend APIs |
| **MongoDB + Mongoose** | Database |
| **NextAuth.js** | Authentication (Google OAuth) |
| **Cloudinary** | Video/image storage |
| **Google Gemini AI** | Chatbot |

### Security Note
- **CVE-2025-55182 / CVE-2025-66478**: Critical RCE vulnerability in React Server Components
- **Status**: PATCHED - Using React 19.2.1 which includes the fix
- **Action**: No further action needed, project is secure

---

## Design Theme

### Style: Professional + Glassmorphism + Tech Vibes + Unique Layouts

**Color Palette (Dark Theme Primary):**
```
Background: Deep dark (#0a0a0f, #111118)
Glass: rgba(255,255,255,0.05) with blur
Primary Accent: Cyan/Teal (#00ffff, #06b6d4)
Secondary Accent: Purple (#8b5cf6)
Text: White/Gray variations
Gradients: Cyan to Purple gradients
```

**Visual Elements:**
- Glassmorphism cards with backdrop blur
- Subtle grid/dot patterns in background
- Gradient borders on hover
- Smooth scroll animations
- 3D elements using Three.js
- Particle effects in hero section

---

## Features & Sections

### 1. Hero Section
- **3D Background**: Animated Three.js scene (particles, geometric shapes, or abstract art)
- **Name & Title**: Large typography with gradient text
- **Tagline**: Short impactful description
- **CTA Buttons**: "View Projects" + "Contact Me"
- **Scroll indicator**: Animated arrow

### 2. About Section
- **Profile Image**: With glassmorphism frame
- **Bio**: Brief professional summary
- **Quick Stats**: Years of experience, projects completed, etc.
- **Tech stack icons**: Animated on scroll

### 3. Skills Section
- **Skill Categories**: Frontend, Backend, DevOps, Tools
- **Visual Representation**:
  - Animated progress bars OR
  - 3D skill cubes/spheres OR
  - Hexagonal grid
- **Hover Effects**: Show proficiency level and years used

### 4. Projects Section
- **Filter Tabs**: All, Web, Mobile, Full Stack
- **Project Cards**: Glassmorphism cards with:
  - Thumbnail/preview image
  - Title
  - Tech stack badges
  - Brief description

- **Project Preview Modal** (Hybrid Approach):
  - **For YOUR projects**: Open in iframe (browser-in-browser)
  - **For external/blocked sites**: Device mockup with screenshots
  - **For mobile apps**: Phone mockup display
  - **Fallback**: "Visit Live" button if iframe fails

### 5. Client Reviews Section
- **Review Cards**:
  - Client avatar
  - Name & company
  - Rating (stars)
  - Text review
  - Video review (optional) - Cloudinary player

- **Review Submission Flow**:
  1. User clicks "Leave a Review"
  2. Must login with Google OAuth
  3. Identity verified
  4. Submit review (text + optional video)
  5. Shows "Your review is under review" message
  6. Admin approves/rejects from dashboard
  7. Approved reviews appear on site

### 6. GitHub Stats Section
- **Contribution Graph**: GitHub-style heatmap
- **Stats Cards**:
  - Total contributions
  - Public repos
  - Stars received
  - Followers
- **Top Languages**: Visual chart
- **Featured Repositories**: Cards with links

### 7. Blog Section
- **Blog List**: Cards with:
  - Featured image
  - Title
  - Excerpt
  - Date & reading time
  - Category/tags
- **Blog Post Page**:
  - Full content (MDX or rich text)
  - Table of contents
  - Share buttons
  - Related posts

### 8. Contact Section
- **Contact Form**:
  - Name
  - Email
  - Subject (dropdown)
  - Message
  - Submit button
- **Contact Info**:
  - Email (clickable)
  - Location
  - Social links
- **Resume Download**: Button to download PDF

### 9. AI Chatbot
- **Floating Button**: Bottom-right corner
- **Chat Modal**:
  - Chat history
  - Input field
  - Send button
- **Capabilities**:
  - Answer questions about your skills
  - Provide project information
  - Help visitors navigate portfolio
  - Trained on your portfolio content

---

## Admin Dashboard

### Authentication
- Admin-only access
- NextAuth.js with specific admin email(s)

### Dashboard Pages

#### 1. Overview Dashboard
- Total views
- Contact submissions count
- Pending reviews count
- Recent activity

#### 2. Projects Management
- CRUD operations
- Upload images
- Set featured projects
- Manage tech stack tags

#### 3. Blog Management
- CRUD operations
- Rich text editor
- Image upload
- Categories/tags management
- Draft/Published status

#### 4. Reviews Moderation
- List all pending reviews
- Preview video/text
- Approve or reject
- View approved reviews

#### 5. About/Skills Editor
- Edit about section content
- Manage skills (add/edit/delete)
- Update profile image

#### 6. Contact Messages
- View all form submissions
- Mark as read/unread
- Reply via email

#### 7. Settings
- Site title/description
- Social links
- Resume upload
- Chatbot settings

---

## Database Schema (MongoDB)

### Collections

```javascript
// users - Admin users
{
  _id: ObjectId,
  name: String,
  email: String,
  role: "admin" | "user",
  image: String,
  createdAt: Date
}

// projects
{
  _id: ObjectId,
  title: String,
  slug: String,
  description: String,
  longDescription: String,
  thumbnail: String,
  images: [String],
  techStack: [String],
  category: "web" | "mobile" | "fullstack",
  liveUrl: String,
  githubUrl: String,
  iframeAllowed: Boolean,
  featured: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}

// blogs
{
  _id: ObjectId,
  title: String,
  slug: String,
  excerpt: String,
  content: String, // MDX or HTML
  featuredImage: String,
  category: String,
  tags: [String],
  status: "draft" | "published",
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}

// reviews
{
  _id: ObjectId,
  userId: ObjectId,
  userName: String,
  userEmail: String,
  userImage: String,
  company: String,
  rating: Number, // 1-5
  text: String,
  videoUrl: String, // Cloudinary URL
  status: "pending" | "approved" | "rejected",
  createdAt: Date,
  updatedAt: Date
}

// skills
{
  _id: ObjectId,
  name: String,
  category: "frontend" | "backend" | "devops" | "tools",
  icon: String,
  proficiency: Number, // 1-100
  yearsUsed: Number,
  order: Number
}

// about
{
  _id: ObjectId,
  bio: String,
  shortBio: String,
  profileImage: String,
  yearsExperience: Number,
  projectsCompleted: Number,
  clientsServed: Number,
  resumeUrl: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String
  }
}

// messages
{
  _id: ObjectId,
  name: String,
  email: String,
  subject: String,
  message: String,
  isRead: Boolean,
  createdAt: Date
}

// settings
{
  _id: ObjectId,
  siteName: String,
  siteDescription: String,
  chatbotEnabled: Boolean,
  chatbotContext: String, // Info for AI to use
  updatedAt: Date
}
```

---

## Folder Structure

```
portfolio-app/
├── src/
│   ├── app/
│   │   ├── (public)/                 # Public portfolio pages
│   │   │   ├── page.tsx              # Home (all sections)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # All projects
│   │   │   │   └── [slug]/page.tsx   # Single project
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # All blogs
│   │   │   │   └── [slug]/page.tsx   # Single blog
│   │   │   └── contact/page.tsx      # Contact page
│   │   │
│   │   ├── (admin)/                  # Admin dashboard
│   │   │   ├── layout.tsx            # Admin layout
│   │   │   ├── dashboard/page.tsx    # Overview
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # List
│   │   │   │   ├── new/page.tsx      # Create
│   │   │   │   └── [id]/page.tsx     # Edit
│   │   │   ├── blogs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── reviews/page.tsx      # Moderation
│   │   │   ├── messages/page.tsx     # Contact submissions
│   │   │   ├── about/page.tsx        # Edit about
│   │   │   ├── skills/page.tsx       # Manage skills
│   │   │   └── settings/page.tsx     # Site settings
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── projects/route.ts
│   │   │   ├── projects/[id]/route.ts
│   │   │   ├── blogs/route.ts
│   │   │   ├── blogs/[id]/route.ts
│   │   │   ├── reviews/route.ts
│   │   │   ├── reviews/[id]/route.ts
│   │   │   ├── skills/route.ts
│   │   │   ├── about/route.ts
│   │   │   ├── messages/route.ts
│   │   │   ├── chat/route.ts         # Gemini chatbot
│   │   │   ├── upload/route.ts       # Cloudinary
│   │   │   └── github/route.ts       # GitHub stats
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   ├── three/                    # Three.js scenes
│   │   │   ├── HeroScene.tsx
│   │   │   ├── ParticleBackground.tsx
│   │   │   └── SkillsSphere.tsx
│   │   ├── sections/                 # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── GitHub.tsx
│   │   │   └── Contact.tsx
│   │   ├── admin/                    # Admin components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── forms/
│   │   ├── shared/                   # Shared components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Chatbot.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   ├── DeviceMockup.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── animations/               # Animation wrappers
│   │       ├── FadeIn.tsx
│   │       ├── SlideIn.tsx
│   │       └── ScrollReveal.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                     # MongoDB connection
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── cloudinary.ts             # Cloudinary config
│   │   ├── gemini.ts                 # Gemini AI config
│   │   └── utils.ts                  # Utility functions
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   ├── Blog.ts
│   │   ├── Review.ts
│   │   ├── Skill.ts
│   │   ├── About.ts
│   │   ├── Message.ts
│   │   └── Settings.ts
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── useScrollAnimation.ts
│   │   ├── useInView.ts
│   │   └── useGitHubStats.ts
│   │
│   └── types/                        # TypeScript types
│       └── index.ts
│
├── public/
│   ├── images/
│   ├── resume/
│   └── fonts/
│
├── .env.local                        # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables Needed

```env
# Database
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key

# GitHub (for stats)
GITHUB_TOKEN=your-github-token
GITHUB_USERNAME=your-github-username
```

---

## Implementation Phases

### Phase 1: Foundation (CURRENT)
- [x] Project setup with Next.js 16
- [x] React 19.2.1 (patched for CVE-2025-55182)
- [x] Tailwind CSS v4 configured
- [x] shadcn/ui initialized with components
- [x] Three.js + animations packages installed
- [ ] MongoDB connection setup
- [ ] Base folder structure
- [ ] Glassmorphism design system (CSS)
- [ ] Base layout (Navbar, Footer)
- [ ] Theme provider (dark/light)

### Phase 2: Public Sections
- [ ] Hero section with Three.js background
- [ ] About section with animations
- [ ] Skills section (visual display)
- [ ] Projects section with hybrid preview
- [ ] Contact form
- [ ] Resume download

### Phase 3: Reviews System
- [ ] NextAuth.js setup
- [ ] Google OAuth configuration
- [ ] Review submission form
- [ ] Video upload to Cloudinary
- [ ] Review display carousel

### Phase 4: Blog System
- [ ] Blog schema and API
- [ ] Blog listing page
- [ ] Blog post page
- [ ] Categories/tags

### Phase 5: Admin Dashboard
- [ ] Admin authentication
- [ ] Dashboard layout
- [ ] Projects CRUD
- [ ] Blogs CRUD
- [ ] Reviews moderation
- [ ] Skills/About editor
- [ ] Settings page

### Phase 6: AI Chatbot
- [ ] Gemini API integration
- [ ] Chat UI component
- [ ] Context training

### Phase 7: GitHub & Polish
- [ ] GitHub stats integration
- [ ] Final animations
- [ ] Performance optimization
- [ ] SEO & meta tags
- [ ] Deployment

---

## Notes for Future Sessions

1. **Project Location**: `/Users/ahmedirfan/Desktop/portfolio/portfolio-app`

2. **Already Installed Packages**:
   - next, react, react-dom (v19.2.1 - PATCHED)
   - tailwindcss, @tailwindcss/postcss
   - three, @react-three/fiber, @react-three/drei
   - gsap, framer-motion
   - mongoose, next-auth
   - @google/generative-ai
   - next-cloudinary, next-themes
   - lucide-react, react-icons
   - shadcn/ui components (button, card, dialog, input, textarea, badge, avatar, dropdown-menu, sheet, tabs, separator, skeleton, sonner)

3. **Design Direction**:
   - Dark theme primary
   - Glassmorphism effects
   - Professional + tech vibes
   - Unique layouts
   - Visual-first approach

4. **Key Decisions Made**:
   - Database: MongoDB
   - Auth: NextAuth.js with Google OAuth
   - AI: Google Gemini
   - Storage: Cloudinary
   - Project Preview: Hybrid (iframe + mockups)
   - Three.js Level: Intermediate

---

## Commands Reference

```bash
# Start development server
cd /Users/ahmedirfan/Desktop/portfolio/portfolio-app
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Add more shadcn components
npx shadcn@latest add [component-name]
```

---

*Last Updated: December 13, 2025*
*Project Status: Phase 1 - Foundation (In Progress)*
