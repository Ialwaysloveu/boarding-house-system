'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const icon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25,41], iconAnchor: [12,41] });

export default function Map({ items }: { items: any[] }) {
  return (
    <MapContainer center={[11.5, 124.4]} zoom={10} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {items.filter(i=>i.latitude && i.longitude).map(i => (
        <Marker key={i.id} position={[i.latitude, i.longitude]} icon={icon}>
          <Popup>
            <Link href={'/listings/'+i.id}>{i.name}</Link>
            <div>₱{Number(i.rooms?.[0]?.pricePerMonth || 0).toLocaleString()}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}