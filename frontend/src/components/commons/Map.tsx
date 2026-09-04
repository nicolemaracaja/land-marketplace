import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import GeoJSON from "ol/format/GeoJSON";
import Circle from "ol/geom/Circle";
import Polygon from "ol/geom/Polygon";
import Overlay from "ol/Overlay";

import { fromLonLat, toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";

import "ol/ol.css";

import type { PolygonGeometry } from "../../types/geometry";
import type { Land } from "../../types/land";
import landStore from "../../stores/landStore";
import LandDetailsModal from "../land/LandDetailModal";

export type MapMode = "REGISTER" | "SEARCH";

type MapProps = {
  mode?: MapMode;
  onGeometryChange?: (geometry: PolygonGeometry) => void;
  onSearchCircleChange?: (
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ) => void;
};

function MapComponent({
  mode = "REGISTER",
  onGeometryChange,
  onSearchCircleChange,
}: MapProps) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const landSource = useRef<VectorSource | null>(null);
  const drawSource = useRef<VectorSource | null>(null);
  const mapRef = useRef<Map | null>(null);

  const searchActiveRef = useRef(false);
  const popupOverlaysRef = useRef<Overlay[]>([]);

  const [selectedLand, setSelectedLand] = useState<Land | null>(null);

  const navigate = useNavigate();

  const clearPopups = () => {
    popupOverlaysRef.current.forEach((overlay) => {
      mapRef.current?.removeOverlay(overlay);
    });

    popupOverlaysRef.current = [];
  };

  const createPopup = (land: Land, coordinates: number[]) => {
    if (!mapRef.current) {
      return;
    }

    const element = document.createElement("div");

    element.className =
      "min-w-[240px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl";

    const title = document.createElement("h3");
    title.className = "text-sm font-semibold text-slate-900";
    title.textContent = land.name;

    const price = document.createElement("p");
    price.className = "mt-1 text-sm font-semibold text-blue-600";
    price.textContent = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(land.price);

    const description = document.createElement("p");
    description.className = "mt-2 text-xs leading-5 text-slate-500";
    description.textContent = land.description;

    const contact = document.createElement("p");
    contact.className = "mt-2 text-xs text-slate-500";
    contact.textContent = `Contact: ${land.contact}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700";
    button.textContent = "I'm interested";

    button.addEventListener("click", () => {
      navigate(`/app/negotiations?land=${land.id}`);
    });

    element.appendChild(title);
    element.appendChild(price);
    element.appendChild(description);
    element.appendChild(contact);
    element.appendChild(button);

    const overlay = new Overlay({
      element,
      positioning: "bottom-center",
      offset: [0, -10],
      stopEvent: true,
    });

    overlay.setPosition(coordinates);

    mapRef.current.addOverlay(overlay);
    popupOverlaysRef.current.push(overlay);
  };

  const createSearchPopups = () => {
    if (!mapRef.current || !landSource.current) {
      return;
    }

    if (mode !== "SEARCH" || !searchActiveRef.current) {
      return;
    }

    clearPopups();

    landSource.current.getFeatures().forEach((feature) => {
      const landId = feature.get("id");

      if (!landId) {
        return;
      }

      const land = landStore.lands.find(
        (currentLand) => currentLand.id === Number(landId),
      );

      if (!land) {
        return;
      }

      const geometry = feature.getGeometry();

      if (!(geometry instanceof Polygon)) {
        return;
      }

      const point = geometry.getInteriorPoint();

      createPopup(land, point.getCoordinates());
    });
  };

  useEffect(() => {
    if (!mapElement.current) {
      return;
    }

    const landsSource = new VectorSource();
    const currentDrawSource = new VectorSource();

    landSource.current = landsSource;
    drawSource.current = currentDrawSource;

    const landLayer = new VectorLayer({
      source: landsSource,
    });

    const drawLayer = new VectorLayer({
      source: currentDrawSource,
    });

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        landLayer,
        drawLayer,
      ],
      view: new View({
        center: fromLonLat([-40, -8]),
        zoom: 5,
      }),
    });

    mapRef.current = map;

    const draw = new Draw({
      source: currentDrawSource,
      type: mode === "REGISTER" ? "Polygon" : "Circle",
    });

    draw.on("drawstart", () => {
      currentDrawSource.clear();

      if (mode === "SEARCH") {
        searchActiveRef.current = false;
        clearPopups();

        landStore.lands = [];
      }
    });

    draw.on("drawend", (event) => {
      const geometry = event.feature.getGeometry();

      if (!geometry) {
        return;
      }

      if (mode === "REGISTER") {
        if (geometry.getType() !== "Polygon") {
          return;
        }

        const geoJson = new GeoJSON().writeFeatureObject(event.feature, {
          featureProjection: "EPSG:3857",
          dataProjection: "EPSG:4326",
        });

        onGeometryChange?.(geoJson.geometry as PolygonGeometry);

        return;
      }

      if (mode === "SEARCH") {
        if (!(geometry instanceof Circle)) {
          return;
        }

        const center = geometry.getCenter();

        const [longitude, latitude] = toLonLat(center);

        const radius = geometry.getRadius();

        const edgePoint = [center[0] + radius, center[1]];

        const [edgeLongitude, edgeLatitude] = toLonLat(edgePoint);

        const radiusMeters = getDistance(
          [longitude, latitude],
          [edgeLongitude, edgeLatitude],
        );

        searchActiveRef.current = true;

        onSearchCircleChange?.(latitude, longitude, radiusMeters);
      }
    });

    map.addInteraction(draw);

    return () => {
      clearPopups();

      map.removeInteraction(draw);
      map.setTarget(undefined);

      mapRef.current = null;
      landSource.current = null;
      drawSource.current = null;
    };
  }, [mode, onGeometryChange, onSearchCircleChange, navigate]);

  useEffect(() => {
    if (!landSource.current) {
      return;
    }

    const source = landSource.current;

    source.clear();

    if (landStore.lands.length === 0) {
      clearPopups();
      return;
    }

    const features = new GeoJSON().readFeatures(
      {
        type: "FeatureCollection",
        features: landStore.lands.map((land) => ({
          type: "Feature",
          properties: {
            id: land.id,
            name: land.name,
            description: land.description,
            price: land.price,
            contact: land.contact,
          },
          geometry: land.geometry,
        })),
      },
      {
        featureProjection: "EPSG:3857",
        dataProjection: "EPSG:4326",
      },
    );

    source.addFeatures(features);

    if (mode === "SEARCH" && searchActiveRef.current) {
      createSearchPopups();
    }
  }, [landStore.lands, mode]);

  return (
    <>
      <div ref={mapElement} className="h-full w-full" />

      {selectedLand && (
        <LandDetailsModal
          land={selectedLand}
          onClose={() => setSelectedLand(null)}
          onInterest={() =>
            navigate(`/app/negotiations?land=${selectedLand.id}`)
          }
        />
      )}
    </>
  );
}

export default observer(MapComponent);
