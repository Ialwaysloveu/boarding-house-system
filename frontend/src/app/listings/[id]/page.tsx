"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [fbLoading, setFbLoading] = useState(true);
  const [fbError, setFbError] = useState("");
  const [fbPage, setFbPage] = useState(1);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [myReview, setMyReview] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/listings/" + id);
        setListing(res.data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setFbLoading(true);
        const res = await api.get("/listings/" + id + "/feedback", { params: { page: 1, limit: 5 } });
        setFeedbacks(res.data.feedbacks || []);
        setAverage(res.data.average);
        setCount(res.data.count);
        const mine = res.data.feedbacks?.find((f: any) => f.userId === user?.id);
        if (mine) setMyReview(mine);
      } catch (e: any) {
        setFbError(e.response?.data?.message || "Failed to load reviews");
      } finally {
        setFbLoading(false);
      }
    })();
  }, [id]);

  async function book(roomId: string) {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      await api.post("/bookings", { roomId, message });
      setBookingStatus("Booked! Pending approval.");
      setSelectedRoom(null);
    } catch (e: any) {
      setBookingStatus(e.response?.data?.message || "Booking failed");
    }
  }

  async function submitReview() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (rating === 0) {
      setReviewError("Please select a rating");
      return;
    }
    setSubmitting(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      await api.post("/listings/" + id + "/feedback", { rating, message: reviewMessage });
      setReviewSuccess("Review submitted!");
      setRating(0);
      setReviewMessage("");
      setMyReview(null);
      setTimeout(() => setReviewSuccess(""), 3000);
    } catch (e: any) {
      setReviewError(e.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteMyReview() {
    if (!myReview) return;
    if (!confirm("Delete your review?")) return;
    try {
      await api.delete("/feedback/" + myReview.id);
      setMyReview(null);
      setRating(0);
      setReviewMessage("");
      setFeedbacks((prev) => prev.filter((f) => f.id !== myReview.id));
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "var(--error)" }}>{error}</p>;
  if (!listing) return null;

  const stars = (n: number | null) => {
    if (n === null) return "—";
    const full = Math.floor(n);
    const half = n - full >= 0.5;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto" }}>
      <h1>{listing.name}</h1>
      <p style={{ color: "var(--text-secondary)" }}>{listing.city}, {listing.address}</p>
      <p style={{ marginTop: "1rem" }}>{listing.description}</p>

      <h2 style={{ marginTop: "1.5rem" }}>Amenities</h2>
      <ul>{(listing.amenities || []).map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>

      <h2 style={{ marginTop: "1.5rem" }}>Reviews</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-color)" }}>
          {average !== null ? average.toFixed(1) : "—"} / 5
        </div>
        <div>{stars(average)}</div>
        <div style={{ color: "var(--text-secondary)" }}>{count} review{count !== 1 ? "s" : ""}</div>
      </div>

      {fbLoading ? (
        <p>Loading reviews...</p>
      ) : fbError ? (
        <p style={{ color: "var(--error)" }}>{fbError}</p>
      ) : feedbacks.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No reviews yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {feedbacks.map((f: any) => (
            <div key={f.id} className="card" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong>{f.user?.firstName} {f.user?.lastName}</strong>
                <span>{new Date(f.createdAt).toLocaleDateString()}</span>
              </div>
              <div>{"★".repeat(f.rating) + "☆".repeat(5 - f.rating)}</div>
              <p style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>{f.message}</p>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "1.5rem" }}>Rooms</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        {(listing.rooms || []).map((r: any) => (
          <div key={r.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontWeight: 600 }}>{r.name}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Capacity: {r.capacity} · ₱{Number(r.pricePerMonth).toLocaleString()}/mo</p>
              <p>{r.isAvailable ? "Available" : "Unavailable"}</p>
            </div>
            {r.isAvailable && (
              <button className="btn btn-primary" onClick={() => setSelectedRoom(r.id)}>Book a Room</button>
            )}
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <textarea className="input-field" placeholder="Optional message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="btn btn-primary" style={{ marginTop: "0.5rem" }} onClick={() => book(selectedRoom)}>Confirm Booking</button>
        </div>
      )}

      {bookingStatus && <p style={{ marginTop: "1rem" }}>{bookingStatus}</p>}

      {user && (
        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>Your Review</h3>
          {myReview ? (
            <div>
              <p>Your rating: {"★".repeat(myReview.rating) + "☆".repeat(5 - myReview.rating)}</p>
              <p style={{ whiteSpace: "pre-wrap" }}>{myReview.message}</p>
              <button className="btn" onClick={deleteMyReview} style={{ marginTop: "0.5rem", background: "var(--error)", color: "white" }}>Delete Review</button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "2rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: rating >= star ? "gold" : "var(--border-color)",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className="input-field"
                placeholder="Your experience (max 1000 characters)"
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <div style={{ textAlign: "right", marginTop: "0.25rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                {reviewMessage.length}/1000
              </div>
              {reviewError && <p style={{ color: "var(--error)", marginTop: "0.5rem" }}>{reviewError}</p>}
              {reviewSuccess && <p style={{ color: "var(--success)", marginTop: "0.5rem" }}>{reviewSuccess}</p>}
              <button className="btn btn-primary" style={{ marginTop: "0.5rem" }} onClick={submitReview} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="card" style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>Log in to leave a review.</p>
        </div>
      )}

      {bookingStatus && <p style={{ marginTop: "1rem" }}>{bookingStatus}</p>}
    </div>
  );
}
