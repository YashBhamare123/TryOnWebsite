# Virtual Try-On Pipeline Documentation

A comprehensive, production-ready pipeline for high-fidelity virtual garment try-on. This system intelligently segments body regions, processes images for optimal inpainting, and leverages a dual-pipeline architecture to generate photorealistic results with accurate texture, text, and logo reproduction.

---

## Table of Contents

1. [Overview](#overview)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Agentic System](#agentic-system)
4. [Segmentation](#segmentation)
5. [Processing](#processing)
6. [Dual Pipeline Overview](#dual-pipeline-overview)
7. [FLUX Fill Backbone](#flux-fill-backbone)
8. [Dual Pipeline Architecture](#dual-pipeline-architecture)

---

## Overview

This Virtual Try-On (VTON) system solves the problem of realistically overlaying a garment image onto a subject (person) image. Unlike traditional approaches that often struggle with texture fidelity, fabric physics, and brand elements, this pipeline employs:

- **Intelligent Region Detection**: An AI-powered agentic system determines exactly which body parts need modification
- **Precision Segmentation**: Fine-tuned transformer models for accurate clothing and body part masks
- **Smart Preprocessing**: Zoom-crop-stitch mechanisms that preserve fine details
- **Dual Pipeline Processing**: Separate optimization paths for general appearance and logo/text accuracy

---

## Pipeline Architecture

The overall system follows this high-level flow:

```
Subject Image + Garment Image
         │
         ▼
┌─────────────────────┐
│   Agentic System    │  ← Determines segmentation targets
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│    Segmentation     │  ← Creates precise masks
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│    Preprocessing    │  ← Crop, concatenate, mask processing
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Initial Pipeline   │  ← Texture & realism generation
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Logo Pipeline     │  ← Text & logo refinement (conditional)
└─────────────────────┘
         │
         ▼
    Final Output
```

---

## Agentic System

The **Agentic System** is the brain of the pipeline. It analyzes both the subject image and the garment image to intelligently determine which body regions need to be segmented and replaced during the virtual try-on process.

### Architecture Diagram

![Agentic System Architecture](/Users/yash/.gemini/antigravity/brain/f4adb06e-870e-41aa-a909-6e48238ed738/uploaded_image_2_1767708606866.png)

### Purpose

Different garments require different segmentation strategies:
- A **t-shirt** requires segmenting the upper body, arms, and neck area
- **Pants** require leg segmentation
- A **dress** may require full-body segmentation including both upper and lower regions
- **Sleeveless tops** expose arms differently than long-sleeve alternatives

The agentic system automates this decision-making process, eliminating manual intervention and ensuring accurate, context-aware segmentation.

### Implementation

Built using **LangGraph** (for orchestrating multi-step AI workflows) and powered by the **Groq API** (for ultra-fast inference), the system maintains a structured state that captures all relevant information:

```python
class State(TypedDict):
    # Input URLs
    subject_url: str
    clothes_url: str
    
    # Generated descriptions
    subject_description: str
    garment_description: str
    
    # Clothing type classification
    subject_clothes_type: str
    clothes_type: str
    
    # Segmentation labels (boolean flags)
    upper_clothes: bool
    pants: bool
    skirt: bool
    dress: bool
    left_arm: bool
    right_arm: bool
    left_leg: bool
    right_leg: bool
    lower_neck: bool
    
    # Error tracking
    errors: Annotated[list, operator.add]
```

### Workflow

The agentic system operates through several interconnected engines:

#### 1. Description Engine
Analyzes both input images and generates detailed textual descriptions of:
- The subject's current clothing and pose
- The garment's style, type, and characteristics

#### 2. Prediction Engine (Replacement Identifier)
Using the descriptions from the Description Engine, this engine predicts:
- What type of clothing is being worn by the subject
- What type of clothing is being applied (the garment)
- Which body regions will be affected by the replacement

#### 3. Refinement Engine

The Refinement Engine exists to solve a critical problem: **naive segmentation based solely on garment type often over-segments or under-segments the necessary regions, leading to subpar outputs**.

Consider this example: A subject is wearing **jeans**, and we want to replace them with **shorts**. A naive approach would segment the entire leg region because "pants are being replaced." However, this creates a serious problem—shorts only cover the upper thighs, meaning the entire lower leg from knee to ankle would be unnecessarily included in the inpainting mask. The model would then attempt to regenerate skin, leg hair, and natural leg appearance for a region that doesn't need modification at all. This over-segmentation leads to artifacts, unnatural skin tones, and inconsistent results.

The Refinement Engine solves this through three specialized exposure modules that receive the Prediction Engine's outputs and refine them based on comparative analysis:

| Module | Function | Example |
|--------|----------|---------|
| **Arm Exposure** | Compares sleeve lengths between subject and garment | Long sleeves → tank top: segment arms. Tank top → long sleeves: don't segment arms (they'll be covered) |
| **Leg Exposure** | Compares leg coverage between subject and garment | Jeans → shorts: only segment upper thigh area. Shorts → jeans: segment full leg for coverage |
| **Neck Exposure** | Compares neckline styles between subject and garment | Crew neck → v-neck: segment lower neck. V-neck → turtleneck: no neck segmentation needed |

### Output

The Refinement Engine's outputs—a set of **segmentation labels** (boolean flags)—are passed to the Segmentation module, indicating exactly which regions the segmentation model should target.

---

## Segmentation

The segmentation module receives the boolean segmentation labels from the Agentic System and creates pixel-precise masks for those specified regions.

### Models Used

| Purpose | Model | Description |
|---------|-------|-------------|
| **Subject Segmentation** | SegFormer B2 (Fine-tuned) | Custom-trained for humans wearing clothes, with enhanced lower-neck detection |
| **Garment Segmentation** | SegFormer B3 Clothes | Pre-trained model optimized for isolated garment images |

### Custom Dataset Creation

The subject segmentation model required special training to handle the **lower neck** region—an area often exposed during garment transitions.

#### The Lower Neck Problem

Different garments have vastly different collar lines and necklines. Consider this transition: a subject wearing a **v-neck t-shirt** tries on a **buttoned collared shirt**. The v-neck exposes a triangular patch of skin below the collarbone, while the collared shirt covers this area entirely (and adds a collar around the neck). Without proper lower-neck segmentation, the model would either:
- Leave the v-neck skin patch visible beneath the collared shirt (incorrect)
- Attempt to paint over it without proper training, resulting in artifacts

Other challenging transitions include:
- **Crew neck → deep scoop neck**: More skin becomes visible
- **Off-shoulder → turtleneck**: Shoulder area changes from exposed to covered
- **Halter top → regular t-shirt**: Neckline and shoulder coverage changes dramatically

#### Dataset Creation Process

1. **Base Dataset**: Started with an existing clothing segmentation dataset

2. **Face Detection & Exclusion**: Applied YOLO to detect faces and create padded bounding boxes. This ensures the face region (which should never be modified during VTON) is properly separated from the neck region.

3. **Mask Subtraction**: Subtracted the face mask region from the original labels, isolating the area between face and upper clothing.

4. **New Class Label**: The remaining area became the "lower neck" class—a distinct segmentation target for neckline transitions.

#### Data Augmentation Pipeline

To ensure the model generalizes well across varied real-world conditions, extensive augmentations were applied with **synchronized RNGs** ensuring identical transformations for both images and their corresponding masks:

| Transform Type | Augmentations Applied |
|---------------|----------------------|
| **Geometric** | Perspective warping, random crops, horizontal flips |
| **Color** | Brightness, contrast, saturation, hue shifts |
| **Synchronization** | Shared random seed ensures mask pixels perfectly align with transformed image pixels |

The synchronized RNG is critical—without it, a perspective warp applied differently to image and mask would create misaligned training data, teaching the model incorrect region boundaries.

### Output

The segmentation module produces **pixel-precise masks** for both the subject image and garment image, which are passed to the Processing stage for preparation before inpainting.

---

## Processing

The Processing stage receives the subject image, garment image, and their respective masks from the Segmentation module. Its job is to transform these raw inputs into an optimized format that allows the inpainting model to produce the highest quality results possible.

Think of it this way: the segmentation stage tells us *what* to replace, but the processing stage determines *how* to present that information to the generation model. Poor preprocessing leads to wasted model capacity, visible seams, and unnatural results—no matter how powerful the underlying model is.

### Architecture Diagram

![Preprocessing Architecture](/Users/yash/.gemini/antigravity/brain/f4adb06e-870e-41aa-a909-6e48238ed738/uploaded_image_3_1767708606866.png)

---

### The Inpaint Stitcher: Crop, Generate, Paste

One of the most important insights in this pipeline is that **resolution matters immensely for detail preservation**. Inpainting models have fixed input resolutions—typically 512×512 or 1024×1024 pixels. When you feed a full-body photograph to such a model, those pixels must be shared across the entire image: the face, background, legs, shoes, and the clothing you actually want to modify.

Consider a typical scenario: you have a 2000×3000 pixel photograph of a person, and you want to replace their t-shirt. If you resize the entire image to fit the model's 1024×1024 input, the t-shirt region might only occupy 200×300 pixels of that space. The model's capacity is wasted on irrelevant areas—the background, the person's face, their jeans—while the region you care about gets only a fraction of the available resolution.

The Inpaint Stitcher solves this through a crop-and-stitch approach that maximizes resolution where it matters.

#### Cropper (Preprocessing)

The Cropper takes the subject image, garment image, and their masks from the Segmentation module and performs focused extraction:

1. **Bounding Box Detection**: For each mask, it identifies the smallest rectangle that fully contains all masked pixels. This rectangle defines the "region of interest."

2. **Padding Addition**: The bounding box is expanded with generous padding on all sides. This padding serves two purposes: it provides the generation model with surrounding context (so it can match lighting, shadows, and colors), and it creates overlap regions that enable seamless blending later.

3. **Extraction and Resize**: The padded region is extracted from the full image and scaled to the model's optimal input resolution. Now, instead of the t-shirt occupying 200 pixels of a 1024-pixel image, it might occupy 800 or more pixels—a 4× increase in effective resolution.

The Cropper stores the bounding box coordinates for later use and outputs cropped, high-resolution versions of both the subject and garment image-mask pairs.

#### Stitcher (Post-Processing)

After the generation model produces its output, the Stitcher reverses the cropping process:

1. It receives the generated cropped image from the backbone
2. Using the stored bounding box coordinates, it scales the result back to match the original crop region's dimensions
3. It pastes this result into the corresponding location of the original full-resolution subject image

Because the Cropper added padding around the masked region, the generated content extends beyond the strict mask boundaries. This overlap means the paste operation doesn't create visible edges—the generated content and original content blend together naturally in the padded zone.

---

### Concatenation: Shared Latent Space for Better Transfer

With cropped image-mask pairs ready, the next challenge is ensuring the generation model truly understands the relationship between the subject and the garment. If we process them separately or sequentially, the model has no way to directly compare textures, colors, and patterns between the two.

The solution is **concatenation**: before sending inputs to the backbone, we physically combine the subject and garment inputs into a single unified tensor. The subject image sits alongside its mask, and the garment image sits alongside its mask—all in one combined input.

This design choice has profound implications for quality:

- **Shared latent space**: When the model encodes this concatenated input into its latent representation, both the subject and garment exist in the same mathematical space. The model can directly attend to garment features while generating clothing on the subject.

- **Direct texture reference**: Pattern information, color values, and textural details from the garment are immediately available to the generation process. The model doesn't need to "remember" the garment from a previous step—it can see it right there in the input.

- **Consistent lighting and style**: Because both images are processed together, the model naturally adapts the garment's appearance to match the subject's lighting conditions, creating more realistic composites.

The output of this stage is a concatenated image-mask tensor ready for the backbone, carrying both subject and garment information in a format optimized for generation.

---

### Mask Processing: Grow and Blur for Natural Results

The final preprocessing steps address a subtle but critical issue: **real clothing doesn't have pixel-perfect boundaries**.

When a segmentation model produces a mask, it outputs a binary classification—each pixel is either "clothing" or "not clothing." But in the real world, fabric edges are fuzzy, clothing drapes and folds create soft shadows, and the boundary between a shirt and bare skin isn't a crisp line.

If we use the raw binary mask directly, the generation model is constrained to produce clothing that exactly fills those pixels and no more. The result looks painted on—artificially tight, with no natural flow or draping.

#### Mask Growing (Dilation)

The first processing step expands the mask slightly beyond its original boundaries through a morphological dilation operation. This gives the generation model room to breathe:

- Loose fabrics can extend naturally beyond the strict body silhouette
- Clothing edges can have realistic folds and draping that extend outward
- The model can generate natural fabric behavior at garment boundaries (wrinkles, shadows, overlap)

Without dilation, a flowy blouse would be constrained to look skin-tight. With dilation, it can billow and drape as fabric naturally does.

#### Mask Blurring

The second processing step applies Gaussian blur to the mask edges, converting the hard binary boundary into a soft gradient.

This gradient tells the generation model: "In the center of this region, fully replace with generated content. At the edges, gradually blend between generated and original." The result is:

- No visible "cut and paste" lines where generation meets original image
- Smooth color transitions at boundaries
- Natural integration of generated clothing with the original photograph

After these mask processing steps, the fully prepared concatenated image-mask tensor is ready for the FLUX Fill Backbone.

---

## Dual Pipeline Overview

Before diving into the backbone architecture, it's important to understand why this system employs two separate pipelines rather than one.

### The Challenge

Virtual try-on requires optimizing for two fundamentally different objectives:
1. **Texture & Realism**: Fabric folds, lighting, shadows, and natural draping
2. **Logo & Text Accuracy**: Exact reproduction of brand elements, text, and graphics

These objectives often conflict. When a single model tries to optimize for both simultaneously, it typically compromises on one:
- Prioritizing texture leads to blurry or distorted logos
- Prioritizing logos leads to unnatural fabric appearance

### The Solution

We split the generation into two sequential pipelines:

| Pipeline | Objective | Focus |
|----------|-----------|-------|
| **Initial Pipeline** | Generate realistic garment with natural texture and fit | Global appearance, fabric physics, lighting |
| **Logo Pipeline** | Refine brand elements and text | Local detail accuracy, text sharpness |

### Shared Backbone

Both pipelines share the same **FLUX Fill backbone** architecture. They differ only in their configuration (LoRA weights, processing steps). Understanding the backbone is therefore essential before exploring how each pipeline utilizes it.

---

## FLUX Fill Backbone

At the core of both pipelines sits the **FLUX Fill** model—a state-of-the-art inpainting architecture optimized for high-fidelity image generation.

### Architecture Diagram

![Fill Backbone Architecture](/Users/yash/.gemini/antigravity/brain/f4adb06e-870e-41aa-a909-6e48238ed738/uploaded_image_1_1767708606866.png)

---

### Inputs

The backbone receives:
- **Processed image & mask pairs** from the Processing stage (concatenated subject and garment)
- **Text conditioning** from the Dual CLIP Loader
- **Image conditioning** from FLUX Redux

---

### Conditioning Signal Generation

The backbone requires rich conditioning signals to guide generation. These come from two sources:

#### 1. Dual CLIP Loader (Text Conditioning)

Text prompts describing the desired output are processed through a **dual encoder architecture**:

| Encoder | Purpose |
|---------|---------|
| **T5-XXL** | Captures detailed semantic meaning and complex descriptions |
| **ViT Detail** | Focuses on visual-specific textual concepts |

**Why dual encoding?** Different aspects of text prompts (semantic meaning vs. visual concepts) are better captured by different architectures. The combination provides richer, more complete conditioning.

#### 2. FLUX Redux with SigLip (Image Conditioning)

**FLUX Redux** is an adapter that sits before the FLUX Fill model. It is specifically trained to force the generation model to produce images that closely match a conditioning image—making it perfect for virtual try-on where the generated clothing must match the input garment exactly.

**How it works**:
1. The **garment image** is passed through the **SigLip Image Embedder**
2. SigLip generates rich visual embeddings that capture the garment's appearance characteristics
3. **FLUX Redux** takes these embeddings and converts them into conditioning signals specifically designed to constrain the model's output
4. The result is that FLUX Fill is *forced* to generate images that preserve the garment's exact appearance

**Key distinction**: SigLip creates the embeddings (the representation of the garment), but it is FLUX Redux's training that enforces the similarity constraint. Redux was trained with the explicit objective of making outputs match conditioning inputs.

---

### Fill Model Components

The FLUX Fill model itself incorporates several optimization and enhancement modules:

| Component | Function |
|-----------|----------|
| **Compilation** | Optimizes the model graph for faster inference |
| **Quantization** | Reduces precision for memory efficiency without quality loss |
| **TeaCache** | Caches intermediate computations for faster generation |
| **Custom Loader** | Handles model weights and initialization |
| **ACE++ LoRA** | Subject-consistency adapter (enabled for logo pipeline only) |
| **LoRA HotSwap** | Enables dynamic switching between LoRA weights |

---

### Output

The backbone produces a generated image that is passed to either:
- The **Stitcher** for integration back into the original subject image (Initial Pipeline)
- The **Logo Detection** module for brand element analysis (before Logo Pipeline)

---

## Dual Pipeline Architecture

Now that we understand the shared backbone, let's examine how each pipeline configures and uses it.

### Initial Pipeline (Texture & Realism)

**Objective**: Generate a photorealistic image with accurate fabric textures, natural folds, and realistic lighting.

**Inputs**: 
- Processed concatenated image & mask pairs from Processing stage
- Text conditioning from Dual CLIP
- Image conditioning from FLUX Redux

**Configuration**:
- FLUX Fill backbone
- Texture-focused LoRA weights
- ACE++ LoRA: **Disabled** (to allow creative fabric generation without over-constraining)

**Process**:
1. Receive processed inputs from the Processing stage
2. Generate conditioned output through the backbone
3. Deconcatenate the result to separate subject from garment
4. Apply Stitcher to paste generated region back into original subject image

**Output**: Intermediate generated image → passed to Logo Detection

---

### Logo Detection & Matching

Before the second pipeline can operate, we need to detect and match logos between the generated image and the original garment.

#### Architecture Diagram

![Logo Detection Architecture](/Users/yash/.gemini/antigravity/brain/f4adb06e-870e-41aa-a909-6e48238ed738/uploaded_image_0_1767708606866.png)

#### Why Logo Detection is Necessary

The Initial Pipeline prioritizes overall realism over exact logo reproduction. During generation, brand logos and text often become slightly blurred, distorted, or lose fine details. Additionally, we need to locate exactly where these logos appear in the generated image for targeted refinement.

#### The Detection Process

The **OWL-ViT** (Vision Transformer for Open-World Localization) detector scans both images:
- **Generated Image** (from Initial Pipeline): Identifies where logos appear in the result
- **Original Garment Image**: Identifies the source logos that should be matched

**Bypass condition**: If OWL-ViT detects zero logos in the garment image, the second pipeline is skipped entirely. This saves computation when processing garments without brand elements.

#### The Matching Challenge

A critical challenge arises: the number of detected logos often differs between images. This happens for several reasons:

- **Lost logos**: The generation model might not perfectly reproduce smaller or less prominent logos
- **Hidden regions**: Parts of the garment visible in isolation become hidden when worn (e.g., logos on the back, logos hidden by hair or behind the neck)
- **False positives**: Either detector might identify non-logo regions as logos

Simply assuming a 1:1 correspondence would lead to incorrect refinement—pasting the wrong logo into the wrong location.

#### Similarity-Based Matching

To solve this, we employ **ResNet-50** as a similarity engine:

1. Extract embeddings for each detected logo in the generated image (Subject Logo Stack)
2. Extract embeddings for each detected logo in the garment image (Garment Logo Stack)
3. Compute pairwise similarity scores between all logo pairs
4. For each generated logo, find its closest match from the garment logos
5. Discard unmatched logos (either false positives or logos from hidden regions)

This ensures that only valid, well-matched logos proceed to refinement, preventing artifacts from mismatched logo pasting.

#### Efficient Batching

Matched logos are prepared for efficient processing:
1. **Resize**: All logos scaled to consistent dimensions
2. **Concatenate**: Logos arranged into a batch tensor
3. **Single Forward Pass**: The entire batch processed through the backbone together

**Output**: Batched logo pairs ready for the Second Pipeline

---

### Second Pipeline (Logo & Text Refinement)

**Objective**: Ensure any logos, text, or brand elements from the garment appear accurately in the final output.

**Inputs**:
- Batched logo pairs from Logo Detection & Matching
- Original garment logos as reference
- Text conditioning from Dual CLIP
- Image conditioning from FLUX Redux

**Configuration**:
- FLUX Fill backbone (same as Initial Pipeline)
- ACE++ LoRA: **Enabled** (for strong subject consistency and accurate reproduction)

ACE++ LoRA is specifically renowned for maintaining image consistency in diffusion models. By enabling it here, we force the model to reproduce logos with high fidelity to the original garment.

**Process**:
1. Receive batched logo pairs from detection and matching
2. Process through backbone with ACE++ LoRA enabled
3. Generate refined logo regions with improved clarity and accuracy

**Output**: Refined logo images → passed to Logo Integration

---

### Logo Integration

The final step seamlessly integrates refined logos back into the main image:

1. Each refined logo is retrieved from the batch
2. Using the stored bounding box coordinates from detection, logos are positioned correctly
3. Because detection included padding around each logo, pasting creates smooth transitions
4. No visible edges, color mismatches, or artifacts appear at logo boundaries

**Output**: Final high-fidelity generated image with accurate textures AND precise brand elements

---

## Summary

This Virtual Try-On pipeline represents a carefully engineered system where each component addresses specific challenges in garment transfer:

| Component | Challenge Addressed |
|-----------|-------------------|
| **Agentic System** | Automates region detection, eliminating manual labeling |
| **Refinement Engine** | Prevents over/under-segmentation through comparative analysis |
| **Custom Segmentation** | Handles edge cases like lower-neck exposure and collar transitions |
| **Inpaint Stitcher** | Maximizes detail preservation through smart cropping |
| **Concatenation** | Enables shared latent space for accurate texture transfer |
| **Mask Processing** | Creates natural fabric flow and seamless blending |
| **FLUX Redux** | Forces generated clothing to match input garment |
| **Dual Pipeline** | Separates texture and logo optimization for best results |
| **Logo Matching** | Ensures correct logo correspondence despite detection variations |

The result is a system capable of producing photorealistic virtual try-on images that maintain fabric accuracy, natural appearance, and brand fidelity.

---

## Deployment

This system is deployed on **Modal Labs**, leveraging their serverless GPU infrastructure for scalable, production-ready inference.
