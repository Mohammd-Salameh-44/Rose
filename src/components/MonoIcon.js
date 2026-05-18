export default function MonoIcon({ name, size = 22, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `mono-icon ${className}`.trim(),
    "aria-hidden": "true"
  };

  const icons = {
    cart: (
      <svg {...common}>
        <circle cx="9" cy="20" r="1.7" />
        <circle cx="18" cy="20" r="1.7" />
        <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 8H7" />
      </svg>
    ),
    moon: (
      <svg {...common}>
        <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z" />
      </svg>
    ),
    sun: (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    language: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
    menu: (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
    whatsapp: (
      <svg {...common}>
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" />
        <path d="M9.3 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.8 1.3 1.8 2.2 3.2 2.8l.6-.7c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.6v.5c0 .4-.2.7-.6.9-.8.4-2.4.3-4.4-.8-2.7-1.5-4.4-4.1-4.5-5.4 0-.5.3-.9.6-1.1Z" />
      </svg>
    ),
    facebook: (
      <svg {...common}>
        <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.3l.7-3h-3v-1.5c0-.8.3-1.5 1.4-1.5H17V6.2A11 11 0 0 0 15 6Z" />
      </svg>
    ),
    instagram: (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M17.3 6.7h.01" />
      </svg>
    ),
    tiktok: (
      <svg {...common}>
        <path d="M14 4v10.2a3.8 3.8 0 1 1-3.8-3.8" />
        <path d="M14 4c.7 2.8 2.4 4.4 5 4.8" />
      </svg>
    ),
    phone: (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.7a2 2 0 0 1-.5 1.8L7.8 9.5a16 16 0 0 0 6.7 6.7l1.3-1.3a2 2 0 0 1 1.8-.5l2.7.5a2 2 0 0 1 1.7 2Z" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
    android: (
      <svg {...common}>
        <path d="M7 10h10v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3Z" />
        <path d="M8 10 6.5 7M16 10l1.5-3M9 14h.01M15 14h.01M7 17H5M19 17h-2" />
      </svg>
    ),
    apple: (
      <svg {...common}>
        <path d="M16.5 13.3c0-2 1.5-3 1.6-3.1-1-.1-2-.6-2.6-1.3-1.1-1.2-2.7-.7-3.3-.4-.6.3-1.5.4-2.4 0-1.2-.5-2.5.1-3.2 1.2-1.4 2.2-.4 6.8 1 8.8.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7s1.8-1 2.5-2c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.2-.8-2.7-3Z" />
        <path d="M14.8 4c-.7.8-1.9 1.4-2.9 1.3-.1-1 .4-2.1 1.1-2.8.7-.8 1.9-1.4 2.8-1.5.1 1.1-.3 2.2-1 3Z" />
      </svg>
    )
  };

  return icons[name] || null;
}
