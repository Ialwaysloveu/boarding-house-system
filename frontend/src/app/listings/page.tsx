"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("../../components/Map"), { ssr: false });

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "map">("list");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/listings", {
        params: { q: q || undefined, city: city || undefined, page, limit: 6 },
      });
      setListings(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page]);

  function lowestPrice(l: any) {
    const prices = (l.rooms || []).map((r: any) => Number(r.pricePerMonth));
    return prices.length ? Math.min(...prices) : null;
  }
  function availRooms(l: any) {
    return (l.rooms || []).filter((r: any) => r.isAvailable).length;
  }

  return (
    <div>
      <div className="card" style={{ display: "flex", gap: "1rem", padding: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <input className="input-field" placeholder="Search by name or city..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 2, minWidth: "200px" }} />
        <input className="input-field" placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={{ flex: 1, minWidth: "150px" }} />
        <button onClick={() => setView("list")} className={view === "list" ? "btn btn-primary" : "btn"}>List</button>
        <button onClick={() => setView("map")} className={view === "map" ? "btn btn-primary" : "btn"}>Map</button>
        <button className="btn btn-primary" onClick={load} aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "var(--error)" }}>{error}</p>}
      {!loading && !error && listings.length === 0 && <p>No listings found.</p>}
      {view === "map" ? (
        <Map items={listings} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {listings.map((l: any) => (
            <div key={l.id} className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
              <div style={{ width: "100%", height: "200px", backgroundColor: "var(--border-color)" }}>
                {l.images?.[0] ? <img src={l.images[0]} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%" }} />}
              </div>
              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3>{l.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{l.city}</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{availRooms(l)} rooms available</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary-color)" }}>{lowestPrice(l) !== null ? "₱" + lowestPrice(l)!.toLocaleString() + "/mo" : ""}</span>
                  <Link href={"/listings/" + l.id} className="btn" style={{ border: "1px solid var(--border-color)", padding: "0.5rem 1rem", fontSize: "0.9rem" }}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
        <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span style={{ display: "flex", alignItems: "center" }}>Page {page}</span>
        <button className="btn" onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}