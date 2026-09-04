# Land Marketplace

A full-stack web application for buying and selling land through an interactive map.

The system allows users to register land properties by drawing their boundaries on a map, search for lands within a geographic area, view property information, and make offers.

## Features

- User registration and authentication
- Land registration using map-drawn polygons
- Polygon overlap validation using PostGIS
- Geographic land search using a map-drawn circle
- Land details visualization
- Land ownership management
- Offer and negotiation workflow
- Accept, reject, and cancel negotiations
- My Lands management and status filtering

## 1. How the System Works

The application is divided into three main components:

* **Frontend:** React + TypeScript + OpenLayers
* **Backend:** Java + Spring Boot
* **Database:** PostgreSQL + PostGIS

The frontend communicates with the backend through a REST API. The backend is responsible for business rules, authentication, authorization, and database operations. PostgreSQL with PostGIS is responsible for storing and processing geographic data.

### Main flow

```text
User
  ↓
React + OpenLayers
  ↓
REST API
  ↓
Spring Boot
  ↓
PostgreSQL + PostGIS
```

### Land registration

The user draws a polygon representing the land on the map. The frontend converts the geometry to GeoJSON and sends it to the backend.

Before saving the property, the backend uses PostGIS `ST_Intersects` to verify whether the new polygon overlaps an existing property.

If an overlap is detected, the registration is rejected.

### Land search

The user draws a circle on the map to define a search area. The frontend sends the latitude, longitude, and radius to the backend.

The backend uses PostGIS spatial functions to find properties that intersect the selected area.

### Negotiations

Authenticated users can make offers for properties. Land owners can accept or reject received offers, while buyers can cancel pending offers.

---

## 2. Technology and Architecture

### Frontend

* React
* TypeScript
* Vite
* React Router
* MobX
* Axios
* OpenLayers
* Tailwind CSS

The frontend is organized into pages, components, services, stores, and types.

### Backend

* Java 17
* Spring Boot
* Spring Data JPA
* Spring Security
* JWT
* JTS
* Maven

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Database

* PostgreSQL
* PostGIS
* Liquibase

Land geometries are stored as:

```text
geometry(Polygon, 4326)
```

PostGIS is used for spatial operations such as polygon intersection and geographic searches.

### Authentication

As an additional feature, the system implements:

- User registration
- Login
- JWT-based authentication
- JWT stored in HttpOnly cookies
- Protected routes
- Land ownership
- Authorization for land and negotiation operations

---

## 3. Running with Docker

### Requirements

* Docker
* Docker Compose

From the project root, run:

```bash
docker compose up --build
```

Or run in the background:

```bash
docker compose up -d --build
```

The application will be available at:

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8080 |
| Database | localhost:5432        |

To stop the application:

```bash
docker compose down
```

---

## 4. Running Without Docker

### Database

Install PostgreSQL with PostGIS and create a database named:

```text
land_marketplace
```

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/land_marketplace
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### Backend

From the `backend` directory:

```bash
./mvnw spring-boot:run
```

The API will run at:

```text
http://localhost:8080
```

### Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

---

## 5. Testing and Code Coverage

### Backend

Run the tests:

```bash
cd backend
./mvnw test
```

Generate the JaCoCo coverage report:

```bash
./mvnw test jacoco:report
```

The report will be available at:

```text
backend/target/site/jacoco/index.html
```

### Frontend

From the `frontend` directory:

```bash
npm test
```

The frontend test coverage is generated using the configured JavaScript testing and coverage tools.

The submitted project must demonstrate **more than 80% code coverage**, as required by the challenge.

---

## Project Structure

```text
land-marketplace/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## AI Usage

AI tools such as ChatGPT were used as development assistance for research, debugging, implementation suggestions, and documentation.

All final architectural, design, and implementation decisions are the responsibility of the developer and can be explained and justified during a technical evaluation.
