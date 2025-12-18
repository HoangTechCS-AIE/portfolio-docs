---
sidebar_position: 3
---

# AI Components Deep Dive

## CLIP Model - Core AI Technology

### What is CLIP?

**CLIP** (Contrastive Language-Image Pre-training) is a multimodal AI model developed by OpenAI that understands both images and text in a shared embedding space.

```mermaid
graph LR
    subgraph "CLIP Architecture"
        INPUT_IMG[Input Image] --> IMG_ENC[Image Encoder Vision Transformer]
        INPUT_TXT[Input Text] --> TXT_ENC[Text Encoder Transformer]
        
        IMG_ENC --> PROJ_IMG[Projection]
        TXT_ENC --> PROJ_TXT[Projection]
        
        PROJ_IMG --> EMB_SPACE[Shared Embedding Space 512 dimensions]
        PROJ_TXT --> EMB_SPACE
        
        EMB_SPACE --> SIM[Cosine Similarity]
    end
    
    style EMB_SPACE fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style SIM fill:#4dabf7,stroke:#1971c2,stroke-width:2px,color:#fff
```

### Why CLIP?

✅ **Multimodal**: Hiểu cả hình ảnh và văn bản  
✅ **Zero-shot learning**: Không cần training lại  
✅ **Semantic understanding**: Hiểu ngữ nghĩa, không chỉ pixel  
✅ **Pre-trained**: Trained trên 400M image-text pairs  

### Technical Specifications

| Property | Value |
|----------|-------|
| **Model** | `sentence-transformers/clip-ViT-B-32` |
| **Embedding Dimension** | 512 |
| **Input** | Images (RGB) + Text |
| **Output** | 512-dim vectors |
| **Device** | GPU (CUDA) / CPU fallback |

## Indexing Pipeline

### Flow Diagram

```mermaid
flowchart TD
    START([Start Indexing]) --> MODE{Chọn Mode}
    
    MODE -->|Fresh Mode| DISCOVER[Discover Keyframes Quét thư mục]
    MODE -->|Precomputed Mode| LOAD[Load Embeddings Từ file]
    
    DISCOVER --> FILTER[Apply Filter]
    FILTER --> METADATA[Create Metadata]
    
    METADATA --> BATCH[Batch Processing 32 images/batch]
    BATCH --> IMG_LOAD[Load Images PIL Image.open]
    
    IMG_LOAD --> CLIP_ENCODE[CLIP Encoding SentenceTransformer.encode]
    CLIP_ENCODE --> EMBEDDINGS[Embeddings 512-dim numpy arrays]
    
    LOAD --> EMBEDDINGS
    
    EMBEDDINGS --> SETUP[Setup Qdrant Collection]
    SETUP --> UPLOAD[Upload to Qdrant Points with vectors + metadata]
    
    UPLOAD --> SUCCESS{Success?}
    SUCCESS -->|Yes| COMPLETE([✅ Indexing Complete])
    SUCCESS -->|No| ERROR([❌ Failed])
    
    style CLIP_ENCODE fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style EMBEDDINGS fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style UPLOAD fill:#4dabf7,stroke:#1971c2,stroke-width:3px,color:#fff
```

### Code Implementation

**Generate Embeddings**:
```python
def generate_batch_embeddings(self, image_paths: List[str]) -> List[np.ndarray]:
    batch_size = 32
    embeddings = []
    
    for i in range(0, len(image_paths), batch_size):
        batch_paths = image_paths[i:i + batch_size]
        batch_images = [Image.open(path).convert('RGB') for path in batch_paths]
        
        # CLIP encoding
        batch_embeddings = self.model.encode(batch_images, convert_to_numpy=True)
        embeddings.extend(batch_embeddings)
    
    return embeddings
```

**Performance Optimization**:
- Batch processing: 32 images at once
- GPU acceleration: ~100 images/sec
- Error handling: Zero vectors for corrupted images
- Progress tracking: tqdm progress bars

