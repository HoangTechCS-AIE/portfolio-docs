---
sidebar_position: 1
---

# SmartCity Platform Overview

**Smart Urban Data Platform with Tiered Storage & ML Classification**

## 💡 Problem Statement

Trong các hệ thống IoT đô thị thông minh:
- ❌ **Overload**: Millions of sensor messages làm quá tải hệ thống
- ❌ **Storage inefficiency**: Không phân biệt data quan trọng vs thông thường
- ❌ **Processing bottleneck**: Push-based architecture dễ overwhelm backend

## ✨ Solution

**SmartCity Platform** là nền tảng IoT với kiến trúc tiên tiến:

### 1. ML-Driven Classification 🤖
- **IsolationForest** models phân loại tự động
- 3 tiers: **HOT** (urgent) / **WARM** (important) / **COLD** (normal)
- Real-time anomaly detection

### 2. Tiered Storage Architecture 💾
- **HOT tier**: Redis (in-memory, TTL 1h) cho real-time
- **WARM/COLD tiers**: MongoDB cho persistent storage
- Optimize cost vs performance

### 3. Pull-based Architecture 🔄
- Backend **PULL** từ RabbitMQ edge storage
- Batch processing (5000 msg/lần)
- Resilient - không quá tải khi data spike

## 🎯 Key Features

### 1. Automatic Data Classification
```
Sensor Data → ML Service → HOT/WARM/COLD label
```
- Temperature anomalies → HOT
- Humidity spikes → HOT/WARM
- Normal readings → COLD

### 2. Scalable IoT Ingestion
- Handle **40M+ messages**  
- ~500 messages/second throughput
- Multi-node RabbitMQ for HA

### 3. Intelligent Routing
```
HOT → Redis (fast access)
WARM → MongoDB warm_db
COLD → MongoDB cold_db
```

## 🏗️ System Architecture

```mermaid
graph LR
    subgraph "Data Generation"
        A["Python IoT Simulator"]
    end

    subgraph "Edge Storage"
        B["RabbitMQ Node 1"]
        L["RabbitMQ Node 2"]
    end

    subgraph "Core Processing"
        C["Spring Boot Backend"]
    end

    subgraph "ML Classification"
        D["FastAPI ML Service"]
    end

    subgraph "Tiered Storage"
        E["Redis (HOT)"]
        K["MongoDB (WARM)"]
        F["MongoDB (COLD)"]
    end

    subgraph "Presentation"
        G["Nuxt.js Frontend"]
    end

    A -->|Publish| B
    A -->|Publish| L
    
    B -->|Pull Batch| C
    L -->|Pull Batch| C
    
    C -->|Classify| D
    D -->|HOT/WARM/COLD| C
    
    C -->|HOT| E
    C -->|WARM| K
    C -->|COLD| F
    
    C -->|REST API| G
    
    style D fill:#009688,stroke:#00796b,stroke-width:2px,color:#fff
    style E fill:#DC382D,stroke:#b71c1c,stroke-width:2px,color:#fff
    style K fill:#4DB33D,stroke:#388e3c,stroke-width:2px,color:#fff
    style F fill:#4169E1,stroke:#1e40af,stroke-width:2px,color:#fff
```

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Throughput** | ~500 msg/sec |
| **Batch Size** | 5,000 msg/pull |
| **ML Latency** | &lt;50ms per classification |
| **Scale** | 40M+ messages tested |
| **HOT TTL** | 3600s (1 hour) |

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Spring Boot 3.2 (Java 17) |
| **ML Service** | FastAPI (Python) |
| **Message Queue** | RabbitMQ 3 |
| **Cache** | Redis Alpine |
| **Database** | MongoDB 7.0 (2 instances) |
| **Frontend** | Nuxt.js 3 |
| **Simulator** | Python 3.10 + Faker |

## 🔗 Links

- **GitHub**: [Haui-HIT-H2K/SmartCity-Platform](https://github.com/Haui-HIT-H2K/SmartCity-Platform)
- **Documentation**: [https://Haui-HIT-H2K.github.io/SmartCity-Platform/](https://Haui-HIT-H2K.github.io/SmartCity-Platform/)
- **Next**: [Architecture Details →](./architecture)
