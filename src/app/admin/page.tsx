"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MediaPicker from "@/components/MediaPicker";

type Product = { id: string; name: string; description: string; category: string; moq: string; leadTime: string; image: string; featured: boolean };
type GalleryItem = { id: string; title: string; category: string; image: string };
type Settings = {
  companyName: string; tagline: string;
  heroTitle: string; heroHighlight: string; heroSubtitle: string; heroBadge: string;
  heroBackgroundImage: string; heroOverlayColor: string; heroOverlayOpacity: number;
  aboutTitle: string; aboutText: string; bangladeshText: string;
  address: string; email: string; phone: string; whatsapp: string;
  moqNote: string; leadTimeNote: string; complianceNote: string; registeredNote: string;
  logo: string; favicon: string;
  metaTitle: string; metaDescription: string; metaKeywords: string; ogImage: string; footerText: string;
};

const SECTION_KEYS = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "principles", label: "Principles" },
  { key: "services", label: "Services" },
  { key: "process", label: "Process" },
  { key: "clients", label: "Who We Work With" },
  { key: "products", label: "Products Section" },
  { key: "gallery", label: "Gallery Section" },
  { key: "advantages", label: "Advantages" },
  { key: "contact", label: "Contact" },
] as const;

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "sections" | "products" | "gallery" | "media" | "branding" | "seo" | "company" | "theme">("overview");
  const [sectionKey, setSectionKey] = useState("hero");
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [theme, setTheme] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string>(""); // product | gallery | hero | logo | favicon
  const [sections, setSections] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const favRef = useRef<HTMLInputElement>(null);
  const productImgRef = useRef<HTMLInputElement>(null);
  const galleryImgRef = useRef<HTMLInputElement>(null);
  const heroImgRef = useRef<HTMLInputElement>(null);

  const emptyProduct: Product = { id: "", name: "", description: "", category: "Knit", moq: "500 pcs", leadTime: "45-55 days", image: "", featured: false };
  const emptyGallery: GalleryItem = { id: "", title: "", category: "Production", image: "" };

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [pRes, gRes, sRes, secRes, tRes, mRes] = await Promise.all([
        fetch("/api/products", { credentials: "include" }),
        fetch("/api/gallery", { credentials: "include" }),
        fetch("/api/settings", { credentials: "include" }),
        fetch("/api/sections", { credentials: "include" }),
        fetch("/api/theme", { credentials: "include" }),
        fetch("/api/media", { credentials: "include" }),
      ]);
      setProducts(await pRes.json());
      setGallery(await gRes.json());
      setSettings(await sRes.json());
      setSections(await secRes.json());
      setTheme(await tRes.json());
      setMedia(await mRes.json());
    } catch { setMsg("Failed to load"); }
    finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE", credentials: "include" });
    router.push("/admin/login");
  }

  async function uploadFile(file: File, type: string): Promise<string | null> {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.success) return data.url;
      setMsg(data.error || "Upload failed");
      return null;
    } catch { setMsg("Upload failed"); return null; }
    finally { setUploading(false); }
  }

  async function saveSection() {
    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: sectionKey, data: sections[sectionKey] }),
      credentials: "include",
    });
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (res.ok) setMsg("Section saved. Refresh the website to see changes.");
    else setMsg("Failed to save section");
  }

  function updateSectionField(field: string, value: any) {
    setSections({
      ...sections,
      [sectionKey]: { ...sections[sectionKey], [field]: value },
    });
  }

  function updateListItem(listKey: string, index: number, field: string, value: string) {
    const list = [...(sections[sectionKey]?.[listKey] || [])];
    list[index] = { ...list[index], [field]: value };
    updateSectionField(listKey, list);
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing), credentials: "include" });
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (res.ok) { setMsg("Product saved"); setShowForm(false); setEditing(null); loadData(); }
    else setMsg("Failed");
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE", credentials: "include" });
    setMsg("Deleted"); loadData();
  }

  async function saveGalleryItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGallery) return;
    const method = editingGallery.id ? "PUT" : "POST";
    const res = await fetch("/api/gallery", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingGallery), credentials: "include" });
    if (res.ok) { setMsg("Gallery saved"); setShowGalleryForm(false); setEditingGallery(null); loadData(); }
    else setMsg("Failed");
  }

  async function deleteGallery(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE", credentials: "include" });
    setMsg("Deleted"); loadData();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings), credentials: "include" });
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (res.ok) setMsg("Saved successfully");
    else setMsg("Failed");
  }



  function openPicker(target: string) {
    setPickerTarget(target);
    setPickerOpen(true);
  }

  async function handleMediaSelect(url: string) {
    if (pickerTarget === "product" && editing) {
      setEditing({ ...editing, image: url });
    } else if (pickerTarget === "gallery" && editingGallery) {
      setEditingGallery({ ...editingGallery, image: url });
    } else if (pickerTarget === "hero" && settings) {
      const next = {
        ...settings,
        heroBackgroundImage: url,
        heroOverlayOpacity: settings.heroOverlayOpacity && settings.heroOverlayOpacity > 0 ? settings.heroOverlayOpacity : 60,
        heroOverlayColor: settings.heroOverlayColor || "#0f172a",
      };
      setSettings(next);
      // auto-save hero image so it appears on the site immediately
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        credentials: "include",
      });
      setMsg("Hero image saved. Refresh the homepage to see it.");
    } else if (pickerTarget === "logo" && settings) {
      const next = { ...settings, logo: url };
      setSettings(next);
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        credentials: "include",
      });
      setMsg("Logo saved. Refresh the homepage.");
    } else if (pickerTarget === "favicon" && settings) {
      const next = { ...settings, favicon: url };
      setSettings(next);
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        credentials: "include",
      });
      setMsg("Favicon saved.");
    } else if (pickerTarget === "og" && settings) {
      const next = { ...settings, ogImage: url };
      setSettings(next);
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        credentials: "include",
      });
      setMsg("OG image saved.");
    }
    setPickerOpen(false);
  }

  async function uploadToLibrary(file: File) {
    const url = await uploadFile(file, "media");
    if (url) {
      // reload media list
      const mRes = await fetch("/api/media", { credentials: "include" });
      setMedia(await mRes.json());
      handleMediaSelect(url);
    }
  }

  async function deleteMedia(id: string) {
    if (!confirm("Delete this file from library?")) return;
    const res = await fetch(`/api/media?id=${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setMsg("Media deleted");
      const mRes = await fetch("/api/media", { credentials: "include" });
      setMedia(await mRes.json());
    }
  }

  async function saveThemeConfig() {
    if (!theme) return;
    const res = await fetch("/api/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
      credentials: "include",
    });
    if (res.status === 401) { router.push("/admin/login"); return; }
    if (res.ok) { setMsg("Theme saved! Open the homepage in a new tab (or hard refresh Ctrl+Shift+R) to see colors."); }
    else setMsg("Failed to save theme");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-500 text-sm">Loading...</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sections", label: "Page Sections" },
    { id: "products", label: "Products" },
    { id: "gallery", label: "Gallery" },
    { id: "media", label: "Media Library" },
    { id: "company", label: "Company" },
    { id: "branding", label: "Logo" },
    { id: "theme", label: "Theme" },
    { id: "seo", label: "SEO" },
  ] as const;

  const current = sections[sectionKey] || {};

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-sm text-neutral-900">BIWORSOURCING</Link>
            <span className="text-[10px] bg-neutral-900 text-white px-1.5 py-0.5 rounded">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs text-neutral-500 hover:text-neutral-900">View site ↗</Link>
            <button onClick={logout} className="text-xs text-red-600">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <aside className="w-40 shrink-0 hidden md:block">
          <nav className="space-y-0.5 sticky top-16">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${tab === t.id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-white"}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="md:hidden flex gap-1 overflow-x-auto pb-2 w-full">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${tab === t.id ? "bg-neutral-900 text-white" : "bg-white border text-neutral-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {msg && (
            <div className="mb-4 p-3 bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-md text-sm flex justify-between">
              <span>{msg}</span>
              <button onClick={() => setMsg("")}>×</button>
            </div>
          )}

          {tab === "overview" && (
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 mb-1">Dashboard</h1>
              <p className="text-sm text-neutral-500 mb-6">Manage your entire website from one place</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-4"><div className="text-xl font-semibold">{products.length}</div><div className="text-xs text-neutral-500">Products</div></div>
                <div className="bg-white border border-neutral-200 rounded-lg p-4"><div className="text-xl font-semibold">{gallery.length}</div><div className="text-xs text-neutral-500">Gallery items</div></div>
                <div className="bg-white border border-neutral-200 rounded-lg p-4"><div className="text-xl font-semibold">{media.length}</div><div className="text-xs text-neutral-500">Media files</div></div>
                <div className="bg-white border border-neutral-200 rounded-lg p-4"><div className="text-xl font-semibold">{SECTION_KEYS.length}</div><div className="text-xs text-neutral-500">Page sections</div></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <button onClick={() => setTab("sections")} className="text-left bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition">
                  <div className="text-sm font-medium text-neutral-900">Page Sections</div>
                  <div className="text-xs text-neutral-500 mt-1">Edit hero, about, services, process…</div>
                </button>
                <button onClick={() => setTab("media")} className="text-left bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition">
                  <div className="text-sm font-medium text-neutral-900">Media Library</div>
                  <div className="text-xs text-neutral-500 mt-1">Upload once, reuse everywhere</div>
                </button>
                <button onClick={() => setTab("products")} className="text-left bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition">
                  <div className="text-sm font-medium text-neutral-900">Products</div>
                  <div className="text-xs text-neutral-500 mt-1">Catalogue with images</div>
                </button>
                <button onClick={() => setTab("theme")} className="text-left bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition">
                  <div className="text-sm font-medium text-neutral-900">Theme & Colors</div>
                  <div className="text-xs text-neutral-500 mt-1">Presets + custom palette</div>
                </button>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-4">
                <div className="text-sm font-medium text-neutral-900 mb-2">Quick tips</div>
                <ul className="text-xs text-neutral-500 space-y-1 list-disc list-inside">
                  <li>Upload photos in <strong>Media Library</strong>, then select them for products, gallery, or hero</li>
                  <li>Use <strong>Page Sections</strong> to edit all homepage text and toggle sections</li>
                  <li>Hero supports background image + overlay color and opacity %</li>
                  <li>Change the whole site look under <strong>Theme</strong></li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTIONS — full customization */}
          {tab === "sections" && (
            <div>
              <h1 className="text-lg font-semibold text-neutral-900 mb-1">Page Sections</h1>
              <p className="text-sm text-neutral-500 mb-4">Edit content for each section. Toggle visibility on/off.</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {SECTION_KEYS.map((s) => (
                  <button key={s.key} onClick={() => setSectionKey(s.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${sectionKey === s.key ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600"}`}>
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h2 className="font-medium text-neutral-900 capitalize">{sectionKey} section</h2>
                  <label className="flex items-center gap-2 text-sm text-neutral-600">
                    <input type="checkbox" checked={current.visible !== false}
                      onChange={(e) => updateSectionField("visible", e.target.checked)} className="rounded" />
                    Visible on site
                  </label>
                </div>

                {/* Common fields */}
                {"label" in current && (
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Section label</label>
                    <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" value={current.label || ""} onChange={(e) => updateSectionField("label", e.target.value)} />
                  </div>
                )}
                {"title" in current && (
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Title</label>
                    <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" value={current.title || ""} onChange={(e) => updateSectionField("title", e.target.value)} />
                  </div>
                )}
                {"subtitle" in current && (
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Subtitle</label>
                    <textarea className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" rows={2} value={current.subtitle || ""} onChange={(e) => updateSectionField("subtitle", e.target.value)} />
                  </div>
                )}
                {"text" in current && (
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Body text</label>
                    <textarea className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" rows={3} value={current.text || ""} onChange={(e) => updateSectionField("text", e.target.value)} />
                  </div>
                )}

                {/* Hero specific */}
                {sectionKey === "hero" && (
                  <>
                    {/* Background image */}
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md space-y-3">
                      <div className="text-xs font-medium text-neutral-700 uppercase tracking-wide">Hero background image</div>
                      <div className="flex items-center gap-4">
                        <div className="w-40 h-24 bg-neutral-200 rounded overflow-hidden flex items-center justify-center relative">
                          {current.backgroundImage ? (
                            <img src={current.backgroundImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-400">No image</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input ref={heroImgRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = await uploadFile(f, "hero");
                              if (url) updateSectionField("backgroundImage", url);
                            }
                          }} />
                          <button type="button" disabled={uploading} onClick={() => openPicker("hero")} className="block text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md disabled:opacity-50">
                            {uploading ? "Uploading..." : "Choose from library"}
                          </button>
                          {current.backgroundImage && (
                            <button type="button" onClick={() => updateSectionField("backgroundImage", "")} className="block text-xs text-red-600">Remove image</button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Overlay color + opacity */}
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
                      <div className="text-xs font-medium text-neutral-700 uppercase tracking-wide">Overlay color & opacity</div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Overlay color</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={current.overlayColor || "#0B1F3A"} onChange={(e) => updateSectionField("overlayColor", e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
                            <input className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm font-mono" value={current.overlayColor || "#0B1F3A"} onChange={(e) => updateSectionField("overlayColor", e.target.value)} />
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {["#0B1F3A", "#1A1A1A", "#1E4D8C", "#0F172A", "#14532D", "#7C2D12"].map((col) => (
                              <button key={col} type="button" onClick={() => updateSectionField("overlayColor", col)} className="w-6 h-6 rounded border border-neutral-300" style={{ backgroundColor: col }} title={col} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Overlay opacity: {current.overlayOpacity ?? 60}%</label>
                          <input type="range" min={0} max={100} step={5} value={current.overlayOpacity ?? 60}
                            onChange={(e) => updateSectionField("overlayOpacity", Number(e.target.value))}
                            className="w-full" />
                          <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                            <span>0%</span><span>50%</span><span>100%</span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[40, 50, 60, 70, 80].map((v) => (
                              <button key={v} type="button" onClick={() => updateSectionField("overlayOpacity", v)}
                                className={`text-[10px] px-2 py-1 rounded border ${(current.overlayOpacity ?? 60) === v ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-600"}`}>
                                {v}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Live preview strip */}
                      <div className="relative h-16 rounded overflow-hidden border border-neutral-200">
                        {current.backgroundImage ? (
                          <img src={current.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-neutral-300" />
                        )}
                        <div className="absolute inset-0" style={{ backgroundColor: current.overlayColor || "#0B1F3A", opacity: (current.overlayOpacity ?? 60) / 100 }} />
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium drop-shadow">Preview</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Badge (small top text)</label>
                      <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" value={current.badge || ""} onChange={(e) => updateSectionField("badge", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Highlight line (under title)</label>
                      <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" value={current.highlight || ""} onChange={(e) => updateSectionField("highlight", e.target.value)} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Primary button text</label>
                        <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" value={current.ctaPrimary || ""} onChange={(e) => updateSectionField("ctaPrimary", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Secondary button text</label>
                        <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm" value={current.ctaSecondary || ""} onChange={(e) => updateSectionField("ctaSecondary", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Badges (comma separated)</label>
                      <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                        value={(current.badges || []).join(", ")}
                        onChange={(e) => updateSectionField("badges", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Trust items (comma separated)</label>
                      <input className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm"
                        value={(current.trustItems || []).join(", ")}
                        onChange={(e) => updateSectionField("trustItems", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} />
                    </div>
                  </>
                )}

                {/* List items: cards, items, steps */}
                {["cards", "items", "steps"].map((listKey) => {
                  const list = current[listKey];
                  if (!Array.isArray(list)) return null;
                  return (
                    <div key={listKey} className="space-y-3 pt-2 border-t border-neutral-100">
                      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{listKey}</div>
                      {list.map((item: any, i: number) => (
                        <div key={i} className="p-3 bg-neutral-50 rounded-md space-y-2">
                          <div className="grid sm:grid-cols-2 gap-2">
                            {item.num !== undefined && (
                              <input className="px-2 py-1.5 border border-neutral-300 rounded text-sm" placeholder="Num" value={item.num || ""} onChange={(e) => updateListItem(listKey, i, "num", e.target.value)} />
                            )}
                            <input className="px-2 py-1.5 border border-neutral-300 rounded text-sm" placeholder="Title" value={item.title || ""} onChange={(e) => updateListItem(listKey, i, "title", e.target.value)} />
                          </div>
                          <textarea className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm" rows={2} placeholder="Text" value={item.text || ""} onChange={(e) => updateListItem(listKey, i, "text", e.target.value)} />
                        </div>
                      ))}
                    </div>
                  );
                })}

                <button onClick={saveSection} className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium px-5 py-2 rounded-md">
                  Save {sectionKey} section
                </button>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-lg font-semibold">Products</h1>
                  <p className="text-sm text-neutral-500">With image upload</p>
                </div>
                <button onClick={() => { setEditing({ ...emptyProduct }); setShowForm(true); }} className="bg-neutral-900 text-white text-sm px-3 py-1.5 rounded-md">+ Add</button>
              </div>
              {showForm && editing && (
                <form onSubmit={saveProduct} className="mb-4 p-4 bg-white border border-neutral-200 rounded-lg space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input className="px-3 py-2 border rounded-md text-sm" placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                    <input className="px-3 py-2 border rounded-md text-sm" placeholder="Category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                    <input className="px-3 py-2 border rounded-md text-sm" placeholder="MOQ" value={editing.moq} onChange={(e) => setEditing({ ...editing, moq: e.target.value })} />
                    <input className="px-3 py-2 border rounded-md text-sm" placeholder="Lead time" value={editing.leadTime} onChange={(e) => setEditing({ ...editing, leadTime: e.target.value })} />
                  </div>
                  <textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={2} placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-neutral-100 rounded border overflow-hidden flex items-center justify-center">
                      {editing.image ? <img src={editing.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-neutral-400">No img</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => openPicker("product")} className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md">Choose from library</button>
                      <input ref={productImgRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "product"); if (url) { setEditing({ ...editing, image: url }); const mRes = await fetch("/api/media", { credentials: "include" }); setMedia(await mRes.json()); } } }} />
                      <button type="button" disabled={uploading} onClick={() => productImgRef.current?.click()} className="text-xs text-neutral-600 hover:underline">{uploading ? "..." : "Or upload new"}</button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-neutral-900 text-white text-sm px-4 py-1.5 rounded-md">Save</button>
                    <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-sm px-4 py-1.5 border rounded-md">Cancel</button>
                  </div>
                </form>
              )}
              <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 text-left text-xs text-neutral-500">
                    <tr><th className="px-3 py-2">Img</th><th className="px-3 py-2">Name</th><th className="px-3 py-2 hidden sm:table-cell">Category</th><th className="px-3 py-2">Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-neutral-100">
                        <td className="px-3 py-2"><div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden">{p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : null}</div></td>
                        <td className="px-3 py-2 font-medium">{p.name}</td>
                        <td className="px-3 py-2 text-neutral-500 hidden sm:table-cell">{p.category}</td>
                        <td className="px-3 py-2 space-x-2">
                          <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-xs text-neutral-700 hover:underline">Edit</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-600 hover:underline">Del</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div><h1 className="text-lg font-semibold">Gallery</h1><p className="text-sm text-neutral-500">Factory photos</p></div>
                <button onClick={() => { setEditingGallery({ ...emptyGallery }); setShowGalleryForm(true); }} className="bg-neutral-900 text-white text-sm px-3 py-1.5 rounded-md">+ Add</button>
              </div>
              {showGalleryForm && editingGallery && (
                <form onSubmit={saveGalleryItem} className="mb-4 p-4 bg-white border rounded-lg space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input className="px-3 py-2 border rounded-md text-sm" placeholder="Title" value={editingGallery.title} onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })} required />
                    <select className="px-3 py-2 border rounded-md text-sm" value={editingGallery.category} onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}>
                      <option>Production</option><option>QC</option><option>Packing</option><option>Shipping</option><option>Products</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-16 bg-neutral-100 rounded border overflow-hidden flex items-center justify-center">
                      {editingGallery.image ? <img src={editingGallery.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-neutral-400">No img</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => openPicker("gallery")} className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md">Choose from library</button>
                      <input ref={galleryImgRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "gallery"); if (url) { setEditingGallery({ ...editingGallery, image: url }); const mRes = await fetch("/api/media", { credentials: "include" }); setMedia(await mRes.json()); } } }} />
                      <button type="button" disabled={uploading} onClick={() => galleryImgRef.current?.click()} className="text-xs text-neutral-600 hover:underline">{uploading ? "..." : "Or upload new"}</button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-neutral-900 text-white text-sm px-4 py-1.5 rounded-md">Save</button>
                    <button type="button" onClick={() => { setShowGalleryForm(false); setEditingGallery(null); }} className="text-sm px-4 py-1.5 border rounded-md">Cancel</button>
                  </div>
                </form>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white border rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] bg-neutral-100">{g.image ? <img src={g.image} alt={g.title} className="w-full h-full object-cover" /> : null}</div>
                    <div className="p-2 flex justify-between items-center">
                      <div className="text-xs font-medium">{g.title}</div>
                      <div className="space-x-2">
                        <button onClick={() => { setEditingGallery(g); setShowGalleryForm(true); }} className="text-xs text-neutral-600">Edit</button>
                        <button onClick={() => deleteGallery(g.id)} className="text-xs text-red-600">Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPANY */}
          
          {/* MEDIA LIBRARY */}
          {tab === "media" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-lg font-semibold">Media Library</h1>
                  <p className="text-sm text-neutral-500">All uploaded images — reuse for products, gallery, hero, logo</p>
                </div>
                <label className="text-sm bg-neutral-900 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-neutral-800">
                  {uploading ? "Uploading..." : "+ Upload"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      await uploadFile(f, "media");
                      const mRes = await fetch("/api/media", { credentials: "include" });
                      setMedia(await mRes.json());
                      setMsg("Uploaded to library");
                    }
                  }} />
                </label>
              </div>
              {media.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-lg py-16 text-center text-sm text-neutral-400">
                  No media yet. Upload images to build your library.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {media.map((m: any) => (
                    <div key={m.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden group">
                      <div className="aspect-square bg-neutral-100 relative">
                        <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-medium text-neutral-800 truncate">{m.name}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{m.type} · {Math.round((m.size || 0) / 1024)} KB</div>
                        <div className="flex gap-2 mt-2">
                          <button type="button" onClick={() => { navigator.clipboard?.writeText(m.url); setMsg("URL copied"); }} className="text-[10px] text-neutral-600 hover:underline">Copy URL</button>
                          <button type="button" onClick={() => deleteMedia(m.id)} className="text-[10px] text-red-600 hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {tab === "company" && settings && (
            <div>
              <h1 className="text-lg font-semibold mb-1">Content & Contact</h1>
              <p className="text-sm text-neutral-500 mb-4">Edit homepage hero, about, and contact details</p>
              <form onSubmit={saveSettings} className="bg-white border rounded-lg p-5 space-y-4">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Hero</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs text-neutral-500 mb-1">Hero badge</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.heroBadge || ""} onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })} /></div>
                  <div><label className="block text-xs text-neutral-500 mb-1">Hero highlight</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.heroHighlight || ""} onChange={(e) => setSettings({ ...settings, heroHighlight: e.target.value })} /></div>
                </div>
                <div><label className="block text-xs text-neutral-500 mb-1">Hero title</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.heroTitle || ""} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></div>
                <div><label className="block text-xs text-neutral-500 mb-1">Hero subtitle</label><textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={2} value={settings.heroSubtitle || ""} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} /></div>
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-md border">
                  <div className="w-28 h-16 bg-neutral-200 rounded overflow-hidden flex items-center justify-center">
                    {settings.heroBackgroundImage ? <img src={settings.heroBackgroundImage} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-neutral-400">No image</span>}
                  </div>
                  <div>
                    <button type="button" onClick={() => openPicker("hero")} className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md">Hero image from library</button>
                    <div className="flex items-center gap-2 mt-2">
                      <input type="color" value={settings.heroOverlayColor || "#0f172a"} onChange={(e) => setSettings({ ...settings, heroOverlayColor: e.target.value })} className="w-8 h-8 rounded border" />
                      <label className="text-xs text-neutral-500">Overlay {settings.heroOverlayOpacity ?? 0}%</label>
                      <input type="range" min={0} max={100} step={5} value={settings.heroOverlayOpacity ?? 0} onChange={(e) => setSettings({ ...settings, heroOverlayOpacity: Number(e.target.value) })} className="w-24" />
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide pt-2">About</div>
                <div><label className="block text-xs text-neutral-500 mb-1">About title</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.aboutTitle || ""} onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })} /></div>
                <div><label className="block text-xs text-neutral-500 mb-1">About text</label><textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={3} value={settings.aboutText || ""} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} /></div>
                <div><label className="block text-xs text-neutral-500 mb-1">Bangladesh story</label><textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={2} value={settings.bangladeshText || ""} onChange={(e) => setSettings({ ...settings, bangladeshText: e.target.value })} /></div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div><label className="block text-xs text-neutral-500 mb-1">MOQ note</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.moqNote || ""} onChange={(e) => setSettings({ ...settings, moqNote: e.target.value })} /></div>
                  <div><label className="block text-xs text-neutral-500 mb-1">Lead time note</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.leadTimeNote || ""} onChange={(e) => setSettings({ ...settings, leadTimeNote: e.target.value })} /></div>
                  <div><label className="block text-xs text-neutral-500 mb-1">Compliance note</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.complianceNote || ""} onChange={(e) => setSettings({ ...settings, complianceNote: e.target.value })} /></div>
                </div>
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide pt-2">Contact</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs text-neutral-500 mb-1">Company name</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} /></div>
                  <div><label className="block text-xs text-neutral-500 mb-1">Email</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></div>
                  <div><label className="block text-xs text-neutral-500 mb-1">Phone</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></div>
                  <div><label className="block text-xs text-neutral-500 mb-1">WhatsApp</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} /></div>
                </div>
                <div><label className="block text-xs text-neutral-500 mb-1">Address</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
                <div><label className="block text-xs text-neutral-500 mb-1">Footer text</label><textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={2} value={settings.footerText} onChange={(e) => setSettings({ ...settings, footerText: e.target.value })} /></div>
                <button type="submit" className="bg-neutral-900 text-white text-sm px-5 py-2 rounded-md">Save content</button>
              </form>
            </div>
          )}

          {/* BRANDING */}
          {tab === "branding" && settings && (
            <div>
              <h1 className="text-lg font-semibold mb-4">Logo & Favicon</h1>
              <form onSubmit={saveSettings} className="space-y-4">
                <div className="bg-white border rounded-lg p-5">
                  <h2 className="text-sm font-medium mb-3">Logo</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-12 bg-neutral-100 rounded border flex items-center justify-center overflow-hidden">
                      {settings.logo ? <img src={settings.logo} alt="" className="max-h-10 max-w-full object-contain" /> : <span className="text-xs text-neutral-400">None</span>}
                    </div>
                    <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "logo"); if (url) setSettings({ ...settings, logo: url }); } }} />
                    <button type="button" disabled={uploading} onClick={() => openPicker("logo")} className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md">Choose from library</button>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-5">
                  <h2 className="text-sm font-medium mb-3">Favicon</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded border flex items-center justify-center overflow-hidden">
                      {settings.favicon ? <img src={settings.favicon} alt="" className="w-6 h-6 object-contain" /> : <span className="text-[9px] text-neutral-400">None</span>}
                    </div>
                    <input ref={favRef} type="file" accept="image/*,.ico" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "favicon"); if (url) setSettings({ ...settings, favicon: url }); } }} />
                    <button type="button" disabled={uploading} onClick={() => openPicker("favicon")} className="text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md">Choose from library</button>
                  </div>
                </div>
                <button type="submit" className="bg-neutral-900 text-white text-sm px-5 py-2 rounded-md">Save branding</button>
              </form>
            </div>
          )}


          {/* THEME */}
          {tab === "theme" && theme && (
            <div>
              <h1 className="text-lg font-semibold mb-1">Color Theme</h1>
              <p className="text-sm text-neutral-500 mb-5">Pick a preset palette or customize every color</p>

              {/* Presets */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {[
                  { id: "teal-amber", name: "Teal & Amber", desc: "Original warm look", colors: { navy: "#0F766E", accent: "#D97706", surface: "#F8FAFC" } },
                  { id: "corporate-navy", name: "Corporate Navy", desc: "Classic B2B navy", colors: { navy: "#0B1F3A", accent: "#1E4D8C", surface: "#F7F8FA" } },
                  { id: "forest", name: "Forest Green", desc: "Deep green trust", colors: { navy: "#14532D", accent: "#CA8A04", surface: "#F9FAFB" } },
                  { id: "charcoal", name: "Charcoal Minimal", desc: "Black & gray", colors: { navy: "#171717", accent: "#525252", surface: "#FAFAFA" } },
                  { id: "slate-blue", name: "Slate Blue", desc: "Cool blue-gray", colors: { navy: "#1E293B", accent: "#0284C7", surface: "#F8FAFC" } },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      const presets: Record<string, any> = {
                        "teal-amber": { navy: "#0F766E", navyMid: "#0D5C56", accent: "#D97706", accentSoft: "#FEF3C7", charcoal: "#0F172A", slate: "#475569", slateLight: "#94A3B8", border: "#E2E8F0", surface: "#F8FAFC", white: "#FFFFFF" },
                        "corporate-navy": { navy: "#0B1F3A", navyMid: "#132B4A", accent: "#1E4D8C", accentSoft: "#E8EEF6", charcoal: "#1A1A1A", slate: "#64748B", slateLight: "#94A3B8", border: "#E2E8F0", surface: "#F7F8FA", white: "#FFFFFF" },
                        "forest": { navy: "#14532D", navyMid: "#166534", accent: "#CA8A04", accentSoft: "#FEF9C3", charcoal: "#14532D", slate: "#4B5563", slateLight: "#9CA3AF", border: "#E5E7EB", surface: "#F9FAFB", white: "#FFFFFF" },
                        "charcoal": { navy: "#171717", navyMid: "#262626", accent: "#525252", accentSoft: "#F5F5F5", charcoal: "#171717", slate: "#737373", slateLight: "#A3A3A3", border: "#E5E5E5", surface: "#FAFAFA", white: "#FFFFFF" },
                        "slate-blue": { navy: "#1E293B", navyMid: "#334155", accent: "#0284C7", accentSoft: "#E0F2FE", charcoal: "#0F172A", slate: "#64748B", slateLight: "#94A3B8", border: "#E2E8F0", surface: "#F8FAFC", white: "#FFFFFF" },
                      };
                      setTheme({ presetId: p.id, custom: false, colors: presets[p.id] });
                    }}
                    className={`text-left p-4 rounded-lg border transition ${theme.presetId === p.id && !theme.custom ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"}`}
                  >
                    <div className="flex gap-1.5 mb-3">
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: p.colors.navy }} />
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: p.colors.accent }} />
                      <div className="w-8 h-8 rounded border border-neutral-200" style={{ backgroundColor: p.colors.surface }} />
                    </div>
                    <div className="text-sm font-medium text-neutral-900">{p.name}</div>
                    <div className="text-xs text-neutral-500">{p.desc}</div>
                  </button>
                ))}
              </div>

              {/* Custom colors */}
              <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-neutral-900">Customize colors</h2>
                  <label className="flex items-center gap-2 text-xs text-neutral-600">
                    <input type="checkbox" checked={!!theme.custom} onChange={(e) => setTheme({ ...theme, custom: e.target.checked, presetId: e.target.checked ? "custom" : theme.presetId })} />
                    Use custom colors
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: "navy", label: "Primary (header / dark)" },
                    { key: "navyMid", label: "Primary mid" },
                    { key: "accent", label: "Accent" },
                    { key: "accentSoft", label: "Accent soft (bg)" },
                    { key: "charcoal", label: "Text dark" },
                    { key: "slate", label: "Text muted" },
                    { key: "slateLight", label: "Text light" },
                    { key: "border", label: "Border" },
                    { key: "surface", label: "Page background" },
                    { key: "white", label: "White / cards" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs text-neutral-500 mb-1">{f.label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.colors?.[f.key] || "#000000"}
                          onChange={(e) => setTheme({
                            ...theme,
                            custom: true,
                            presetId: "custom",
                            colors: { ...theme.colors, [f.key]: e.target.value },
                          })}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                        <input
                          className="flex-1 px-2 py-1.5 border border-neutral-300 rounded-md text-xs font-mono"
                          value={theme.colors?.[f.key] || ""}
                          onChange={(e) => setTheme({
                            ...theme,
                            custom: true,
                            presetId: "custom",
                            colors: { ...theme.colors, [f.key]: e.target.value },
                          })}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preview bar */}
                <div className="pt-3 border-t border-neutral-100">
                  <div className="text-xs text-neutral-500 mb-2">Preview</div>
                  <div className="flex overflow-hidden rounded-md border border-neutral-200 h-12">
                    <div className="flex-1" style={{ backgroundColor: theme.colors?.navy }} />
                    <div className="flex-1" style={{ backgroundColor: theme.colors?.navyMid }} />
                    <div className="flex-1" style={{ backgroundColor: theme.colors?.accent }} />
                    <div className="flex-1" style={{ backgroundColor: theme.colors?.surface }} />
                    <div className="flex-1 border-l" style={{ backgroundColor: theme.colors?.white }} />
                  </div>
                </div>

                <button type="button" onClick={saveThemeConfig} className="bg-neutral-900 text-white text-sm font-medium px-5 py-2 rounded-md">
                  Save theme
                </button>
                <p className="text-xs text-neutral-400">After saving, refresh the public website to apply the new colors.</p>
              </div>
            </div>
          )}


                    {/* SEO */}
          {tab === "seo" && settings && (
            <div>
              <h1 className="text-lg font-semibold mb-1">SEO & Tracking</h1>
              <p className="text-sm text-neutral-500 mb-4">Google ranking, social previews, Analytics & Meta Pixel</p>
              <form onSubmit={saveSettings} className="space-y-4">
                <div className="bg-white border rounded-lg p-5 space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Search engine</div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Site URL (canonical) *</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm" placeholder="https://biworsourcing.com" value={(settings as any).siteUrl || ""} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value } as any)} />
                    <p className="text-[10px] text-neutral-400 mt-1">Used for sitemap, robots.txt, Open Graph and structured data</p>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Meta title (50–60 chars)</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.metaTitle || ""} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} />
                    <p className="text-[10px] text-neutral-400 mt-1">{(settings.metaTitle || "").length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Meta description (150–160 chars)</label>
                    <textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={3} value={settings.metaDescription || ""} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} />
                    <p className="text-[10px] text-neutral-400 mt-1">{(settings.metaDescription || "").length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Keywords (comma separated)</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm" value={settings.metaKeywords || ""} onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">OG / Social share image URL</label>
                    <div className="flex gap-2">
                      <input className="flex-1 px-3 py-2 border rounded-md text-sm" value={settings.ogImage || ""} onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })} placeholder="/uploads/og-image.jpg" />
                      <button type="button" onClick={() => openPicker("og")} className="text-xs bg-neutral-900 text-white px-3 py-2 rounded-md whitespace-nowrap">Library</button>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">Recommended 1200×630 px</p>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input type="checkbox" checked={(settings as any).robotsIndex !== false} onChange={(e) => setSettings({ ...settings, robotsIndex: e.target.checked } as any)} />
                    Allow Google to index this site
                  </label>
                </div>

                <div className="bg-white border rounded-lg p-5 space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Google Analytics</div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Google Analytics 4 ID</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm font-mono" placeholder="G-XXXXXXXXXX" value={(settings as any).googleAnalyticsId || ""} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value } as any)} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Google Tag Manager ID</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm font-mono" placeholder="GTM-XXXXXXX" value={(settings as any).googleTagManagerId || ""} onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value } as any)} />
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-5 space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Facebook / Meta</div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Meta Pixel ID</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm font-mono" placeholder="1234567890" value={(settings as any).facebookPixelId || ""} onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value } as any)} />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Facebook App ID</label>
                    <input className="w-full px-3 py-2 border rounded-md text-sm font-mono" value={(settings as any).facebookAppId || ""} onChange={(e) => setSettings({ ...settings, facebookAppId: e.target.value } as any)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs text-neutral-500 mb-1">Facebook page URL</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={(settings as any).facebookUrl || ""} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value } as any)} /></div>
                    <div><label className="block text-xs text-neutral-500 mb-1">LinkedIn URL</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={(settings as any).linkedinUrl || ""} onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value } as any)} /></div>
                    <div><label className="block text-xs text-neutral-500 mb-1">Instagram URL</label><input className="w-full px-3 py-2 border rounded-md text-sm" value={(settings as any).instagramUrl || ""} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value } as any)} /></div>
                    <div><label className="block text-xs text-neutral-500 mb-1">Twitter / X handle</label><input className="w-full px-3 py-2 border rounded-md text-sm" placeholder="@biworsourcing" value={(settings as any).twitterHandle || ""} onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value } as any)} /></div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-5 space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Cookies</div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={(settings as any).cookieConsentEnabled !== false} onChange={(e) => setSettings({ ...settings, cookieConsentEnabled: e.target.checked } as any)} />
                    Show cookie consent banner
                  </label>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Cookie banner text</label>
                    <textarea className="w-full px-3 py-2 border rounded-md text-sm" rows={2} value={(settings as any).cookieConsentText || ""} onChange={(e) => setSettings({ ...settings, cookieConsentText: e.target.value } as any)} />
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-xs text-teal-900 space-y-1">
                  <div className="font-semibold">Auto-generated for ranking</div>
                  <ul className="list-disc list-inside text-teal-800 space-y-0.5">
                    <li>/sitemap.xml — for Google Search Console</li>
                    <li>/robots.txt — crawl rules</li>
                    <li>JSON-LD Organization + WebSite schema (helps Google & AI)</li>
                    <li>Open Graph + Twitter cards for social sharing</li>
                    <li>Canonical URL from Site URL above</li>
                  </ul>
                </div>

                <button type="submit" className="bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-md">Save SEO settings</button>
              </form>
            </div>
          )}
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        media={media}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelect}
        onUpload={uploadToLibrary}
        uploading={uploading}
      />

    </div>
  );
}