## Retrieval Pipeline

### Flow Diagram

```mermaid
flowchart TD
    START([User Query]) --> API[API Request POST /qa/query]
    
    API --> VALIDATE[Validate Input]
    VALIDATE --> TEXT_EMBED[Generate Text Embedding CLIP encode]
    
    TEXT_EMBED --> QUERY_VEC[Query Vector 512-dim]
    QUERY_VEC --> CLEAN[Clean Filters]
    
    CLEAN --> QDRANT[Qdrant Search Cosine Similarity]
    QDRANT --> RESULTS[Results with Scores]
    
    RESULTS --> EXTRACT[Extract Info video_id, frame_idx]
    EXTRACT --> FORMAT[Format Response]
    
    FORMAT --> OPTIONAL{Save CSV?}
    OPTIONAL -->|Yes| CSV[Save to CSV]
    OPTIONAL -->|No| RESPONSE
    CSV --> RESPONSE[JSON Response]
    
    RESPONSE --> END([End])
    
    style TEXT_EMBED fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style QUERY_VEC fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
    style QDRANT fill:#4dabf7,stroke:#1971c2,stroke-width:3px,color:#fff
```

### Code Implementation

**Search Similar Vectors**:
```python
def search_similar(self, query_embedding: np.ndarray, limit: int = 10):
    search_results = self.qdrant_client.search(
        collection_name="video_keyframes",
        query_vector=query_embedding,
        limit=limit,
        score_threshold=0.7  # Minimum similarity
    )
    
    results = []
    for result in search_results:
        results.append({
            "score": result.score,
            "payload": result.payload
        })
    
    return results
```

## Vector Database (Qdrant)

### Why Vector Database?

Traditional DB:
```sql
SELECT * FROM videos WHERE title LIKE '%dog%'
```
❌ Can't understand semantics

Vector DB:
```python
search(query_vector=[0.23, -0.45, ...], top_k=10)
```
✅ Finds semantically similar content

### HNSW Algorithm

**HNSW** (Hierarchical Navigable Small World):
- Graph-based ANN (Approximate Nearest Neighbor)
- Multi-layer structure
- Search complexity: O(log N)
- Trade-off: 99% accuracy with 100x speed

### Data Structure

```mermaid
graph LR
    subgraph "Qdrant Point"
        ID[Point ID UUID]
        VEC[Vector 512 floats]
        PAY[Payload JSON metadata]
    end
    
    ID --> POINT[Point Object]
    VEC --> POINT
    PAY --> POINT
    
    POINT --> COLL[(Collection video_keyframes)]
    
    style VEC fill:#ff6b6b,color:#fff
    style COLL fill:#4dabf7,color:#fff
```

**Example Payload**:
```json
{
  "keyframe_path": "/path/to/L30_V083/052.jpg",
  "frame_idx": 52,
  "video_id": "L30_V083"
}
```

## Sequence Diagram: End-to-End Query

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant API as Retrieval API
    participant CLIP as CLIP Model
    participant Q as Qdrant
    
    U->>API: POST /qa/query {"query": "dog running"}
    activate API
    
    API->>CLIP: encode("dog running")
    activate CLIP
    CLIP-->>API: vector [0.23, -0.45, ...]
    deactivate CLIP
    
    API->>Q: search_similar(vector, top_k=10)
    activate Q
    Q-->>API: results with scores
    deactivate Q
    
    API->>API: extract video_id & frame_idx
    API-->>U: JSON [{"video_id": "L30_V083", "frame_idx": 52, "score": 0.87}]
    deactivate API
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| **Indexing Speed** | ~100 images/sec (GPU) |
| **Search Latency** | &lt;100ms |
| **Accuracy** | Top-10 recall ~85% |
| **Embedding Dimension** | 512 |
| **Batch Size** | 32 images |

## Next Steps

- [Technology Stack Details →](./tech-stack)
