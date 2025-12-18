---
sidebar_position: 2
---

# System Architecture

## Pull-based Architecture

```mermaid
sequenceDiagram
    autonumber
    participant SIM as IoT Simulator
    participant RMQ as RabbitMQ
    participant BE as Spring Boot Backend
    participant ML as ML Service
    participant REDIS as Redis (HOT)
    participant MONGO as MongoDB (WARM/COLD)
    
    Note over SIM: Generate sensor data
    SIM->>RMQ: Publish messages
    
    Note over BE: Scheduled pull (every 10s)
    BE->>RMQ: Pull batch (5000 msg)
    RMQ-->>BE: Message batch
    
    loop For each message
        BE->>ML: POST /predict {sensor_data}
        ML-->>BE: {label: "HOT/WARM/COLD"}
    end
    
    BE->>REDIS: Store HOT records (TTL 1h)
    BE->>MONGO: Bulk insert WARM records
    BE->>MONGO: Bulk insert COLD records
```

## Component Architecture

### 1. Data Generation Layer

**Python IoT Simulator**:
```python
# Simulate Temperature sensor
def generate_temperature():
    if random() < 0.35:  # 35% anomalies
        return uniform(40, 50)  # HOT anomaly
    else:
        return uniform(15, 35)  # Normal range
```

**Configuration**:
- 40M total messages
- 1000 simulated sensors
- 20 concurrent threads
- Random distribution

### 2. Edge Storage Layer

**RabbitMQ Clustering**:
- 2 nodes for high availability
- Queue: `smart_city_queue`
- Durable messages
- Ports: 5672, 5673 (AMQP), 15672, 15673 (Management UI)

**Benefits of Pull**:
- ✅ No backend overload during spikes
- ✅ Controlled batch processing
- ✅ Resilient if one node fails

### 3. Core Processing Layer

**Spring Boot Backend**:

**Scheduled Pull**:
```java
@Scheduled(fixedRate = 10000) // Every 10 seconds
public void pullMessages() {
    List<Message> batch = rabbitTemplate.receive(5000);
    
    // Classify with ML
    List<ClassifiedData> classified = mlService.classifyBatch(batch);
    
    // Route to appropriate storage
    routeToTieredStorage(classified);
}
```

**Tiered Routing Logic**:
```java
void routeToTieredStorage(List<ClassifiedData> data) {
    List<Data> hotData = filterByLabel(data, "HOT");
    List<Data> warmData = filterByLabel(data, "WARM");
    List<Data> coldData = filterByLabel(data, "COLD");
    
    redisTemplate.opsForValue().set(hotData);  // TTL 3600s
    warmMongoTemplate.insertAll(warmData);
    coldMongoTemplate.insertAll(coldData);
}
```

### 4. ML Classification Layer

**FastAPI ML Service**:

**IsolationForest Models**:
- `temperature_model.pkl` (1.5 MB)
- `humidity_model.pkl` (1.59 MB)
- `co2_model.pkl` (1.9 MB)

**Prediction Endpoint**:
```python
@app.post("/predict")
def predict(data: SensorData):
    metric_type = data.metric_type
    value = data.value
    
    # Load appropriate model
    model = models[metric_type]
    
    # Predict anomaly (-1 = anomaly, 1 = normal)
    prediction = model.predict([[value]])[0]
    
    if prediction == -1:
        return {"label": "HOT", "uri": "https://schema.org/Warning"}
    else:
        return {"label": "COLD", "uri": "https://schema.org/Normal"}
```

### 5. Tiered Storage Layer

```mermaid
graph TB
    subgraph "Storage Tiers"
        subgraph "HOT - Redis"
            R1[In-Memory Cache]
            R2[TTL: 3600s]
            R3[Fast Read <1ms]
        end
        
        subgraph "WARM - MongoDB"
            W1[Important Data]
            W2[Indexed]
            W3[7-day retention]
        end
        
        subgraph "COLD - MongoDB"
            C1[Normal Data]
            C2[Compressed]
            C3[Long-term storage]
        end
    end
    
    ROUTE[Classification Router] --> R1
    ROUTE --> W1
    ROUTE --> C1
    
    style R1 fill:#DC382D,color:#fff
    style W1 fill:#4DB33D,color:#fff
    style C1 fill:#4169E1,color:#fff
```

**Redis Configuration**:
```yaml
redis:
  host: localhost
  port: 6379
  ttl: 3600  # 1 hour
```

**MongoDB Multi-Datasource**:
```yaml
spring:
  data:
    mongodb:
      warm:
        uri: mongodb://localhost:27018/warm_db
      cold:
        uri: mongodb://localhost:27019/cold_db
```

## Data Flow Visualization

```mermaid
flowchart LR
    A[Sensor Data] --> B{ML Classification}
    
    B -->|35% Anomaly| C[HOT Label]
    B -->|0%| D[WARM Label]
    B -->|65% Normal| E[COLD Label]
    
    C --> F[Redis Fast Access TTL 1h]
    D --> G[MongoDB warm_db Indexed 7-day retention]
    E --> H[MongoDB cold_db Compressed Long-term]
    
    style C fill:#ff6b6b,color:#fff
    style F fill:#DC382D,color:#fff
    style G fill:#4DB33D,color:#fff
    style H fill:#4169E1,color:#fff
```

## Deployment Architecture

**Docker Compose Services**:
1. `edge-rabbitmq-1`, `edge-rabbitmq-2` - Message queues
2. `core-redis-hot` - HOT tier cache
3. `core-mongo-warm` - WARM tier database
4. `core-mongo-cold` - COLD tier database  
5. `smart-city-backend` - Spring Boot API
6. `smart-city-ml` - ML classification service
7. `smart-city-frontend` - Nuxt.js dashboard

**Port Mapping**:
```
3000  - Frontend
5672/5673  - RabbitMQ AMQP
6379  - Redis
8000  - ML Service
8080  - Backend API
15672/15673 - RabbitMQ UI
27018/27019 - MongoDB instances
```

## Next Steps

- [ML Classification Deep Dive →](./ml-classification)
- [Technology Stack →](./tech-stack)
