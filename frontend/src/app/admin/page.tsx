"use client";
import { useEffect, useState } from "react";
import { RequireAdmin } from "../../components/Guard";
import api from "../../lib/api";
import { useAuth } from "../../lib/auth";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("../../components/MapPicker"), { ssr: false });

export default function AdminPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lName, setLName] = useState("");
  const [lDesc, setLDesc] = useState("");
  const [lAddr, setLAddr] = useState("");
  const [lCity, setLCity] = useState("");
  const [lAmen, setLAmen] = useState("");
  const [lImgs, setLImgs] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  async function load() {
    const [b, l, t] = await Promise.all([api.get("/bookings"), api.get("/listings"), api.get("/tenants")]);
    setBookings(b.data);
    setListings(l.data);
    setTenants(t.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await api.put("/bookings/" + id + "/status", { status });
      await load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed");
    }
  }

  function handleMapChange(latitude: number, longitude: number) {
    setLat(latitude);
    setLng(longitude);
  }

  async function createListing() {
    try {
      await api.post("/listings", {
        name: lName,
        description: lDesc,
        address: lAddr,
        city: lCity,
        amenities: lAmen.split(",").map((s) => s.trim()).filter(Boolean),
        images: lImgs.split(",").map((s) => s.trim()).filter(Boolean),
        latitude: lat,
        longitude: lng,
      });
      alert("Created");
      setShowCreate(false);
      setLName("");
      setLDesc("");
      setLAddr("");
      setLCity("");
      setLAmen("");
      setLImgs("");
      setLat(null);
      setLng(null);
      await load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed");
    }
  }

  async function updateListing(id: string) {
    try {
      await api.put("/listings/" + id, {
        name: lName,
        description: lDesc,
        address: lAddr,
        city: lCity,
        amenities: lAmen.split(",").map((s) => s.trim()).filter(Boolean),
        images: lImgs.split(",").map((s) => s.trim()).filter(Boolean),
        latitude: lat,
        longitude: lng,
      });
      alert("Updated");
      setEditingId(null);
      setLName("");
      setLDesc("");
      setLAddr("");
      setLCity("");
      setLAmen("");
      setLImgs("");
      setLat(null);
      setLng(null);
      await load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed");
    }
  }

  async function deleteListing(id: string) {
    if (!confirm("Delete this listing and all its rooms?")) return;
    try {
      await api.delete("/listings/" + id);
      alert("Deleted");
      await load();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed");
    }
  }

  function startEdit(l: any) {
    setEditingId(l.id);
    setLName(l.name);
    setLDesc(l.description);
    setLAddr(l.address);
    setLCity(l.city);
    setLAmen(l.amenities?.join(", "));
    setLImgs(l.images?.join(", "));
    setLat(l.latitude);
    setLng(l.longitude);
  }

  function cancelEdit() {
    setEditingId(null);
    setLName("");
    setLDesc("");
    setLAddr("");
    setLCity("");
    setLAmen("");
    setLImgs("");
    setLat(null);
    setLng(null);
  }

  const myListings = listings.filter((l) => l.ownerId === user?.id);
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const activeTenants = tenants.filter((t) => t.status === "ACTIVE").length;
  const totalRevenue = bookings.filter((b) => b.status === "APPROVED").reduce((sum, b) => sum + Number(b.room?.pricePerMonth || 0), 0);

  return (
    <RequireAdmin>
      <div>
        <h1>Admin Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div className="card">
                <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>My Listings</h3>
                <p style={{ fontSize: "2rem", fontWeight: 700 }}>{myListings.length}</p>
              </div>
              <div className="card">
                <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Pending Bookings</h3>
                <p style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b" }}>{pendingBookings}</p>
              </div>
              <div className="card">
                <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Active Tenants</h3>
                <p style={{ fontSize: "2rem", fontWeight: 700, color: "#10b981" }}>{activeTenants}</p>
              </div>
              <div className="card">
                <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Est. Revenue</h3>
                <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--primary-color)" }}>₱{totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            <h2>Create Listing</h2>
            <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)} style={{ marginBottom: "1rem" }}>
              {showCreate ? "Cancel" : "New Listing"}
            </button>
            {showCreate && (
              <div className="card" style={{ maxWidth: "600px", marginBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <input className="input-field" placeholder="Name" value={lName} onChange={(e) => setLName(e.target.value)} />
                  <textarea className="input-field" placeholder="Description" value={lDesc} onChange={(e) => setLDesc(e.target.value)} rows={3} />
                  <input className="input-field" placeholder="Address" value={lAddr} onChange={(e) => setLAddr(e.target.value)} />
                  <input className="input-field" placeholder="City" value={lCity} onChange={(e) => setLCity(e.target.value)} />
                  <input className="input-field" placeholder="Amenities (comma separated)" value={lAmen} onChange={(e) => setLAmen(e.target.value)} />
                  <input className="input-field" placeholder="Image URLs (comma separated)" value={lImgs} onChange={(e) => setLImgs(e.target.value)} />
                  <div style={{ marginTop: "0.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}>Location (click on map to set)</label>
                    <MapPicker lat={lat} lng={lng} onChange={handleMapChange} />
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      {lat !== null && lng !== null ? `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` : "Click map to set location"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-primary" onClick={createListing}>Create</button>
                    <button className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <h2 style={{ marginTop: "2rem" }}>My Listings</h2>
            {myListings.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>No listings yet.</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {myListings.map((l: any) => (
                  <div key={l.id} className="card" style={{ padding: "1rem" }}>
                    {editingId === l.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <input className="input-field" placeholder="Name" value={lName} onChange={(e) => setLName(e.target.value)} />
                        <textarea className="input-field" placeholder="Description" value={lDesc} onChange={(e) => setLDesc(e.target.value)} rows={3} />
                        <input className="input-field" placeholder="Address" value={lAddr} onChange={(e) => setLAddr(e.target.value)} />
                        <input className="input-field" placeholder="City" value={lCity} onChange={(e) => setLCity(e.target.value)} />
                        <input className="input-field" placeholder="Amenities (comma)" value={lAmen} onChange={(e) => setLAmen(e.target.value)} />
                        <input className="input-field" placeholder="Images (comma)" value={lImgs} onChange={(e) => setLImgs(e.target.value)} />
                        <div style={{ marginTop: "0.5rem" }}>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}>Location (click on map to set)</label>
                          <MapPicker lat={lat} lng={lng} onChange={handleMapChange} />
                          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                            {lat !== null && lng !== null ? `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}` : "Click map to set location"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn btn-primary" onClick={() => updateListing(l.id)}>Save</button>
                          <button className="btn" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3>{l.name}</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{l.city}, {l.address}</p>
                        <p style={{ fontSize: "0.85rem" }}>{l.rooms?.length || 0} rooms · {l.rooms?.filter((r: any) => r.isAvailable).length || 0} available</p>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                          <button className="btn" onClick={() => startEdit(l)}>Edit</button>
                          <button className="btn" onClick={() => deleteListing(l.id)} style={{ background: "var(--error)", color: "white" }}>Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ marginTop: "2rem" }}>All Bookings</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {bookings.map((b: any) => (
                <li key={b.id} className="card" style={{ padding: "1rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{b.user?.firstName} {b.user?.lastName}</strong>
                    <span style={{ marginLeft: "1rem", color: "var(--text-secondary)" }}>{b.room?.name} · {b.room?.listing?.name}</span>
                    <span style={{ marginLeft: "1rem" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, background: b.status === "PENDING" ? "#f59e0b20" : b.status === "APPROVED" ? "#10b98120" : "#ef444420", color: b.status === "PENDING" ? "#f59e0b" : b.status === "APPROVED" ? "#10b981" : "#ef4444" }}>{b.status}</span>
                    </span>
                  </div>
                  {b.status === "PENDING" && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-primary" onClick={() => updateStatus(b.id, "APPROVED")}>Approve</button>
                      <button className="btn" onClick={() => updateStatus(b.id, "REJECTED")} style={{ background: "var(--error)", color: "white" }}>Reject</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </RequireAdmin>
  );
}