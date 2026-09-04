package com.example.demo.mapper;

import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Component;
import org.wololo.geojson.GeoJSON;
import org.wololo.jts2geojson.GeoJSONReader;
import org.wololo.jts2geojson.GeoJSONWriter;

import com.example.demo.dtos.land.LandRequest;
import com.example.demo.dtos.land.LandResponse;
import com.example.demo.exceptions.InvalidGeometryException;
import com.example.demo.models.entities.Land;

@Component
public class LandMapper {

    private static final int WGS84_SRID = 4326;

    private final GeoJSONReader geoJsonReader = new GeoJSONReader();
    private final GeoJSONWriter geoJsonWriter = new GeoJSONWriter();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Polygon toPolygon(Map<String, Object> geoJson) {

        try {
            String json = objectMapper.writeValueAsString(geoJson);

            Geometry geometry = geoJsonReader.read(json);
            geometry.setSRID(WGS84_SRID);

            if (!(geometry instanceof Polygon polygon)) {
                throw new InvalidGeometryException(
                        "Geometry must be a GeoJSON Polygon");
            }

            if (!polygon.isValid() || polygon.isEmpty()) {
                throw new InvalidGeometryException(
                        "Geometry is not a valid polygon");
            }

            return polygon;

        } catch (InvalidGeometryException exception) {
            throw exception;

        } catch (Exception exception) {
            throw new InvalidGeometryException(
                    "Could not parse geometry as GeoJSON Polygon",
                    exception);
        }
    }

    public Map<String, Object> toGeoJsonMap(Geometry geometry) {
        GeoJSON geoJson = geoJsonWriter.write(geometry);

        try {
            return objectMapper.readValue(
                    geoJson.toString(),
                    new TypeReference<Map<String, Object>>() {
                    });
        } catch (Exception exception) {
            throw new InvalidGeometryException(
                    "Could not convert geometry to GeoJSON",
                    exception);
        }
    }

    public Land toEntity(LandRequest request) {

        Land land = new Land();
        land.setName(request.name());
        land.setDescription(request.description());
        land.setPrice(request.price());
        land.setContact(request.contact());
        land.setGeometry(toPolygon(request.geometry()));
        return land;
    }

    public LandResponse toResponse(Land land) {

        return new LandResponse(
                land.getId(),
                land.getName(),
                land.getDescription(),
                land.getPrice(),
                land.getContact(),
                toGeoJsonMap(land.getGeometry()));
    }
}