"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapEvents({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({ click: onClick });
  return null;
}

export default function MapPicker({ lat, lng, onChange }: { lat: number | null; lng: number | null; onChange: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number]>(lat && lng ? [lat, lng] : [11.5, 124.4]);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      setPosition([lat, lng]);
    }
  }, [lat, lng]);

  function handleMapClick(e: any) {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    onChange(lat, lng);
  }

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: "200px", width: "100%", borderRadius: "8px" }} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={icon} />
      <MapEvents onClick={handleMapClick} />
    </MapContainer>
  );
}