# YSA Global — ysa.global

Production-ready Next.js 14 site. Fully static, ~96KB first load, no external
dependencies beyond React.

## Run locally
    npm install
    npm run dev        # http://localhost:3000

## Deploy (Vercel, free)
1. Create a repo on github.com and push this folder:
       git init && git add -A && git commit -m "YSA Global v1"
       git branch -M main
       git remote add origin https://github.com/YOUR_USERNAME/ysa-global-site.git
       git push -u origin main
2. Go to vercel.com → sign in with GitHub → Add New → Project → import the repo → Deploy.
3. In the Vercel project: Settings → Domains → add `ysa.global` and `www.ysa.global`.

## Point the domain (registered via a Sri Lankan registrar)
Easiest and most reliable with local resellers — switch nameservers:
1. Log in to the registrar where you bought ysa.global.
2. Find "Nameservers" / "DNS Settings" for the domain.
3. Replace the existing nameservers with:
       ns1.vercel-dns.com
       ns2.vercel-dns.com
4. Save. Propagation takes 10 minutes to a few hours. Vercel then manages DNS
   and issues the HTTPS certificate automatically.

If your registrar locks nameservers, use DNS records instead:
   A     @      76.76.21.21
   CNAME www    cname.vercel-dns.com

## Assets
- public/logo.png        — official mark, transparent background (light pages)
- public/logo-light.png  — lavender variant for dark navy surfaces
- app/icon.png           — favicon (auto-served by Next.js)

## Editing
All page content lives in components/YSAGlobal.jsx — copy, services, roster,
case studies, and the ROI calculator assumptions are plain arrays/constants
at the top of each section.
