"use client";

import { Map, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";

interface PropertyMapProps {
  coordinates: [number, number];
  label: string;
}

export default function PropertyMap({ coordinates, label }: PropertyMapProps) {
  const [lng, lat] = coordinates;

  return (
    <div className="rounded-2xl overflow-hidden h-[300px] sm:h-[380px] lg:h-[420px] w-full">
      <Map center={coordinates} zoom={15} theme="dark">
        <MapMarker longitude={lng} latitude={lat}>
          <MarkerContent>
            <div className="bg-brand-accent size-4 rounded-full border-2 border-white shadow-lg" />
          </MarkerContent>
          <MarkerTooltip>{label}</MarkerTooltip>
        </MapMarker>
      </Map>
    </div>
  );
}
