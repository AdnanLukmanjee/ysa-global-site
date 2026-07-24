export const metadata = {
  title: "YSA Global — Virtual support that scales with you.",
  description:
    "Vetted global talent, embedded in your team. Video editing, social media strategy, lead generation, executive assistance and more — Western standards, zero bloat.",
  metadataBase: new URL("https://ysa.global"),
  openGraph: {
    title: "YSA Global",
    description: "Virtual support that scales with you.",
    url: "https://ysa.global",
    siteName: "YSA Global",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
