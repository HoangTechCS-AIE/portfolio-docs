---
sidebar_position: 3
---

# Technology Stack

## Core Technologies

### Backend - Spring Boot 3

**Framework**: Spring Boot 3.2 (Java 17)

**Key Dependencies**:
- Spring Boot Starter Web
- Spring Boot Starter Data Mongolia
- Spring Security
- MapStruct (DTO mapping)
- Lombok (boilerplate reduction)

**pom.xml**:
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
</dependencies>
```

### Frontend - Nuxt.js 3

**Framework**: Nuxt 3 (Vue.js 3)

**Key Features**:
- Server-side rendering (SSR)
- Composition API
- Auto-imports
- File-based routing

**package.json**:
```json
{
  "dependencies": {
    "nuxt": "^3.0.0",
    "vue": "^3.3.0"
  }
}
```

### Database - MongoDB

**Version**: 7.0  
**Deployment**: Docker container

**Collections**:
- datasets
- indicators
- provinces
- users

### ML Service - Python

**Framework**: FastAPI or Flask  
**Libraries**: scikit-learn, pandas, numpy

## Project Structure

### Backend (Spring Boot)

```
ldx-insight-backend/
├── src/main/java/com/ldxinsight/
│   ├── config/           # Configuration classes
│   ├── controller/       # REST controllers
│   ├── service/          # Business logic
│   ├── repository/       # MongoDB repositories
│   ├── model/            # Domain models
│   ├── dto/              # Data Transfer Objects
│   └── security/         # Security config
└── pom.xml
```

### Frontend (Nuxt.js)

```
frontend/
├── pages/                # Route pages
├── components/           # Vue components
├── composables/          # Composition utilities
├── layouts/              # Layout templates
├── plugins/              # Nuxt plugins
└── nuxt.config.ts
```

## API Documentation

**Swagger UI**: http://api.haui-hit-h2k.site/swagger-ui.html

## Development

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm run dev

# MongoDB (Docker)
docker-compose up -d mongodb
```

## External Links

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Nuxt.js Docs](https://nuxt.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
