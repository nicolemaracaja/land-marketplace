package com.example.demo.repositories;

import java.util.List;

import com.example.demo.models.entities.User;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.models.entities.Land;

@Repository
public interface LandRepository extends JpaRepository<Land, Long> {
    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM lands l
                WHERE ST_Intersects(l.geometry, :geometry)
                AND (:excludeId IS NULL OR l.id <> :excludeId)
            )
            """, nativeQuery = true)
    boolean existsOverlapping(
            @Param("geometry") Polygon geometry,
            @Param("excludeId") Long excludeId
    );

    default boolean existsOverlapping(Polygon geometry) {
        return existsOverlapping(geometry, null);
    }

    @Query(value = """
            SELECT *
            FROM lands l
            WHERE ST_Intersects(
                l.geometry,
                ST_Buffer(
                    ST_SetSRID(
                        ST_MakePoint(:longitude, :latitude),
                        4326
                    )::geography,
                    :radiusMeters
                )::geometry
            )
            """, nativeQuery = true)
    List<Land> findWithinCircle(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radiusMeters") double radiusMeters
    );

    List<Land> findByOwner(User owner);
}
