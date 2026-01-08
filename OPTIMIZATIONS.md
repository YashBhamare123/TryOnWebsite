# Performance Optimizations Documentation

A comprehensive guide to the performance optimizations implemented in the Virtual Try-On pipeline. These optimizations collectively reduce cold-start latency, minimize VRAM footprint, and accelerate inference—all while maintaining high-quality output.

---

## Table of Contents

1. [Overview](#overview)
2. [Safetensors Loading](#safetensors-loading)
3. [Text Embedder Cache](#text-embedder-cache)
4. [Custom Pipeline Loader](#custom-pipeline-loader)
5. [Flash Attention](#flash-attention)
6. [FP8 Quantization](#fp8-quantization)
7. [Regional Compilation](#regional-compilation)
8. [LoRA Hotswapping](#lora-hotswapping)
9. [TeaCache](#teacache)
10. [Batched Logo Inference](#batched-logo-inference)
11. [Summary](#summary)

---

## Overview

The Virtual Try-On pipeline is deployed in a serverless GPU environment where computational resources are provisioned on-demand. With limited GPU capacity and variable user traffic throughout the day, usage patterns tend to be sparse—periods of high activity interspersed with idle windows. This means containers are frequently spun down during quiet periods and spun up fresh when new requests arrive, resulting in many users experiencing **cold starts** rather than hitting warm, ready-to-serve instances.

Cold start latency compounds across every component: model weights must be loaded from storage, computation graphs compiled, and memory allocated before the first inference can begin. Without optimization, users face wait times exceeding a minute before seeing results—an unacceptable experience for a production system.

The optimizations documented here address three interconnected challenges:

| Challenge | Impact |
|-----------|--------|
| **Cold Start Latency** | Users wait for model loading and compilation before first inference |
| **VRAM Consumption** | Limits model size and batch capacity on constrained hardware |
| **Inference Speed** | Affects throughput and end-to-end response time |

Each optimization targets one or more of these challenges, and together they transform a slow, resource-hungry pipeline into an efficient production system.

---

## Safetensors Loading

Model weight files traditionally use Python's pickle-based formats (`.bin`, `.pt`), which require sequential deserialization and full memory loading before GPU transfer. In a cold start scenario, this adds significant latency as gigabytes of weights are processed through Python's object reconstruction.

We use **safetensors** format for all model weight files, which enables memory-mapped loading. The GPU can stream weights directly from disk without fully materializing them in CPU RAM first—a technique that dramatically reduces initialization time.

| Aspect | Pickle Format | Safetensors |
|--------|---------------|-------------|
| **Loading Speed** | Slow (sequential) | Fast (memory-mapped) |
| **Memory Usage** | Full file in RAM | Zero-copy loading |
| **Security** | Arbitrary code execution risk | Safe, no code execution |
| **Cold Start Impact** | Significant latency | Minimal latency |

Beyond performance, safetensors eliminates the security vulnerabilities inherent in pickle files, which can execute arbitrary code during deserialization.

---

## Text Embedder Cache

The standard FLUX pipeline includes a text encoder stack (T5-XXL + CLIP) consuming approximately **7.8 GB of VRAM**. During extensive testing, we discovered that most of the conditioning signal for virtual try-on comes from **FLUX Redux** (image conditioning), not the text embedder. The text encoder's role is limited to providing general task context—essentially telling the model "this is a garment inpainting task."

Since our prompts are static and task-specific, we pre-compute the text embeddings offline, cache them as safetensors files, and remove the text encoder entirely from the runtime pipeline. This straightforward change eliminates a massive memory footprint without impacting output quality.

| Metric | Before | After |
|--------|--------|-------|
| **VRAM Usage** | +7.8 GB for T5-XXL + CLIP | 0 GB (cached embeddings only) |
| **Cold Start** | Load 7.8 GB of encoder weights | Load ~50 MB of cached embeddings |
| **Runtime** | Encode prompts on every request | Direct embedding lookup |

This single optimization saves approximately **7.8 GB of VRAM**, freeing capacity for larger batch sizes or higher resolution processing.

---

## Custom Pipeline Loader

Standard Diffusers pipeline loaders assume a complete model stack: transformer backbone, VAE, text encoders, and tokenizers. When using cached text embeddings, loading the full stack wastes resources and time on components that will never be used.

We implement a **custom loader** that constructs the FLUX Fill pipeline with only the required components:

```python
# Helper function from main.py - loads only specified components
def _load_components(self, input : dict):
        pipeline = input['pipeline']
        repo = input['repo']
        subfolder = input['subfolder']
        device = input['device']
        dtype = input['dtype']
        dtype_kwargs = {}
        if dtype:
            dtype_kwargs['torch_dtype'] = dtype

        if subfolder in ['transformer', 'vae']:

            if device:
                model = pipeline.from_pretrained(repo, subfolder = subfolder, low_cpu_mem_usage=False, local_files_only=True, **dtype_kwargs).to(device)
            else:
                model = pipeline.from_pretrained(repo, subfolder = subfolder,low_cpu_mem_usage=False, local_files_only=True, **dtype_kwargs)
            return {subfolder : model}
        
        else:
            return {subfolder : None}
    
```

| Component | Standard Loader | Custom Loader |
|-----------|-----------------|---------------|
| **Transformer** | ✓ | ✓ |
| **VAE** | ✓ | ✓ |
| **T5-XXL Encoder** | ✓ | ✗ |
| **CLIP Encoder** | ✓ | ✗ |
| **Tokenizers** | ✓ | ✗ |
| **Cached Embeddings** | ✗ | ✓ |

The result is faster initialization and reduced memory footprint by avoiding unnecessary component instantiation.

---

## Flash Attention

Attention computation is the primary bottleneck in transformer-based diffusion models. We leverage **Scaled Dot-Product Attention (SDPA)**—PyTorch's built-in optimized attention implementation that automatically selects the most efficient kernel for the current hardware and input characteristics.

| Metric | Standard Attention | SDPA |
|--------|-------------------|------|
| **Memory Scaling** | O(n²) | O(n) with memory-efficient mode |
| **Speed** | Baseline | 2-4× faster on modern GPUs |
| **Implementation** | Manual | Automatic in Diffusers |

Diffusers automatically uses SDPA when available (PyTorch 2.0+), providing memory-efficient attention for long sequences and Flash Attention kernels on compatible hardware with zero configuration required.

---

## FP8 Quantization

The FLUX Fill transformer backbone contains billions of parameters, each stored as FP16 (2 bytes) or FP32 (4 bytes). This creates a large VRAM footprint, slow weight loading, and memory bandwidth bottlenecks during inference.

We employ **FP8 quantization** for the transformer backbone, reducing precision from 16-bit to 8-bit floating point. The iterative denoising process in diffusion models is inherently robust to small precision errors—each step corrects minor deviations from the previous step. The final output is visually indistinguishable from FP16 inference.

| Aspect | FP16 | FP8 |
|--------|------|-----|
| **Memory per Parameter** | 2 bytes | 1 byte |
| **VRAM Reduction** | Baseline | ~50% reduction |
| **Load Speed** | Baseline | ~2× faster |
| **Quality Impact** | Full precision | Negligible loss |

This optimization roughly halves the transformer's memory footprint while providing faster weight loading.

---

## Regional Compilation

PyTorch's `torch.compile()` with the Inductor backend provides significant inference speedups, but introduces substantial compilation overhead—typically **50-60 seconds** with default settings. In a serverless environment where many users hit cold containers due to sparse usage patterns, full compilation is counterproductive. Users would wait a full minute before inference even begins.

The FLUX Fill transformer consists of **19 Double-Stream Blocks** (cross-attention between text and image) and **38 Single-Stream Blocks** (self-attention processing). All blocks within each category share identical architecture. Once one block is compiled, its optimized kernels can be **reused across all similar blocks**.

Instead of compiling the entire model, we selectively compile only the **first Double-Stream Block** (cache reused by remaining 18 blocks) and the **first Single-Stream Block** (cache reused by remaining 37 blocks):

```python
# Regional compilation from main.py
if params.compile_repeated:
    pipe.transformer.single_transformer_blocks = nn.ModuleList([
        torch.compile(block) for block in pipe.transformer.single_transformer_blocks
    ])

    pipe.transformer.transformer_blocks = nn.ModuleList([
        torch.compile(block) for block in pipe.transformer.transformer_blocks
    ])
```

```
┌─────────────────────────────────────────────────────────────────┐
│ STANDARD COMPILATION                                            │
│                                                                 │
│ Compile all 57 blocks ──────────────────────────► 50-60 seconds │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ REGIONAL COMPILATION                                            │
│                                                                 │
│ Compile 2 blocks ──► Reuse cache for 55 blocks ──► ~9 seconds   │
│                                                                 │
│ Inference speed remains identical to full compilation           │
└─────────────────────────────────────────────────────────────────┘
```

| Metric | Full Compilation | Regional Compilation |
|--------|------------------|---------------------|
| **Compile Time** | 50-60 seconds | ~9 seconds |
| **Inference Speed** | Optimized | Identical (cache reuse) |
| **Cold Start Total** | 60+ seconds | ~15 seconds |

This **6× reduction** in compilation time makes serverless deployment practical without sacrificing inference performance.

---

## LoRA Hotswapping

The dual-pipeline architecture uses different LoRA adapters for different purposes: a **realism LoRA** for the Initial Pipeline and **ACE++ LoRA** for subject consistency in the Logo Pipeline. Normally, switching LoRAs between pipelines would invalidate PyTorch's compilation cache, triggering full recompilation and negating all regional compilation benefits.

We use PyTorch's **LoRA Hotswapping** mechanism, which compiles the model with a **maximum LoRA rank** parameter. This allocates weight buffers sized for the maximum rank, allowing any LoRA with rank ≤ max_rank to be swapped instantly without recompilation:

```
┌─────────────────────────────────────────────────────────────────┐
│ WITHOUT HOTSWAPPING                                             │
│                                                                 │
│ LoRA A ──► Compile ──► Run ──► LoRA B ──► Recompile ──► Run     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ WITH HOTSWAPPING                                                │
│                                                                 │
│ Compile (max_rank=64) ──► LoRA A (copy weights) ──► Run         │
│                       └──► LoRA B (copy weights) ──► Run        │
│                                                                 │
│ No recompilation required between LoRA switches                 │
└─────────────────────────────────────────────────────────────────┘
```

| Scenario | Without Hotswapping | With Hotswapping |
|----------|---------------------|------------------|
| **First LoRA** | 9 seconds (regional compile) | 9 seconds |
| **Second LoRA** | 9 seconds (recompile) | <1 second (weight copy) |
| **Total for both** | 18 seconds | ~10 seconds |

---

## TeaCache

Diffusion models generate images through iterative denoising—typically 20-50 steps. At each step, the full transformer forward pass executes. However, adjacent timesteps often produce **highly similar intermediate outputs**, meaning much computation is redundant.

**TeaCache** (Timestep Embedding Aware Cache) is a training-free caching optimization that monitors how much intermediate outputs change between timesteps. When changes are small, it reuses cached outputs instead of recomputing, dynamically deciding when to cache vs. compute based on timestep embeddings:

```
┌─────────────────────────────────────────────────────────────────┐
│ STANDARD DIFFUSION (25 steps)                                   │
│                                                                 │
│ Step 1 ──► Step 2 ──► Step 3 ──► ... ──► Step 25                │
│ [Compute]  [Compute]  [Compute]          [Compute]              │
│                                                                 │
│ All 25 forward passes executed                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ WITH TEACACHE                                                   │
│                                                                 │
│ Step 1 ──► Step 2 ──► Step 3 ──► Step 4 ──► ...                 │
│ [Compute]  [Cache]    [Compute]  [Cache]                        │
│                                                                 │
│ ~18-20 forward passes executed, remainder served from cache     │
└─────────────────────────────────────────────────────────────────┘
```

We implement TeaCache in Diffusers by **overriding the transformer's forward pass**. Before each forward pass, the system estimates output similarity to the previous step. If the estimated change is below threshold, it returns the cached output; otherwise, it computes a new output and updates the cache.

```python
# TeaCache implementation from teacache.py
if self.enable_teacache:
    inp = hidden_states.clone()
    temb_ = temb.clone()
    modulated_inp, gate_msa, shift_mlp, scale_mlp, gate_mlp = self.transformer_blocks[0].norm1(inp, emb=temb_)
    if self.cnt == 0 or self.cnt == self.num_steps-1:
        should_calc = True
        self.accumulated_rel_l1_distance = 0
    else: 
        coefficients = [4.98651651e+02, -2.83781631e+02, 5.58554382e+01, -3.82021401e+00, 2.64230861e-01]
        rescale_func = np.poly1d(coefficients)
        self.accumulated_rel_l1_distance += rescale_func(
            ((modulated_inp-self.previous_modulated_input).abs().mean() / 
             self.previous_modulated_input.abs().mean()).cpu().item()
        )
        if self.accumulated_rel_l1_distance < self.rel_l1_thresh:
            should_calc = False
        else:
            should_calc = True
            self.accumulated_rel_l1_distance = 0
    self.previous_modulated_input = modulated_inp 
    self.cnt += 1

    if not should_calc:
        hidden_states += self.previous_residual
```

| Metric | Standard Diffusion | With TeaCache |
|--------|-------------------|---------------|
| **Forward Passes** | 25 (all steps) | ~18-20 (20-30% cached) |
| **Inference Time** | Baseline | ~20-30% faster |
| **Quality Impact** | Full quality | Minimal perceptual difference |

TeaCache provides meaningful inference speedups with negligible quality degradation—a key optimization for production throughput.

---

## Batched Logo Inference

The Logo Pipeline processes multiple detected logos per garment. Processing each logo individually wastes GPU parallelism, incurs repeated kernel launch overhead, and leaves compute resources underutilized.

Detected and matched logo pairs are resized to consistent dimensions, stacked into a batch tensor, and processed in a single forward pass:

```python
# Batched processing from logo/processing.py
# Resize all cropped logos to uniform dimensions
final_resizer = Resize((min_height, min_width), antialias=True)

final_images, final_masks = [], []
for img, msk in zip(intermediate_images, intermediate_masks):
    final_images.append(final_resizer(img))
    final_masks.append(final_resizer(msk))

# Stack into batch tensors for single forward pass
batched_images = torch.stack(final_images)
batched_masks = torch.stack(final_masks)

final_image_tensor = batched_images.to(self.device, self.dtype)
final_mask_tensor = batched_masks.to(self.device, self.dtype)
```

```
┌─────────────────────────────────────────────────────────────────┐
│ INDIVIDUAL PROCESSING                                           │
│                                                                 │
│ Logo 1 ──► [Forward Pass] ──► Result 1                          │
│ Logo 2 ──► [Forward Pass] ──► Result 2                          │
│ Logo 3 ──► [Forward Pass] ──► Result 3                          │
│                                                                 │
│ Total: 3 forward passes, 3× kernel overhead                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BATCHED PROCESSING                                              │
│                                                                 │
│ [Logo 1, Logo 2, Logo 3] ──► [Single Forward Pass]              │
│                          └──► [Result 1, Result 2, Result 3]    │
│                                                                 │
│ Total: 1 forward pass, 1× kernel overhead                       │
└─────────────────────────────────────────────────────────────────┘
```

| Logos Detected | Individual Processing | Batched Processing |
|----------------|----------------------|-------------------|
| 1 logo | 1× forward pass | 1× forward pass |
| 3 logos | 3× forward pass | 1× forward pass |
| 5 logos | 5× forward pass | 1× forward pass |

GPU utilization improves significantly when processing garments with multiple brand elements.

---

## Summary

These optimizations work together as a cohesive system, each addressing different aspects of production inference:

| Optimization | Primary Benefit | Impact |
|--------------|-----------------|--------|
| **Safetensors** | Cold start latency | Memory-mapped loading, faster init |
| **Text Embedder Cache** | VRAM reduction | 7.8 GB savings |
| **Custom Loader** | Resource efficiency | Load only required components |
| **Flash Attention (SDPA)** | Inference speed | 2-4× attention speedup |
| **FP8 Quantization** | VRAM + speed | 50% memory reduction |
| **Regional Compilation** | Cold start latency | 50s → 9s compile time |
| **LoRA Hotswapping** | Pipeline switching | Avoid recompilation on LoRA swap |
| **TeaCache** | Inference speed | 20-30% faster generation |
| **Batched Logo Inference** | Throughput | Parallel logo processing |

Together, these optimizations enable production-grade virtual try-on inference with fast cold starts, efficient resource usage, and high throughput—all without sacrificing output quality.

---

## Deployment

This optimized system is deployed on **Modal Labs**, leveraging their serverless GPU infrastructure. The cold-start optimizations are specifically designed for this environment, where sparse usage patterns mean many users hit freshly-provisioned containers rather than warm instances.
