import type { Metadata } from "next";
// Root layout for the app. It emits the captured Nordstrom stylesheets verbatim
// (see NORDSTROM_CSS) instead of routing them through the CSS bundler, which
// reflows minified source and breaks syntax the original page depends on.
// Tailwind is intentionally not imported here for the same reason.
import { NORDSTROM_CSS } from "@/lib/nordstrom/css";

export const metadata: Metadata = {
  title:
    "Nordstrom Online & in Store: Shoes, Jewelry, Clothing, Makeup, Dresses",
  description:
    "Shop Nordstrom for shoes, jewelry, clothing, makeup, dresses and more.",
  robots: "noindex, nofollow, noarchive, nosnippet, noimageindex",
};

// Copy/save deterrence: no text selection, no image dragging, printing is a
// no-op. Paired with the inline key/context-menu guards below and the
// X-Robots-Tag / X-Frame-Options headers in next.config.ts.
const PROTECTION_CSS = `
html{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none!important}
input,textarea{user-select:text!important;-webkit-user-select:text!important}
img,svg{-webkit-user-drag:none;user-drag:none}
@media print{body{display:none!important}}
`;

const PROTECTION_SCRIPT = `
(function(){
document.addEventListener("contextmenu",function(e){e.preventDefault()});
document.addEventListener("dragstart",function(e){e.preventDefault()});
document.addEventListener("copy",function(e){e.preventDefault()});
document.addEventListener("keydown",function(e){
var k=(e.key||"").toLowerCase(),mod=e.ctrlKey||e.metaKey;
if(mod&&(k==="s"||k==="p"||k==="u")){e.preventDefault();return false}
if(e.key==="F12"||(e.ctrlKey&&e.shiftKey&&(k==="i"||k==="j"||k==="c"))){e.preventDefault();return false}
});
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style
          // Emitted verbatim: the exact stylesheets captured with the page,
          // including the Brandon Text @font-face rules.
          dangerouslySetInnerHTML={{ __html: NORDSTROM_CSS }}
        />
        <style dangerouslySetInnerHTML={{ __html: PROTECTION_CSS }} />
      </head>
      <body data-qm-breadcrumb-listener-attached="true">
        <script dangerouslySetInnerHTML={{ __html: PROTECTION_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
