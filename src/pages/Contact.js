import Navbar from "../components/Navbar";
import { useLang } from "../LanguageContext";
export default function Contact() {
  const { t } = useLang();

  return (
    <div className="container">
      <Navbar />

      <h2 className="page-title">{t.contact}</h2>

      <div className="contact-box glass">
        <h3 className="contact-title">{t.weltitle}</h3>
        <p className="contact-desc">{t.weldiscr}</p>

        <div className="contact-grid">
          <a href="https://wa.me/972527991448" target="_blank" rel="noreferrer" className="contact-item">
            <span>📱</span>
            WhatsApp
          </a>

          <a href="https://www.facebook.com/share/1D75tqmQY4/" target="_blank" rel="noreferrer" className="contact-item">
            <span>📘</span>
            Facebook
          </a>

          <a href="https://www.instagram.com/rose.coffeeflower?igsh=cjhrdHF3MGZ3bWYy" target="_blank" rel="noreferrer" className="contact-item">
            <span>📸</span>
            Instagram
          </a>

          <a href="https://www.tiktok.com/@rosecoffee.flower?_r=1&_t=ZS-961cwLdSFl7" target="_blank" rel="noreferrer" className="contact-item">
            <span>🎵</span>
            TikTok
          </a>

          <a href="tel:0527991448" className="contact-item">
            <span>☎️</span>
            Call Us
          </a>

          <a href="mailto:rosecoffeeflower@gmail.com" className="contact-item">
            <span>✉️</span>
            Email
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=xyz.kotsh.waslny&pcampaignid=web_share" className="contact-item">
            <span>📲</span>
            Android Waslni App
          </a>

          <a
            href="https://apps.apple.com/il/app/وصلني-القدس/id6753804097" className="contact-item">
            <span>🍎</span>
            IOS Waslni App
          </a>
        </div>
      </div>

      <div className="map-card glass">
        <h3 className="contact-title">{t.location || "Location"}</h3>

        <iframe
          title="ROSA Location"
          src="https://maps.google.com/maps?q=31.729194,35.243556&z=17&output=embed"
          width="100%"
          height="320"
          style={{
            border: 0,
            borderRadius: "24px"
          }}
          allowFullScreen=""
          loading="lazy"
        />

        <a
          className="map-link"
          href="https://maps.app.goo.gl/H977ZCWZxLZYTeZ57"
          target="_blank"
          rel="noreferrer"
        >
          Open in Google Maps
        </a>
      </div>

      <div className="footer glass">
        <p>© 2026 ROSA Coffee & Flowers</p>
      </div>
    </div>
  );
}