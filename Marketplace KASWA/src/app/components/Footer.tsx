import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { parametresApi } from "../../services/api";
import logoImage from "../../imports/designarena_image_56urdtwj.jpg";

export function Footer() {
  const [facebookUrl, setFacebookUrl] = useState("#");
  const [instagramUrl, setInstagramUrl] = useState("#");

  useEffect(() => {
    parametresApi.get().then((res) => {
      const d = res.data;
      if (d.facebook_url && d.facebook_url !== "#") setFacebookUrl(d.facebook_url);
      if (d.instagram_url && d.instagram_url !== "#") setInstagramUrl(d.instagram_url);
    }).catch(() => {});
  }, []);

  return (
    <footer className="bg-[#1B4D3E] text-white pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <ImageWithFallback
                src={logoImage}
                alt="Keswa.dz"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              La première marketplace algérienne dédiée à la location de tenues traditionnelles entre particuliers, investisseurs et boutiques.
            </p>
            <div className="flex gap-3">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9924A] transition-colors">
                <Facebook size={16} />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9924A] transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#C9924A] text-sm mb-4" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Accueil", to: "/" },
                { label: "Catalogue", to: "/catalogue" },
                { label: "À propos", to: "/#about" },
                { label: "Contact", to: "/contact" },
                { label: "Aide & FAQ", to: "/aide" },
                { label: "Publier une annonce", to: "/inscription" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/60 hover:text-[#C9924A] text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#C9924A] text-sm mb-4" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tenues</h4>
            <ul className="space-y-2.5">
              {[
                "Chedda",
                "Caftan",
                "Robes Soirée",
                "Chaouie",
                "Karakou",
                "Blouza",
              ].map((type) => (
                <li key={type}>
                  <Link to={`/catalogue?type=${encodeURIComponent(type)}`} className="text-white/60 hover:text-[#C9924A] text-sm transition-colors">
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#C9924A] text-sm mb-4" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#C9924A] mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#C9924A] shrink-0" />
                <a href="tel:+213555000000" className="text-white/60 hover:text-[#C9924A] text-sm transition-colors">
                  +213 555 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#C9924A] shrink-0" />
                <a href="mailto:contact@keswa.dz" className="text-white/60 hover:text-[#C9924A] text-sm transition-colors">
                  contact@keswa.dz
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl">
              <p className="text-white/80 text-xs" style={{ fontWeight: 500 }}>Paiements acceptés :</p>
              <p className="text-white/60 text-xs mt-1">Barid Mobile · CCP · Carte CIB/VISA</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © 2025 Keswa.dz — Tous droits réservés
          </p>
          <div className="flex gap-5">
            <Link to="/confidentialite" className="text-white/40 hover:text-white/60 text-sm">Confidentialité</Link>
            <Link to="/cgu" className="text-white/40 hover:text-white/60 text-sm">CGU</Link>
            <Link to="/aide" className="text-white/40 hover:text-white/60 text-sm">Aide & FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
