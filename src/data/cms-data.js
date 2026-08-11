export const cmsNavigation = [
  {
    group: "Dashboard",
    items: [
      { id: "/", label: "Overview", icon: "LayoutDashboard" },
    ],
  },
  {
    group: "Website Sections",
    items: [
      { id: "/categories", label: "Categories", icon: "Menu" },
      { id: "/authors", label: "Authors", icon: "PenLine"},
      { id: "/news", label: "News", icon: "Newspaper" },
   //   { id: "/who-We", label: "Who We Are", icon: "Building2" },
   //   { id: "/our-works", label: "Our-Works", icon: "FolderKanban" },
   //   { id: "/capability", label: "Our Capability", icon: "Cpu" },
    //  { id: "/our-stories", label: "Our Stories", icon: "BookOpen" },
    //  { id: "/team", label: "Our Team", icon: "Users" },
    //  { id: "/media", label: "Media", icon: "Clapperboard" },
    //  { id: "/about-hero", label: "About Hero", icon: "Sparkles" },
      {/* 
        {
        id: "/start-project",
        label: "Start Project",
        icon: "Rocket",
        children: [
          { id: "/start-project/stats", label: "Stats", icon: "ArrowRight" },
          { id: "/start-project/reasons", label: "Reasons", icon: "ListOrdered" },
          { id: "/start-project/processes", label: "Processes", icon: "FileText" },
          { id: "/start-project/technologies", label: "Technologies", icon: "Currency" },
          { id: "/start-project/testimonials", label: "Testimonials" },
          { id: "/start-project/faqs", label: "Faqs" }
        ],
      },
       { id: "contact-req", label: "Contact Requests", icon: "Inbox"}     
      */}
    
    ],
  },
];

export const heroData = [
  {
    id: 1,
    title: 'Welcome to Our Platform',
    subtitle: 'Build amazing things with cutting-edge technology',
    image: '/images/CR7.jpg',
    status: 'published',
    createdAt: '2024-06-10'
  }
];

export const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    slug: 'getting-started-react',
    author: 'Sarah Chen',
    category: 'Technology',
    status: 'published',
    views: 2451,
    createdAt: '2024-06-15',
    image: '/blog-1.jpg'
  },
  {
    id: 2,
    title: 'Advanced Tailwind CSS Techniques',
    slug: 'advanced-tailwind',
    author: 'Mike Johnson',
    category: 'Design',
    status: 'published',
    views: 1820,
    createdAt: '2024-06-14',
    image: '/blog-2.jpg'
  },
  {
    id: 3,
    title: 'Building Scalable Applications',
    slug: 'scalable-apps',
    author: 'Emma Davis',
    category: 'Architecture',
    status: 'draft',
    views: 0,
    createdAt: '2024-06-13',
    image: '/blog-3.jpg'
  }
];

export const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Lead Designer',
    bio: 'Creative design strategist with 8 years of experience',
    email: 'sarah@company.com',
    image: '/images/image-1.jpg',
    status: 'active'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    role: 'Senior Developer',
    bio: 'Full-stack engineer passionate about scalable systems',
    email: 'mike@company.com',
    image: '/images/image-2.jpg',
    status: 'active'
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Product Manager',
    bio: 'Focused on user-centric product development',
    email: 'emma@company.com',
    image: '/images/image-3.jpg',
    status: 'active'
  }
];

export const testimonials = [
  {
    id: 1,
    author: 'John Smith',
    company: 'Tech Startup Inc',
    content: 'This platform transformed how we manage our content.',
    rating: 5,
    image: '/avatar-4.jpg',
    status: 'published'
  },
  {
    id: 2,
    author: 'Lisa Anderson',
    company: 'Creative Agency Co',
    content: 'The best CMS solution weve ever used. Highly recommended!',
    rating: 5,
    image: '/avatar-5.jpg',
    status: 'published'
  },
  {
    id: 3,
    author: 'Robert Wilson',
    company: 'Enterprise Solutions LLC',
    content: 'Excellent support team and intuitive interface.',
    rating: 4,
    image: '/avatar-6.jpg',
    status: 'pending'
  }
];

