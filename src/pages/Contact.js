import Navbar from "../components/Navbar";
import { useLang } from "../LanguageContext";
import MonoIcon from "../components/MonoIcon";

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
          <a
            href="https://wa.me/972527991448"
            target="_blank"
            rel="noreferrer"
            className="contact-item"
          >
            <span><MonoIcon name="whatsapp" size={30} /></span>
            WhatsApp
          </a>

          <a
            href="https://www.facebook.com/share/1D75tqmQY4/"
            target="_blank"
            rel="noreferrer"
            className="contact-item"
          >
            <span><MonoIcon name="facebook" size={30} /></span>
            Facebook
          </a>

          <a
            href="https://www.instagram.com/rose.coffeeflower?igsh=cjhrdHF3MGZ3bWYy"
            target="_blank"
            rel="noreferrer"
            className="contact-item"
          >
            <span><MonoIcon name="instagram" size={30} /></span>
            Instagram
          </a>

          <a
            href="https://www.tiktok.com/@rosecoffee.flower?_r=1&_t=ZS-961cwLdSFl7"
            target="_blank"
            rel="noreferrer"
            className="contact-item"
          >
            <span><MonoIcon name="tiktok" size={30} /></span>
            TikTok
          </a>

          <a href="tel:0527991448" className="contact-item">
            <span><MonoIcon name="phone" size={30} /></span>
            {t.callUs || "Call Us"}
          </a>

          <a href="mailto:rosecoffeeflower@gmail.com" className="contact-item">
            <span><MonoIcon name="mail" size={30} /></span>
            Email
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=xyz.kotsh.waslny&pcampaignid=web_share"
            target="_blank"
            rel="noreferrer"
            className="contact-item"
          >
            <span><MonoIcon name="android" size={30} /></span>
            Android Waslni App
          </a>

          <a
            href="https://apps.apple.com/il/app/وصلني-القدس/id6753804097"
            target="_blank"
            rel="noreferrer"
            className="contact-item"
          >
            <span><MonoIcon name="apple" size={30} /></span>
            IOS Waslni App
          </a>
        </div>
      </div>

      <div className="map-card glass">
        <h3 className="contact-title">{t.workingHours || "Working Hours"}</h3>

        <div className="working-hours-list">
          <div className="working-hours-row">
            <span>☕ {t.regularDays || "Regular days"}</span>
            <strong>{t.regularHours || "10:00 AM - 10:00 PM"}</strong>
          </div>

          <div className="working-hours-row">
            <span>🕌 {t.friday || "Friday"}</span>
            <strong>{t.fridayHours || "1:00 PM - 10:00 PM"}</strong>
          </div>

          <div className="working-hours-row">
            <span>🌙 {t.eidEves || "Eid eves"}</span>
            <strong>{t.eidHours || "8:00 AM - 12:00 AM"}</strong>
          </div>
        </div>
      </div>

      <div className="map-card glass">
        <h3 className="contact-title">{t.contactLocation || t.location}</h3>

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
          {t.openInMaps}
        </a>
      </div>

      <div className="footer glass">
        <p>© 2026 ROSA Coffee & Flowers</p>
      </div>
    </div>
  );
}