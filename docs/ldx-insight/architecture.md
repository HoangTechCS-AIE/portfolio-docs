---
sidebar_position: 2
---

# System Architecture

## Data Flow Architecture

```mermaid
graph TD
    %% Nguồn
    A["Nguồn Dữ liệu mở (data.gov.vn, opendata.mic.gov.vn)"]
    
    %% Python Service
    B["Python Collector Service"]
    
    %% Platform
    subgraph "Open Linked Hub Platform"
        C["MongoDB Database"]
    end

    %% Backend
    F["Spring Boot Backend (Java 17)"]

    %% Applications
    J["Nuxt.js Dashboard"]
    K["Python ML Service Diagnostic Model"]

    %% Luồng dữ liệu
    A -- "PUSH Raw Data" --> B
    B -- "Normalize & Store" --> C
    
    F -- "Query Data" --> C
    F -- "REST API" --> J
    
    K -- "Get Training Data" --> C
    K -- "Predictions" --> J
    
    style C fill:#47a047,stroke:#2d7a2d,stroke-width:2px,color:#fff
    style F fill:#6db33f,stroke:#5a9c3a,stroke-width:2px,color:#fff
    style K fill:#3776ab,stroke:#285a8f,stroke-width:2px,color:#fff
    style J fill:#00dc82,stroke:#00b268,stroke-width:2px,color:#fff
```

## Component Breakdown

### 1. Python Collector Service

**Purpose**: Tự động thu thập dữ liệu từ các nguồn mở

**Features**:
- HTTP requests đến các API nguồn mở
- Parse và normalize dữ liệu về JSON
- Validate và clean data
- Batch insert vào MongoDB

**Libraries**:
```python
import requests
import pandas as pd
from pymongo import MongoClient
```

**Example Workflow**:
```python
# 1. Fetch data from open data source
response = requests.get("https://data.gov.vn/api/dataset")
raw_data = response.json()

# 2. Normalize to standard format
df = pd.DataFrame(raw_data)
normalized = df.to_dict('records')

# 3. Insert to MongoDB
collection.insert_many(normalized)
```

### 2. MongoDB - Open Linked Hub

**Purpose**: Cơ sở dữ liệu tập trung cho dữ liệu mở

**Collections**:
- `datasets` - Metadata về datasets
- `indicators` - Chỉ số chuyển đổi số
- `provinces` - Dữ liệu địa phương
- `statistics` - Thống kê tổng hợp

**Schema Example**:
```json
{
  "_id": "ObjectId",
  "dataset_name": "Digital Transformation Index 2024",
  "province": "Hanoi",
  "indicators": {
    "infrastructure": 8.5,
    "services": 7.2,
    "governance": 6.8
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 3. Spring Boot Backend

**Purpose**: Core API layer cung cấp dữ liệu cho frontend

**Architecture**: 3-layer architecture
```
Controllers (REST endpoints)
    ↓
Services (Business logic)
    ↓
Repositories (Data access)
    ↓
MongoDB
```

**Key Technologies**:
- Spring Boot 3
- Spring Security (Authentication)
- Spring Data MongoDB
- MapStruct (DTO mapping)

**RESTful API Endpoints**:
```
GET  /api/datasets              # List all datasets
GET  /api/datasets/{id}         # Get dataset details
GET  /api/indicators            # Get indicators
POST /api/search                # Search datasets
GET  /api/provinces/{id}/stats  # Provincial statistics
```

### 4. Nuxt.js Frontend

**Purpose**: Dashboard hiển thị dữ liệu và visualizations

**Features**:
- Server-side rendering (SSR)
- Vue 3 Composition API
- Chart.js / ApexCharts for visualizations
- Responsive design

**Pages**:
- `/` - Homepage overview
- `/datasets` - Dataset explorer
- `/dashboard` - Analytics dashboard
- `/compare` - Compare provinces

### 5. ML Diagnostic Service

**Purpose**: Phân tích và chẩn đoán chỉ số chuyển đổi số

**ML Models**:
- Regression models for scoring
- Classification for digital maturity levels
- Clustering for province grouping

**API Endpoints**:
```python
@app.post("/diagnose")
def diagnose(indicators: Dict[str, float]):
    """
    Chẩn đoán mức độ chuyển đổi số
    
    Input: {"infrastructure": 8.5, "services": 7.2, ...}
    Output: {"score": 7.5, "level": "Good", "recommendations": [...]}
    """
    score = model.predict([indicators])
    return {"score": score, "level": get_level(score)}
```

## Sequence Diagram: Data Collection

```mermaid
sequenceDiagram
    autonumber
    participant SRC as Open Data Source
    participant COL as Python Collector
    participant DB as MongoDB
    participant BE as Spring Boot Backend
    participant FE as Nuxt.js Frontend
    
    Note over COL: Scheduled job (cron)
    COL->>SRC: HTTP GET /api/datasets
    SRC-->>COL: JSON raw data
    
    COL->>COL: Normalize & Validate
    COL->>DB: Insert documents
    DB-->>COL: Acknowledgment
    
    Note over FE: User visits dashboard
    FE->>BE: GET /api/datasets
    BE->>DB: Query datasets
    DB-->>BE: Results
    BE-->>FE: JSON response
    FE->>FE: Render charts
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Docker Compose"
        NGINX[Nginx Reverse Proxy Port 80]
        FE[Nuxt.js SSR Server Port 3000]
        BE[Spring Boot API Port 8080]
        ML[ML Service FastAPI Port 5000]
        DB[(MongoDB Port 27017)]
    end
    
    USER[User Browser] --> NGINX
    NGINX --> FE
    FE --> BE
    BE --> DB
    FE --> ML
    ML --> DB
    
    PY[Python Collector] --> DB
    
    style DB fill:#47a047,color:#fff
    style BE fill:#6db33f,color:#fff
    style ML fill:#3776ab,color:#fff
    style FE fill:#00dc82,color:#fff
```

## Technology Integration

### Spring Boot + MongoDB

**Configuration**:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/ldx_insight
      database: ldx_insight
```

**Repository Example**:
```java
@Repository
public interface DatasetRepository extends MongoRepository<Dataset, String> {
    List<Dataset> findByProvince(String province);
    List<Dataset> findByTimestampAfter(Date date);
}
```

### Nuxt.js + REST API

**API Client**:
```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig()
  
  const fetchDatasets = async () => {
    const { data } = await useFetch(`${config.public.apiUrl}/api/datasets`)
    return data.value
  }
  
  return { fetchDatasets }
}
```

## Security

### Authentication & Authorization

- Spring Security JWT tokens
- Role-based access control (RBAC)
- API key for ML service

**Security Flow**:
```mermaid
sequenceDiagram
    User->>Backend: POST /login {username, password}
    Backend->>Backend: Validate credentials
    Backend-->>User: JWT token
    
    User->>Backend: GET /api/datasets (with JWT header)
    Backend->>Backend: Validate JWT
    Backend-->>User: Protected data
```

## Next Steps

- [Technology Stack Details →](./tech-stack)
- [Features Overview →](./features)
