"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Megaphone } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Banner { id: number; message_fr: string; message_en: string | null; href: string | null; active: boolean; created_at: string; }

const COLS = "id,message_fr,message_en,href,active,created_at";

export default function BannerManager({ fr }: { fr: boolean }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [msgFr, setMsgFr] = useState("");
  const [msgEn, setMsgEn] = useState("");
  const [href, setHref] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_banners").select(COLS).order("created_at", { ascending: false });
    setBanners((data as Banner[]) ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create() {
    if (!msgFr.trim()) return;
    await supabase.from("site_banners").update({ active: false }).eq("active", true);
    const { data, error } = await supabase
      .from("site_banners")
      .insert({ message_fr: msgFr.trim(), message_en: msgEn.trim() || null, href: href.trim() || null, active: true })
      .select(COLS)
      .single();
    if (!error && data) { setMsgFr(""); setMsgEn(""); setHref(""); load(); }
  }

  async function toggle(id: number, active: boolean) {
    if (active) await supabase.from("site_banners").update({ active: false }).eq("active", true);
    await supabase.from("site_banners").update({ active }).eq("id", id);
    load();
  }

  async function remove(id: number) {
    await supabase.from("site_banners").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="bg-surface border border-black/5 rounded-2xl p-5">
        <h3 className="font-semibold text-navy mb-4 text-sm">{fr ? "Nouvelle bannière" : "New banner"}</h3>
        <div className="space-y-3">
          <label className="block text-xs text-navy/60">{fr ? "Message (FR)" : "Message (FR)"}
            <input value={msgFr} onChange={(e) => setMsgFr(e.target.value)} placeholder={fr ? "Spécial fête des Mères : forfaits exclusifs 🌸" : "Mother's Day special 🌸"} className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" />
          </label>
          <label className="block text-xs text-navy/60">{fr ? "Message (EN, optionnel)" : "Message (EN, optional)"}
            <input value={msgEn} onChange={(e) => setMsgEn(e.target.value)} placeholder="Mother's Day special 🌸" className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" />
          </label>
          <label className="block text-xs text-navy/60">{fr ? "Lien (optionnel, ex: /packages)" : "Link (optional, e.g. /packages)"}
            <input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/packages" className="mt-1 block w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-navy" />
          </label>
          <button onClick={create} className="inline-flex items-center gap-1.5 gradient-gold text-navy font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" strokeWidth={2} /> {fr ? "Publier la bannière" : "Publish banner"}
          </button>
          <p className="text-navy/40 text-xs">{fr ? "Publier active cette bannière et désactive les autres. Elle apparaît en haut du site." : "Publishing activates this banner and deactivates the others. It shows at the top of the site."}</p>
        </div>
      </div>

      {banners.length === 0 ? <p className="text-navy/50">{fr ? "Aucune bannière." : "No banners."}</p> : (
        <div className="space-y-2">{banners.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 bg-surface border border-black/5 rounded-xl px-4 py-3">
            <Megaphone className="w-4 h-4 text-gold shrink-0" strokeWidth={1.75} />
            <span className="flex-1 min-w-[160px] truncate text-navy text-sm">{b.message_fr}</span>
            <button onClick={() => toggle(b.id, !b.active)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${b.active ? "bg-green-500/15 text-green-700" : "bg-black/5 text-navy/50"}`}>{b.active ? (fr ? "Active" : "Active") : (fr ? "Inactive" : "Inactive")}</button>
            <button onClick={() => remove(b.id)} className="text-navy/40 hover:text-red-500 transition-colors" aria-label={fr ? "Supprimer" : "Delete"}><Trash2 className="w-4 h-4" strokeWidth={1.75} /></button>
          </div>))}
        </div>
      )}
    </div>
  );
}
