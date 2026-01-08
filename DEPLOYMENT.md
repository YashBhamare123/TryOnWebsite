# Deployment Architecture Documentation

A comprehensive guide to the deployment infrastructure of the Virtual Try-On pipeline. This document explains the end-to-end system architecture, from user interaction through inference and result delivery.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [User Interface Layer](#user-interface-layer)
4. [Frontend Infrastructure](#frontend-infrastructure)
5. [API Gateway](#api-gateway)
6. [Inference Worker](#inference-worker)
7. [Data Layer](#data-layer)
8. [Request Flow](#request-flow)
9. [Summary](#summary)

---

## Overview

The Virtual Try-On system is deployed as a distributed cloud-native application, designed for scalability, reliability, and low latency. The architecture separates concerns across multiple specialized services:

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js on Vercel | User interface and interaction |
| **API Gateway** | FastAPI on Modal | Request routing and orchestration |
| **Inference** | Modal Workers | GPU-accelerated image generation |
| **User Database** | MongoDB Atlas | User data and session management |
| **Image Storage** | Cloudinary | Image hosting and CDN delivery |

This separation allows each component to scale independently based on demand—the compute-intensive inference layer can scale GPU resources while the lightweight frontend handles concurrent users efficiently.

---

## Architecture Diagram

The following diagram illustrates the complete deployment architecture and data flow:

![Deployment Architecture](images/deployment_architecture.png)

The system is organized into three major zones:

1. **User Browser** — Where users interact with the application
2. **Vercel Frontend** — The Next.js application serving the UI
3. **Deployment** — The Modal-hosted backend with inference capabilities

---

## User Interface Layer

### User Browser

The entry point for all user interactions. Users access the application through a modern web browser where they can:

- Upload subject images (photos of themselves)
- Select or upload garment images
- View generated try-on results
- Manage their session history

The browser renders the Next.js application and handles local image selection before upload. All communication with backend services occurs over HTTPS for security.

---

## Frontend Infrastructure

### Next.js on Vercel

The frontend is built with **Next.js**, a React framework that provides server-side rendering, API routes, and optimized performance out of the box.

| Feature | Benefit |
|---------|---------|
| **Server-Side Rendering** | Fast initial page loads and SEO optimization |
| **API Routes** | Secure backend communication through server functions |
| **Edge Network** | Global CDN distribution for low-latency asset delivery |
| **Automatic Scaling** | Handles traffic spikes without manual intervention |

#### Why Next.js

Next.js was chosen over alternatives like Gradio for several reasons:

- **Production-Ready UI**: Full control over design, branding, and user experience
- **Performance**: Optimized bundle splitting and lazy loading
- **Integration**: Seamless integration with Vercel's deployment platform
- **Flexibility**: Custom authentication, routing, and state management

#### Vercel Deployment

The Next.js application is deployed on **Vercel**, providing:

- **Zero-Configuration Deployment**: Git push triggers automatic builds and deploys
- **Preview Deployments**: Every PR gets a unique preview URL for testing
- **Edge Functions**: Server-side logic runs close to users globally
- **Analytics**: Built-in performance monitoring and insights

The frontend communicates with the backend through a public HTTPS endpoint, ensuring all data in transit is encrypted.

---

## API Gateway

### Modal ASGI (FastAPI)

The API layer is built with **FastAPI**, a modern Python web framework, deployed on **Modal** as an ASGI application.

| Component | Description |
|-----------|-------------|
| **FastAPI** | High-performance async Python framework |
| **Modal ASGI** | Serverless deployment with automatic scaling |
| **Public Endpoint** | HTTPS endpoint accessible from the frontend |

#### Why FastAPI

FastAPI provides several advantages for ML inference APIs:

- **Async Support**: Non-blocking I/O for handling concurrent requests
- **Automatic Docs**: OpenAPI/Swagger documentation generated automatically
- **Type Safety**: Pydantic models for request/response validation
- **Performance**: One of the fastest Python web frameworks available

#### Request Handling

The FastAPI gateway receives requests from the Next.js frontend and:

1. Validates incoming request data
2. Authenticates the request if required
3. Makes internal calls to the inference worker
4. Returns the generated result to the frontend

The separation between the API gateway and inference worker allows the gateway to remain responsive while GPU-intensive work happens in dedicated workers.

---

## Inference Worker

### Modal GPU Workers

The core inference logic runs on **Modal Workers** equipped with GPU acceleration. This is where the actual virtual try-on generation occurs.

| Specification | Configuration |
|---------------|---------------|
| **GPU** | NVIDIA A100 / H100 |
| **Framework** | PyTorch with Diffusers |
| **Scaling** | Auto-scaling based on queue depth |
| **Cold Start** | Optimized with regional compilation |

#### Worker Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│ MODAL WORKER                                                      │
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   Fetch     │ -> │  Inference  │ -> │   Upload    │            │
│  │   Images    │    │   Pipeline  │    │   Result    │            │
│  └─────────────┘    └─────────────┘    └─────────────┘            │
│        │                  │                  │                    │
│        ▼                  ▼                  ▼                    │
│   Cloudinary         GPU Compute        Cloudinary                │
└───────────────────────────────────────────────────────────────────┘
```

#### Internal Call Mechanism

The FastAPI gateway makes **internal calls** to the inference worker. This internal communication:

- Bypasses public networking overhead
- Runs within Modal's private network
- Enables efficient data transfer between services
- Supports automatic retry and error handling

#### Image Fetching

When a worker receives an inference request, it fetches the subject and garment images directly from **Cloudinary** using HTTPS. This approach:

- Reduces data transfer through the API gateway
- Leverages Cloudinary's CDN for fast image retrieval
- Allows workers to access high-resolution source images

---

## Data Layer

### MongoDB Atlas

**MongoDB Atlas** serves as the primary database for user data and application state.

| Use Case | Data Stored |
|----------|-------------|
| **User Profiles** | Account information, preferences |
| **Usage Metrics** | Request counts, timestamps |
| **Authentication** | User credentials, tokens |

#### Why MongoDB Atlas

- **Managed Service**: No database administration required
- **Global Clusters**: Multi-region deployment for low latency
- **Flexible Schema**: Document model adapts to changing requirements
- **Scaling**: Automatic sharding for horizontal scaling

The frontend communicates with MongoDB Atlas over HTTPS for user authentication and session management.

---

### Cloudinary

**Cloudinary** serves as the image storage and delivery platform, handling both input images and generated outputs.

| Function | Description |
|----------|-------------|
| **Image Upload** | Users upload subject/garment images |
| **Image Storage** | Persistent storage for all images |
| **CDN Delivery** | Fast global delivery of images |
| **Transformations** | On-the-fly image resizing and optimization |

#### Image Flow

```
┌───────────────────────────────────────────────────────────────────┐
│ IMAGE LIFECYCLE                                                   │
│                                                                   │
│  User Upload ──► Cloudinary ──► Worker Fetch ──► Inference        │
│                      │                              │             │
│                      │                              ▼             │
│  User Display ◄── CDN Delivery ◄── Output Upload ◄──┘             │
└───────────────────────────────────────────────────────────────────┘
```

#### Why Cloudinary

- **Optimized Delivery**: Automatic format selection (WebP, AVIF) based on browser
- **Global CDN**: Edge locations worldwide for fast image loading
- **Transformations**: Resize, crop, and optimize without storing multiple versions
- **Direct Upload**: Secure upload from browser without passing through backend

---

## Request Flow

The complete request flow for a virtual try-on generation:

### Step 1: User Initiates Request

The user selects a subject image and garment image in their browser. The Next.js frontend handles the local file selection and prepares the upload.

### Step 2: Image Upload

Images are uploaded directly to Cloudinary from the browser. Cloudinary returns URLs for the uploaded images.

### Step 3: API Request

The frontend sends an HTTPS request to the FastAPI gateway on Modal, including:
- Subject image URL
- Garment image URL
- User preferences (if any)

### Step 4: Worker Dispatch

The FastAPI gateway makes an internal call to a Modal worker, passing the request parameters. If no warm worker is available, Modal spins up a new instance.

### Step 5: Inference Execution

The worker:
1. Fetches subject and garment images from Cloudinary
2. Runs the virtual try-on inference pipeline
3. Generates the output image

### Step 6: Result Storage

The worker uploads the generated image to Cloudinary and receives a CDN URL for the result.

### Step 7: Response Delivery

The worker returns the result URL through the FastAPI gateway back to the frontend. The browser displays the generated image using Cloudinary's CDN.

```
┌───────────────────────────────────────────────────────────────────┐
│ END-TO-END FLOW                                                   │
│                                                                   │
│  Browser ──► Cloudinary (upload)                                  │
│     │                                                             │
│     └──► Next.js ──► FastAPI ──► Worker ──► Cloudinary (fetch)    │
│              │                      │                             │
│              │                      └──► Inference                │
│              │                           │                        │
│              │                           └──► Cloudinary (save)   │
│              │                                │                   │
│              ◄────────────────────────────────┘                   │
│     │                                                             │
│  Browser ◄── (display result via CDN)                             │
└───────────────────────────────────────────────────────────────────┘
```

---

## Summary

The Virtual Try-On deployment architecture leverages best-in-class cloud services for each layer of the stack:

| Component | Technology | Key Benefit |
|-----------|------------|-------------|
| **Frontend** | Next.js + Vercel | Global edge delivery, zero-config deploys |
| **API Gateway** | FastAPI + Modal | Async handling, automatic scaling |
| **Inference** | Modal Workers | GPU access, cold-start optimization |
| **User Database** | MongoDB Atlas | Managed, globally distributed |
| **Image Storage** | Cloudinary | CDN delivery, on-the-fly transforms |

This architecture provides:

- **Scalability**: Each layer scales independently based on demand
- **Performance**: Edge computing and CDN delivery minimize latency
- **Reliability**: Managed services with built-in redundancy
- **Developer Experience**: Git-based deployments, automatic previews
- **Cost Efficiency**: Pay-per-use GPU computing, no idle resources

The separation of concerns allows the team to iterate on individual components without affecting the entire system, while the use of managed services reduces operational overhead.
