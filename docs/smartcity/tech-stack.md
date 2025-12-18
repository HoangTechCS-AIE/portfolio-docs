---
sidebar_position: 4
---

# Technology Stack

## Core Technologies

### Backend - Spring Boot 3.2

**Java Version**: 17  
**Framework**: Spring Boot 3.2

**Key Dependencies**:
- Spring Boot Starter Web
- Spring Boot Starter Data MongoDB (Multi-datasource)
- Spring Boot Starter Data Redis
- Spring AMQP (RabbitMQ client)
- Lombok

**Multi-Datasource Configuration**:
```java
@Configuration
public class MongoConfig {
    @Bean
    @ConfigurationProperties(prefix = "spring.data.mongodb.warm")
    public MongoProperties warmMongoProperties() {
        return new MongoProperties();
    }
    
    @Bean
    @ConfigurationProperties(prefix = "spring.data.mongodb.cold")
    public MongoProperties coldMongoProperties() {
        return new MongoProperties();
    }
}
```

### ML Service - FastAPI

**Python Version**: 3.10  
**Framework**: FastAPI

**Dependencies**:
```txt
fastapi==0.100.0
uvicorn==0.23.0
scikit-learn==1.3.0
joblib==1.3.2
pydantic==2.0.0
```

**Models**: IsolationForest (scikit-learn)

### Message Queue - RabbitMQ 3

**Deployment**: 2 Docker containers (HA cluster)  
**Protocol**: AMQP  
**Ports**: 5672, 5673, 15672, 15673

**Configuration**:
```yaml
rabbitmq-1:
  image: rabbitmq:3-management
  environment:
    - RABBITMQ_DEFAULT_USER=edge_user
    - RABBITMQ_DEFAULT_PASS=edge_pass
  ports:
    - "5672:5672"
    - "15672:15672"
```

### Cache - Redis Alpine

**Version**: Alpine (lightweight)  
**Use Case**: HOT tier in-memory storage  
**TTL**: 3600 seconds (1 hour)

**Spring Boot Integration**:
```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory());
        return template;
    }
}
```

### Database - MongoDB 7.0

**Deployment**: 2 instances (WARM + COLD)  
**Ports**: 27018 (warm), 27019 (cold)

**application.yml**:
```yaml
spring:
  data:
    mongodb:
      warm:
        uri: mongodb://admin:password123@localhost:27018/warm_db
      cold:
        uri: mongodb://admin:password123@localhost:27019/cold_db
```

### Frontend - Nuxt.js 3

**Framework**: Nuxt 3 (Vue 3)  
**Features**:
- Real-time dashboard
- Data explorer with pagination
- Chart visualization

### Data Simulator - Python 3.10

**Libraries**:
- Faker (generate realistic data)
- pika (RabbitMQ client)
- concurrent.futures (multithreading)

**Configuration**:
```python
TOTAL_REQUESTS = 40_000_000
NUM_THREADS = 20
NUM_SENSORS = 1000
```

## Project Structure

```
SmartCity-Platform/
├── backend/                 # Spring Boot
│   ├── src/main/java/com/smartcity/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   └── service/
│   ├── Dockerfile
│   └── pom.xml
│
├── ml-service/             # FastAPI ML
│   ├── app/
│   │   ├── models/         # .pkl files
│   │   └── main.py
│   ├── train_models.py
│   ├── entrypoint.sh
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/               # Nuxt.js
│   ├── pages/
│   ├── components/
│   ├── nuxt.config.ts
│   └── package.json
│
├── python-data-simulator/  # IoT simulator
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
│
└── docker-compose.yml
```

## Docker Compose Services

```yaml
version: '3.8'

services:
  # Edge Storage (2 nodes)
  edge-rabbitmq-1:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
    
  edge-rabbitmq-2:
    image: rabbitmq:3-management
    ports: ["5673:5672", "15673:15672"]
  
  # Storage Tiers
  core-redis-hot:
    image: redis:alpine
    ports: ["6379:6379"]
    
  core-mongo-warm:
    image: mongo:7.0
    ports: ["27018:27017"]
    volumes: ["./data/warm:/data/db"]
    
  core-mongo-cold:
    image: mongo:7.0
    ports: ["27019:27017"]
    volumes: ["./data/cold:/data/db"]
  
  # Application Services
  smart-city-backend:
    build: ./backend
    ports: ["8080:8080"]
    depends_on: [core-redis-hot, core-mongo-warm, core-mongo-cold]
    
  smart-city-ml:
    build: ./ml-service
    ports: ["8000:8000"]
    
  smart-city-frontend:
    build: ./frontend
    ports: ["3000:3000"]
```

## Development Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker logs smart-city-backend --follow
docker logs smart-city-ml --follow

# Check ML service health
curl http://localhost:8000/health

# Start IoT simulator
cd python-data-simulator
python main.py
```

## Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8080 |
| **ML Service Docs** | http://localhost:8000/docs |
| **RabbitMQ UI (Node 1)** | http://localhost:15672 |
| **RabbitMQ UI (Node 2)** | http://localhost:15673 |

## External Links

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [RabbitMQ Docs](https://www.rabbitmq.com/documentation.html)
- [Redis Docs](https://redis.io/docs/)
- [scikit-learn IsolationForest](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)