export const galleryItems = [
  {
    id: 1,
    title: 'Conference 2024',
    image: '/gallery-1.jpg',
    category: 'Events',
    uploadedAt: '2024-06-10'
  },
  {
    id: 2,
    title: 'Team Retreat',
    image: '/gallery-2.jpg',
    category: 'Culture',
    uploadedAt: '2024-06-05'
  },
  {
    id: 3,
    title: 'Product Launch',
    image: '/gallery-3.jpg',
    category: 'Product',
    uploadedAt: '2024-06-01'
  },
  {
    id: 4,
    title: 'Office Space',
    image: '/gallery-4.jpg',
    category: 'Office',
    uploadedAt: '2024-05-28'
  }
];

export const mediaLibrary = [
  {
    id: 1,
    name: 'company-logo.png',
    type: 'image',
    size: '245 KB',
    uploadedAt: '2024-06-01'
  },
  {
    id: 2,
    name: 'product-demo.mp4',
    type: 'video',
    size: '12.5 MB',
    uploadedAt: '2024-05-25'
  },
  {
    id: 3,
    name: 'brand-guidelines.pdf',
    type: 'document',
    size: '2.3 MB',
    uploadedAt: '2024-05-20'
  }
];

export const announcements = [
  {
    id: 1,
    title: 'New Features Released',
    content: 'We are excited to announce our latest feature set including real-time collaboration.',
    status: 'published',
    priority: 'high',
    createdAt: '2024-06-15'
  },
  {
    id: 2,
    title: 'Scheduled Maintenance',
    content: 'System maintenance will occur on June 20th from 2-4 PM EST.',
    status: 'published',
    priority: 'medium',
    createdAt: '2024-06-14'
  },
  {
    id: 3,
    title: 'Summer Vacation Notice',
    content: 'Office will be closed during the summer break.',
    status: 'draft',
    priority: 'low',
    createdAt: '2024-06-13'
  }
];

export const subscribers = [
  {
    id: 1,
    email: 'john@example.com',
    name: 'John Doe',
    subscribed: true,
    subscribedAt: '2024-05-10'
  },
  {
    id: 2,
    email: 'jane@example.com',
    name: 'Jane Smith',
    subscribed: true,
    subscribedAt: '2024-05-15'
  },
  {
    id: 3,
    email: 'mike@example.com',
    name: 'Mike Johnson',
    subscribed: true,
    subscribedAt: '2024-06-01'
  },
  {
    id: 4,
    email: 'sarah@example.com',
    name: 'Sarah Wilson',
    subscribed: false,
    subscribedAt: '2024-05-20'
  }
];

export const messages = [
  {
    id: 1,
    senderName: 'Alice Thompson',
    senderEmail: 'alice@example.com',
    subject: 'Feature Request: Dark Mode',
    message: 'Would love to see a dark mode option in the dashboard.',
    status: 'unread',
    receivedAt: '2024-06-15'
  },
  {
    id: 2,
    senderName: 'Bob Martinez',
    senderEmail: 'bob@example.com',
    subject: 'Bug Report: Login Issue',
    message: 'I cannot login with my credentials on mobile devices.',
    status: 'unread',
    receivedAt: '2024-06-14'
  },
  {
    id: 3,
    senderName: 'Carol White',
    senderEmail: 'carol@example.com',
    subject: 'Partnership Inquiry',
    message: 'Interested in discussing partnership opportunities.',
    status: 'read',
    receivedAt: '2024-06-13'
  }
];

