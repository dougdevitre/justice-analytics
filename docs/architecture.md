# Justice Analytics -- Architecture

## System Overview

Data flows from court records and census sources through an ETL pipeline into the analytics engine, which runs bias detection, outcome analysis, and disparity calculations. Results are rendered on dashboards and exported as reports -- all behind a privacy layer.

```mermaid
graph TD
    subgraph "Data Sources"
        CR["Court Records"]
        CEN["Census / ACS Data"]
        CO["Case Outcome Feeds"]
        INT["Internal Event Bus"]
    end

    subgraph "ETL Pipeline"
        EX["Extractor<br/>(connectors per source)"]
        TR["Transformer<br/>(normalize, clean, link)"]
        PL["Privacy Layer<br/>(k-anonymity, differential privacy)"]
        LD["Loader<br/>(analytics warehouse)"]
    end

    subgraph "Analytics Engine"
        BD["Bias Detector"]
        OA["Outcome Analyzer"]
        DC["Disparity Calculator"]
        RP["Risk Predictor"]
    end

    subgraph "Presentation"
        DB["Dashboard Renderer"]
        CH["Charts & Graphs"]
        MP["Geographic Maps"]
        AL["Alert System"]
    end

    subgraph "Export"
        PDF["PDF Reports"]
        API["API Endpoints"]
        CSV["CSV Downloads"]
    end

    CR --> EX
    CEN --> EX
    CO --> EX
    INT --> EX
    EX --> TR
    TR --> PL
    PL --> LD
    LD --> BD
    LD --> OA
    LD --> DC
    LD --> RP
    BD --> DB
    OA --> DB
    DC --> DB
    RP --> AL
    DB --> CH
    DB --> MP
    CH --> PDF
    MP --> PDF
    AL --> API
    DB --> CSV
```

## ETL Pipeline Detail

```mermaid
sequenceDiagram
    participant S as Source System
    participant E as Extractor
    participant T as Transformer
    participant P as Privacy Layer
    participant W as Warehouse

    S->>E: Raw records (jurisdiction-specific format)
    E->>T: Extracted records (common schema)
    T->>T: Normalize fields, link demographics
    T->>P: Cleaned records
    P->>P: Apply k-anonymity (suppress small groups)
    P->>P: Add differential privacy noise
    P->>W: Privacy-safe records
```

## Analytics Engine -- Component Interaction

```mermaid
graph LR
    subgraph "Bias Detector"
        REG["Regression Analysis"]
        PSM["Propensity Score Matching"]
        SIG["Significance Testing"]
    end

    subgraph "Outcome Analyzer"
        BRK["Demographic Breakdowns"]
        CMP["Cross-Jurisdiction Comparison"]
        TRD["Trend Analysis"]
    end

    subgraph "Disparity Calculator"
        IDX["Disparity Index"]
        GEO["Geographic Clustering"]
    end

    subgraph "Risk Predictor"
        RF["Risk Factor Scoring"]
        EW["Early Warning Flags"]
    end

    REG --> SIG
    PSM --> SIG
    BRK --> CMP
    CMP --> TRD
    IDX --> GEO
    RF --> EW
```

## Privacy Layer Architecture

All data passes through privacy controls before it enters the analytics warehouse. Small demographic groups are suppressed and statistical noise is added to prevent re-identification.

```mermaid
graph TD
    RAW["Raw Records"]
    KA["k-Anonymity Filter<br/>(suppress groups < k)"]
    DP["Differential Privacy<br/>(add calibrated noise)"]
    AGG["Aggregation Rules<br/>(min cell size = 10)"]
    SAFE["Privacy-Safe Dataset"]

    RAW --> KA
    KA --> DP
    DP --> AGG
    AGG --> SAFE
```