export const serviceCategories = [
  {
    id: 1,
    category: 'Development',
    icon: 'Code',
    subcategories: [
      {
        id: 1,
        name: 'Web Development',
        description: 'Custom web applications built with React, Next.js, and modern frameworks',
        status: 'active',
        createdAt: '2024-06-10'
      },
      {
        id: 2,
        name: 'Mobile Development',
        description: 'Native and cross-platform mobile applications',
        status: 'active',
        createdAt: '2024-06-08'
      },
      {
        id: 3,
        name: 'Backend Development',
        description: 'Scalable server-side solutions and API development',
        status: 'active',
        createdAt: '2024-06-05'
      }
    ]
  },
  {
    id: 2,
    category: 'Design',
    icon: 'Palette',
    subcategories: [
      {
        id: 4,
        name: 'UI Design',
        description: 'User interface design with modern design principles',
        status: 'active',
        createdAt: '2024-06-12'
      },
      {
        id: 5,
        name: 'UX Design',
        description: 'User experience research and optimization',
        status: 'active',
        createdAt: '2024-06-11'
      },
      {
        id: 6,
        name: 'Brand Design',
        description: 'Complete branding and visual identity solutions',
        status: 'draft',
        createdAt: '2024-06-09'
      }
    ]
  },
  {
    id: 3,
    category: 'Consulting',
    icon: 'Lightbulb',
    subcategories: [
      {
        id: 7,
        name: 'Tech Strategy',
        description: 'Strategic technology planning and roadmap development',
        status: 'active',
        createdAt: '2024-06-07'
      },
      {
        id: 8,
        name: 'Digital Transformation',
        description: 'Business process optimization through digital tools',
        status: 'active',
        createdAt: '2024-06-06'
      }
    ]
  }
];

export const whyChooseData = [
  {
    id: 1,
    title: 'Loved by students',
    icon: 'Heart',
    description: 'IDP is rated 4.8 out of 5 on Google, and 9 out of 10 students would recommend us to their friends and families.',
    linkText: 'Discover the IDP difference',
    status: 'published',
    createdAt: '2024-06-15'
  },
  {
    id: 2,
    title: 'Counselling right by your side',
    icon: 'Users',
    description: 'We have 2200+ expert education counsellors, many of whom are also comfortable speaking regional languages.',
    linkText: 'Learn More',
    status: 'published',
    createdAt: '2024-06-14'
  },
  {
    id: 3,
    title: 'Trusted by 113K students',
    icon: 'Award',
    description: 'In 2024, IDP helped 1,13,000 students achieve their study abroad dreams! We\'re here to help you do the same.',
    linkText: 'Learn More',
    status: 'published',
    createdAt: '2024-06-13'
  },
  {
    id: 4,
    title: 'Proud IELTS co-owner',
    icon: 'Check',
    description: 'IDP co-owns IELTS test. We have 2,000+ test locations across 60+ nations and 260+ computer-delivered IELTS centres.',
    linkText: 'Book now',
    status: 'published',
    createdAt: '2024-06-12'
  },
  {
    id: 5,
    title: 'Support through every step',
    icon: 'Shield',
    description: 'We support you at every step, from university & visa applications to pre-departure briefings and post-arrival help.',
    linkText: 'Learn More',
    status: 'published',
    createdAt: '2024-06-11'
  },
  {
    id: 6,
    title: 'Global reach, local touch',
    icon: 'Globe',
    description: 'IDP has 210+ offices across 35+ nations. You can often find us closer to your home.',
    linkText: 'Find the nearest',
    status: 'draft',
    createdAt: '2024-06-10'
  }
];

export const services = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Custom web applications built with modern technologies',
    icon: 'Code',
    status: 'active'
  },
  {
    id: 2,
    name: 'UI/UX Design',
    description: 'Beautiful and functional user interface design',
    icon: 'Palette',
    status: 'active'
  },
  {
    id: 3,
    name: 'Consulting',
    description: 'Strategic technology consulting for enterprises',
    icon: 'Lightbulb',
    status: 'active'
  }
];

export const cmsMetrics = {
  totalPosts: 127,
  publishedPosts: 98,
  draftPosts: 29,
  totalSubscribers: 3421,
  unreadMessages: 5,
  activeTeamMembers: 12,
  totalViews: 45231
};
