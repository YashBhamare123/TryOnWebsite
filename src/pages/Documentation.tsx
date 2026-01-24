import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Layers, Zap, Cloud, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

type ContentBlock = {
  type: "text" | "image" | "code" | "list" | "heading" | "table" | "link";
  content?: string;
  src?: string;
  alt?: string;
  caption?: string;
  items?: string[];
  language?: string;
  level?: 3 | 4;
  headers?: string[];
  rows?: string[][];
  href?: string;
  linkText?: string;
};

type Subsection = {
  id: string;
  title: string;
  content: ContentBlock[];
};

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  overview?: ContentBlock[];
  subsections: Subsection[];
};

const documentationSections: Section[] = [
  {
    id: "pipeline",
    title: "Pipeline",
    icon: <Layers className="w-6 h-6" />,
    description: "A comprehensive, production-ready pipeline for high-fidelity virtual garment try-on",
    overview: [
      {
        type: "text",
        content: "This Virtual Try-On (VTON) system solves the problem of realistically overlaying a garment image onto a subject (person) image. Unlike traditional approaches that often struggle with texture fidelity, fabric physics, and brand elements, this pipeline employs:"
      },
      {
        type: "list",
        items: [
          "Intelligent Region Detection: An AI-powered agentic system determines exactly which body parts need modification",
          "Precision Segmentation: Fine-tuned transformer models for accurate clothing and body part masks",
          "Smart Preprocessing: Zoom-crop-stitch mechanisms that preserve fine details",
          "Dual Pipeline Processing: Separate optimization paths for general appearance and logo/text accuracy"
        ]
      },
      {
        type: "code",
        language: "plaintext",
        content: `Subject Image + Garment Image
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
    Final Output`
      }
    ],
    subsections: [
      {
        id: "agentic-system",
        title: "Agentic System",
        content: [
          {
            type: "text",
            content: "The Agentic System is the brain of the pipeline. It analyzes both the subject image and the garment image to intelligently determine which body regions need to be segmented and replaced during the virtual try-on process."
          },
          {
            type: "image",
            src: "/images/agentic_system.png",
            alt: "Agentic System Architecture",
            caption: "Architecture diagram of the Agentic System showing the Description Engine, Prediction Engine, and Refinement Engine flow"
          },
          {
            type: "heading",
            level: 4,
            content: "Purpose"
          },
          {
            type: "text",
            content: "Different garments require different segmentation strategies:"
          },
          {
            type: "list",
            items: [
              "A t-shirt requires segmenting the upper body, arms, and neck area",
              "Pants require leg segmentation",
              "A dress may require full-body segmentation including both upper and lower regions",
              "Sleeveless tops expose arms differently than long-sleeve alternatives"
            ]
          },
          {
            type: "text",
            content: "The agentic system automates this decision-making process, eliminating manual intervention and ensuring accurate, context-aware segmentation."
          },
          {
            type: "heading",
            level: 4,
            content: "Implementation"
          },
          {
            type: "text",
            content: "Built using LangGraph (for orchestrating multi-step AI workflows) and powered by the Groq API (for ultra-fast inference), the system maintains a structured state that captures all relevant information:"
          },
          {
            type: "code",
            language: "python",
            content: `class State(TypedDict):
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
    errors: Annotated[list, operator.add]`
          },
          {
            type: "heading",
            level: 4,
            content: "Workflow"
          },
          {
            type: "text",
            content: "The agentic system operates through several interconnected engines:"
          },
          {
            type: "heading",
            level: 4,
            content: "1. Description Engine"
          },
          {
            type: "text",
            content: "Analyzes both input images and generates detailed textual descriptions of the subject's current clothing and pose, as well as the garment's style, type, and characteristics."
          },
          {
            type: "heading",
            level: 4,
            content: "2. Prediction Engine (Replacement Identifier)"
          },
          {
            type: "text",
            content: "Using the descriptions from the Description Engine, this engine predicts what type of clothing is being worn by the subject, what type of clothing is being applied (the garment), and which body regions will be affected by the replacement."
          },
          {
            type: "heading",
            level: 4,
            content: "3. Refinement Engine"
          },
          {
            type: "text",
            content: "The Refinement Engine exists to solve a critical problem: naive segmentation based solely on garment type often over-segments or under-segments the necessary regions, leading to subpar outputs."
          },
          {
            type: "text",
            content: "Consider this example: A subject is wearing jeans, and we want to replace them with shorts. A naive approach would segment the entire leg region because \"pants are being replaced.\" However, this creates a serious problem—shorts only cover the upper thighs, meaning the entire lower leg from knee to ankle would be unnecessarily included in the inpainting mask. The model would then attempt to regenerate skin, leg hair, and natural leg appearance for a region that doesn't need modification at all. This over-segmentation leads to artifacts, unnatural skin tones, and inconsistent results."
          },
          {
            type: "text",
            content: "The Refinement Engine solves this through three specialized exposure modules that receive the Prediction Engine's outputs and refine them based on comparative analysis:"
          },
          {
            type: "table",
            headers: ["Module", "Function", "Example"],
            rows: [
              ["Arm Exposure", "Compares sleeve lengths between subject and garment", "Long sleeves → tank top: segment arms. Tank top → long sleeves: don't segment arms (they'll be covered)"],
              ["Leg Exposure", "Compares leg coverage between subject and garment", "Jeans → shorts: only segment upper thigh area. Shorts → jeans: segment full leg for coverage"],
              ["Neck Exposure", "Compares neckline styles between subject and garment", "Crew neck → v-neck: segment lower neck. V-neck → turtleneck: no neck segmentation needed"]
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Output"
          },
          {
            type: "text",
            content: "The Refinement Engine's outputs—a set of segmentation labels (boolean flags)—are passed to the Segmentation module, indicating exactly which regions the segmentation model should target."
          }
        ]
      },
      {
        id: "segmentation",
        title: "Segmentation",
        content: [
          {
            type: "text",
            content: "The segmentation module receives the boolean segmentation labels from the Agentic System and creates pixel-precise masks for those specified regions."
          },
          {
            type: "heading",
            level: 4,
            content: "Models Used"
          },
          {
            type: "table",
            headers: ["Purpose", "Model", "Description"],
            rows: [
              ["Subject Segmentation", "SegFormer B2 (Fine-tuned)", "Custom-trained for humans wearing clothes, with enhanced lower-neck detection"],
              ["Garment Segmentation", "SegFormer B3 Clothes", "Pre-trained model optimized for isolated garment images"]
            ]
          },
          {
            type: "link",
            href: "https://huggingface.co/YashBhamare123/segformer_finetune/tree/main/segformer_b2_clothes_epoch_13",
            linkText: "Subject Segmentation Model (Fine-tuned SegFormer B2)"
          },
          {
            type: "link",
            href: "https://huggingface.co/sayeed99/segformer-b3-fashion",
            linkText: "Garment Segmentation Model (SegFormer B3 Fashion)"
          },
          {
            type: "heading",
            level: 4,
            content: "Custom Dataset Creation"
          },
          {
            type: "text",
            content: "The subject segmentation model required special training to handle the lower neck region—an area often exposed during garment transitions."
          },
          {
            type: "heading",
            level: 4,
            content: "The Lower Neck Problem"
          },
          {
            type: "text",
            content: "Different garments have vastly different collar lines and necklines. Consider this transition: a subject wearing a v-neck t-shirt tries on a buttoned collared shirt. The v-neck exposes a triangular patch of skin below the collarbone, while the collared shirt covers this area entirely (and adds a collar around the neck). Without proper lower-neck segmentation, the model would either leave the v-neck skin patch visible beneath the collared shirt (incorrect), or attempt to paint over it without proper training, resulting in artifacts."
          },
          {
            type: "text",
            content: "Other challenging transitions include:"
          },
          {
            type: "list",
            items: [
              "Crew neck → deep scoop neck: More skin becomes visible",
              "Off-shoulder → turtleneck: Shoulder area changes from exposed to covered",
              "Halter top → regular t-shirt: Neckline and shoulder coverage changes dramatically"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Dataset Creation Process"
          },
          {
            type: "list",
            items: [
              "Base Dataset: Started with an existing clothing segmentation dataset",
              "Face Detection & Exclusion: Applied YOLO to detect faces and create padded bounding boxes. This ensures the face region (which should never be modified during VTON) is properly separated from the neck region.",
              "Mask Subtraction: Subtracted the face mask region from the original labels, isolating the area between face and upper clothing.",
              "New Class Label: The remaining area became the \"lower neck\" class—a distinct segmentation target for neckline transitions."
            ]
          },
          {
            type: "link",
            href: "https://huggingface.co/datasets/YashBhamare123/human_parsing_dataset_plus_neck",
            linkText: "Custom Human Parsing Dataset (with lower-neck labels)"
          },
          {
            type: "link",
            href: "https://huggingface.co/datasets/mattmdjaga/human_parsing_dataset",
            linkText: "Original Human Parsing Dataset (base)"
          },
          {
            type: "heading",
            level: 4,
            content: "Data Augmentation Pipeline"
          },
          {
            type: "text",
            content: "To ensure the model generalizes well across varied real-world conditions, extensive augmentations were applied with synchronized RNGs ensuring identical transformations for both images and their corresponding masks:"
          },
          {
            type: "table",
            headers: ["Transform Type", "Augmentations Applied"],
            rows: [
              ["Geometric", "Perspective warping, random crops, horizontal flips"],
              ["Color", "Brightness, contrast, saturation, hue shifts"],
              ["Synchronization", "Shared random seed ensures mask pixels perfectly align with transformed image pixels"]
            ]
          },
          {
            type: "text",
            content: "The synchronized RNG is critical—without it, a perspective warp applied differently to image and mask would create misaligned training data, teaching the model incorrect region boundaries."
          },
          {
            type: "heading",
            level: 4,
            content: "Output"
          },
          {
            type: "text",
            content: "The segmentation module produces pixel-precise masks for both the subject image and garment image, which are passed to the Processing stage for preparation before inpainting."
          }
        ]
      },
      {
        id: "preprocessing",
        title: "Processing",
        content: [
          {
            type: "text",
            content: "The Processing stage receives the subject image, garment image, and their respective masks from the Segmentation module. Its job is to transform these raw inputs into an optimized format that allows the inpainting model to produce the highest quality results possible."
          },
          {
            type: "text",
            content: "Think of it this way: the segmentation stage tells us what to replace, but the processing stage determines how to present that information to the generation model. Poor preprocessing leads to wasted model capacity, visible seams, and unnatural results—no matter how powerful the underlying model is."
          },
          {
            type: "image",
            src: "/images/preprocessing.png",
            alt: "Preprocessing Architecture",
            caption: "The preprocessing pipeline showing the Cropper, Concatenation, and Mask Processing stages"
          },
          {
            type: "heading",
            level: 3,
            content: "The Inpaint Stitcher: Crop, Generate, Paste"
          },
          {
            type: "text",
            content: "One of the most important insights in this pipeline is that resolution matters immensely for detail preservation. Inpainting models have fixed input resolutions—typically 512×512 or 1024×1024 pixels. When you feed a full-body photograph to such a model, those pixels must be shared across the entire image: the face, background, legs, shoes, and the clothing you actually want to modify."
          },
          {
            type: "text",
            content: "Consider a typical scenario: you have a 2000×3000 pixel photograph of a person, and you want to replace their t-shirt. If you resize the entire image to fit the model's 1024×1024 input, the t-shirt region might only occupy 200×300 pixels of that space. The model's capacity is wasted on irrelevant areas—the background, the person's face, their jeans—while the region you care about gets only a fraction of the available resolution."
          },
          {
            type: "text",
            content: "The Inpaint Stitcher solves this through a crop-and-stitch approach that maximizes resolution where it matters."
          },
          {
            type: "heading",
            level: 4,
            content: "Cropper (Preprocessing)"
          },
          {
            type: "text",
            content: "The Cropper takes the subject image, garment image, and their masks from the Segmentation module and performs focused extraction:"
          },
          {
            type: "list",
            items: [
              "Bounding Box Detection: For each mask, it identifies the smallest rectangle that fully contains all masked pixels. This rectangle defines the \"region of interest.\"",
              "Padding Addition: The bounding box is expanded with generous padding on all sides. This padding serves two purposes: it provides the generation model with surrounding context (so it can match lighting, shadows, and colors), and it creates overlap regions that enable seamless blending later.",
              "Extraction and Resize: The padded region is extracted from the full image and scaled to the model's optimal input resolution. Now, instead of the t-shirt occupying 200 pixels of a 1024-pixel image, it might occupy 800 or more pixels—a 4× increase in effective resolution."
            ]
          },
          {
            type: "text",
            content: "The Cropper stores the bounding box coordinates for later use and outputs cropped, high-resolution versions of both the subject and garment image-mask pairs."
          },
          {
            type: "heading",
            level: 4,
            content: "Stitcher (Post-Processing)"
          },
          {
            type: "text",
            content: "After the generation model produces its output, the Stitcher reverses the cropping process:"
          },
          {
            type: "list",
            items: [
              "It receives the generated cropped image from the backbone",
              "Using the stored bounding box coordinates, it scales the result back to match the original crop region's dimensions",
              "It pastes this result into the corresponding location of the original full-resolution subject image"
            ]
          },
          {
            type: "text",
            content: "Because the Cropper added padding around the masked region, the generated content extends beyond the strict mask boundaries. This overlap means the paste operation doesn't create visible edges—the generated content and original content blend together naturally in the padded zone."
          },
          {
            type: "image",
            src: "/images/postprocessing.png",
            alt: "Postprocessing Architecture",
            caption: "The postprocessing pipeline showing how the Stitcher integrates generated content back into the original image"
          },
          {
            type: "heading",
            level: 3,
            content: "Concatenation: Shared Latent Space for Better Transfer"
          },
          {
            type: "text",
            content: "With cropped image-mask pairs ready, the next challenge is ensuring the generation model truly understands the relationship between the subject and the garment. If we process them separately or sequentially, the model has no way to directly compare textures, colors, and patterns between the two."
          },
          {
            type: "text",
            content: "The solution is concatenation: before sending inputs to the backbone, we physically combine the subject and garment inputs into a single unified tensor. The subject image sits alongside its mask, and the garment image sits alongside its mask—all in one combined input."
          },
          {
            type: "text",
            content: "This design choice has profound implications for quality:"
          },
          {
            type: "list",
            items: [
              "Shared latent space: When the model encodes this concatenated input into its latent representation, both the subject and garment exist in the same mathematical space. The model can directly attend to garment features while generating clothing on the subject.",
              "Direct texture reference: Pattern information, color values, and textural details from the garment are immediately available to the generation process. The model doesn't need to \"remember\" the garment from a previous step—it can see it right there in the input.",
              "Consistent lighting and style: Because both images are processed together, the model naturally adapts the garment's appearance to match the subject's lighting conditions, creating more realistic composites."
            ]
          },
          {
            type: "text",
            content: "The output of this stage is a concatenated image-mask tensor ready for the backbone, carrying both subject and garment information in a format optimized for generation."
          },
          {
            type: "heading",
            level: 3,
            content: "Mask Processing: Grow and Blur for Natural Results"
          },
          {
            type: "text",
            content: "The final preprocessing steps address a subtle but critical issue: real clothing doesn't have pixel-perfect boundaries."
          },
          {
            type: "text",
            content: "When a segmentation model produces a mask, it outputs a binary classification—each pixel is either \"clothing\" or \"not clothing.\" But in the real world, fabric edges are fuzzy, clothing drapes and folds create soft shadows, and the boundary between a shirt and bare skin isn't a crisp line."
          },
          {
            type: "text",
            content: "If we use the raw binary mask directly, the generation model is constrained to produce clothing that exactly fills those pixels and no more. The result looks painted on—artificially tight, with no natural flow or draping."
          },
          {
            type: "heading",
            level: 4,
            content: "Mask Growing (Dilation)"
          },
          {
            type: "text",
            content: "The first processing step expands the mask slightly beyond its original boundaries through a morphological dilation operation. This gives the generation model room to breathe:"
          },
          {
            type: "list",
            items: [
              "Loose fabrics can extend naturally beyond the strict body silhouette",
              "Clothing edges can have realistic folds and draping that extend outward",
              "The model can generate natural fabric behavior at garment boundaries (wrinkles, shadows, overlap)"
            ]
          },
          {
            type: "text",
            content: "Without dilation, a flowy blouse would be constrained to look skin-tight. With dilation, it can billow and drape as fabric naturally does."
          },
          {
            type: "heading",
            level: 4,
            content: "Mask Blurring"
          },
          {
            type: "text",
            content: "The second processing step applies Gaussian blur to the mask edges, converting the hard binary boundary into a soft gradient."
          },
          {
            type: "text",
            content: "This gradient tells the generation model: \"In the center of this region, fully replace with generated content. At the edges, gradually blend between generated and original.\" The result is:"
          },
          {
            type: "list",
            items: [
              "No visible \"cut and paste\" lines where generation meets original image",
              "Smooth color transitions at boundaries",
              "Natural integration of generated clothing with the original photograph"
            ]
          },
          {
            type: "text",
            content: "After these mask processing steps, the fully prepared concatenated image-mask tensor is ready for the FLUX Fill Backbone."
          }
        ]
      },
      {
        id: "dual-pipeline",
        title: "Dual Pipeline Overview",
        content: [
          {
            type: "text",
            content: "Before diving into the backbone architecture, it's important to understand why this system employs two separate pipelines rather than one."
          },
          {
            type: "heading",
            level: 4,
            content: "The Challenge"
          },
          {
            type: "text",
            content: "Virtual try-on requires optimizing for two fundamentally different objectives:"
          },
          {
            type: "list",
            items: [
              "Texture & Realism: Fabric folds, lighting, shadows, and natural draping",
              "Logo & Text Accuracy: Exact reproduction of brand elements, text, and graphics"
            ]
          },
          {
            type: "text",
            content: "These objectives often conflict. When a single model tries to optimize for both simultaneously, it typically compromises on one:"
          },
          {
            type: "list",
            items: [
              "Prioritizing texture leads to blurry or distorted logos",
              "Prioritizing logos leads to unnatural fabric appearance"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "The Solution"
          },
          {
            type: "text",
            content: "We split the generation into two sequential pipelines:"
          },
          {
            type: "table",
            headers: ["Pipeline", "Objective", "Focus"],
            rows: [
              ["Initial Pipeline", "Generate realistic garment with natural texture and fit", "Global appearance, fabric physics, lighting"],
              ["Logo Pipeline", "Refine brand elements and text", "Local detail accuracy, text sharpness"]
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Shared Backbone"
          },
          {
            type: "text",
            content: "Both pipelines share the same FLUX Fill backbone architecture. They differ only in their configuration (LoRA weights, processing steps). Understanding the backbone is therefore essential before exploring how each pipeline utilizes it."
          }
        ]
      },
      {
        id: "flux-backbone",
        title: "FLUX Fill Backbone",
        content: [
          {
            type: "text",
            content: "At the core of both pipelines sits the FLUX Fill model—a state-of-the-art inpainting architecture optimized for high-fidelity image generation."
          },
          {
            type: "image",
            src: "/images/fill_backbone.png",
            alt: "FLUX Fill Backbone Architecture",
            caption: "The FLUX Fill backbone showing Dual CLIP conditioning, FLUX Redux adapter, and the Fill Model components"
          },
          {
            type: "heading",
            level: 4,
            content: "Inputs"
          },
          {
            type: "text",
            content: "The backbone receives processed image & mask pairs from the Processing stage (concatenated subject and garment), text conditioning from the Dual CLIP Loader, and image conditioning from FLUX Redux."
          },
          {
            type: "heading",
            level: 3,
            content: "Conditioning Signal Generation"
          },
          {
            type: "text",
            content: "The backbone requires rich conditioning signals to guide generation. These come from two sources:"
          },
          {
            type: "heading",
            level: 4,
            content: "1. Dual CLIP Loader (Text Conditioning)"
          },
          {
            type: "text",
            content: "Text prompts describing the desired output are processed through a dual encoder architecture:"
          },
          {
            type: "table",
            headers: ["Encoder", "Purpose"],
            rows: [
              ["T5-XXL", "Captures detailed semantic meaning and complex descriptions"],
              ["ViT Detail", "Focuses on visual-specific textual concepts"]
            ]
          },
          {
            type: "text",
            content: "Why dual encoding? Different aspects of text prompts (semantic meaning vs. visual concepts) are better captured by different architectures. The combination provides richer, more complete conditioning."
          },
          {
            type: "heading",
            level: 4,
            content: "2. FLUX Redux with SigLip (Image Conditioning)"
          },
          {
            type: "text",
            content: "FLUX Redux is an adapter that sits before the FLUX Fill model. It is specifically trained to force the generation model to produce images that closely match a conditioning image—making it perfect for virtual try-on where the generated clothing must match the input garment exactly."
          },
          {
            type: "text",
            content: "How it works:"
          },
          {
            type: "list",
            items: [
              "The garment image is passed through the SigLip Image Embedder",
              "SigLip generates rich visual embeddings that capture the garment's appearance characteristics",
              "FLUX Redux takes these embeddings and converts them into conditioning signals specifically designed to constrain the model's output",
              "The result is that FLUX Fill is forced to generate images that preserve the garment's exact appearance"
            ]
          },
          {
            type: "text",
            content: "Key distinction: SigLip creates the embeddings (the representation of the garment), but it is FLUX Redux's training that enforces the similarity constraint. Redux was trained with the explicit objective of making outputs match conditioning inputs."
          },
          {
            type: "heading",
            level: 3,
            content: "Fill Model Components"
          },
          {
            type: "text",
            content: "The FLUX Fill model itself incorporates several optimization and enhancement modules:"
          },
          {
            type: "table",
            headers: ["Component", "Function"],
            rows: [
              ["Compilation", "Optimizes the model graph for faster inference"],
              ["Quantization", "Reduces precision for memory efficiency without quality loss"],
              ["TeaCache", "Caches intermediate computations for faster generation"],
              ["Custom Loader", "Handles model weights and initialization"],
              ["ACE++ LoRA", "Subject-consistency adapter (enabled for logo pipeline only)"],
              ["LoRA HotSwap", "Enables dynamic switching between LoRA weights"]
            ]
          },
          {
            type: "link",
            href: "https://huggingface.co/black-forest-labs/FLUX.1-Redux-dev/tree/main",
            linkText: "FLUX Redux Adapter (Image Conditioning)"
          },
          {
            type: "link",
            href: "https://huggingface.co/ali-vilab/ACE_Plus/blob/main/subject/comfyui_subject_lora16.safetensors",
            linkText: "ACE++ Subject LoRA (Subject Consistency)"
          },
          {
            type: "heading",
            level: 4,
            content: "Output"
          },
          {
            type: "text",
            content: "The backbone produces a generated image that is passed to either the Stitcher for integration back into the original subject image (Initial Pipeline), or the Logo Detection module for brand element analysis (before Logo Pipeline)."
          }
        ]
      },
      {
        id: "initial-pipeline",
        title: "Initial Pipeline",
        content: [
          {
            type: "text",
            content: "Objective: Generate a photorealistic image with accurate fabric textures, natural folds, and realistic lighting."
          },
          {
            type: "heading",
            level: 4,
            content: "Inputs"
          },
          {
            type: "list",
            items: [
              "Processed concatenated image & mask pairs from Processing stage",
              "Text conditioning from Dual CLIP",
              "Image conditioning from FLUX Redux"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Configuration"
          },
          {
            type: "list",
            items: [
              "FLUX Fill backbone",
              "Texture-focused LoRA weights",
              "ACE++ LoRA: Disabled (to allow creative fabric generation without over-constraining)"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Process"
          },
          {
            type: "list",
            items: [
              "Receive processed inputs from the Processing stage",
              "Generate conditioned output through the backbone",
              "Deconcatenate the result to separate subject from garment",
              "Apply Stitcher to paste generated region back into original subject image"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Output"
          },
          {
            type: "text",
            content: "Intermediate generated image → passed to Logo Detection"
          }
        ]
      },
      {
        id: "logo-detection",
        title: "Logo Detection & Matching",
        content: [
          {
            type: "text",
            content: "Before the second pipeline can operate, we need to detect and match logos between the generated image and the original garment."
          },
          {
            type: "image",
            src: "/images/logo.png",
            alt: "Logo Detection Architecture",
            caption: "Logo detection and matching pipeline using OWL-ViT for detection and ResNet-50 for similarity matching"
          },
          {
            type: "heading",
            level: 4,
            content: "Why Logo Detection is Necessary"
          },
          {
            type: "text",
            content: "The Initial Pipeline prioritizes overall realism over exact logo reproduction. During generation, brand logos and text often become slightly blurred, distorted, or lose fine details. Additionally, we need to locate exactly where these logos appear in the generated image for targeted refinement."
          },
          {
            type: "heading",
            level: 4,
            content: "The Detection Process"
          },
          {
            type: "text",
            content: "The OWL-ViT (Vision Transformer for Open-World Localization) detector scans both images:"
          },
          {
            type: "list",
            items: [
              "Generated Image (from Initial Pipeline): Identifies where logos appear in the result",
              "Original Garment Image: Identifies the source logos that should be matched"
            ]
          },
          {
            type: "text",
            content: "Bypass condition: If OWL-ViT detects zero logos in the garment image, the second pipeline is skipped entirely. This saves computation when processing garments without brand elements."
          },
          {
            type: "heading",
            level: 4,
            content: "The Matching Challenge"
          },
          {
            type: "text",
            content: "A critical challenge arises: the number of detected logos often differs between images. This happens for several reasons:"
          },
          {
            type: "list",
            items: [
              "Lost logos: The generation model might not perfectly reproduce smaller or less prominent logos",
              "Hidden regions: Parts of the garment visible in isolation become hidden when worn (e.g., logos on the back, logos hidden by hair or behind the neck)",
              "False positives: Either detector might identify non-logo regions as logos"
            ]
          },
          {
            type: "text",
            content: "Simply assuming a 1:1 correspondence would lead to incorrect refinement—pasting the wrong logo into the wrong location."
          },
          {
            type: "heading",
            level: 4,
            content: "Similarity-Based Matching"
          },
          {
            type: "text",
            content: "To solve this, we employ ResNet-50 as a similarity engine:"
          },
          {
            type: "list",
            items: [
              "Extract embeddings for each detected logo in the generated image (Subject Logo Stack)",
              "Extract embeddings for each detected logo in the garment image (Garment Logo Stack)",
              "Compute pairwise similarity scores between all logo pairs",
              "For each generated logo, find its closest match from the garment logos",
              "Discard unmatched logos (either false positives or logos from hidden regions)"
            ]
          },
          {
            type: "text",
            content: "This ensures that only valid, well-matched logos proceed to refinement, preventing artifacts from mismatched logo pasting."
          },
          {
            type: "heading",
            level: 4,
            content: "Efficient Batching"
          },
          {
            type: "text",
            content: "Matched logos are prepared for efficient processing:"
          },
          {
            type: "list",
            items: [
              "Resize: All logos scaled to consistent dimensions",
              "Concatenate: Logos arranged into a batch tensor",
              "Single Forward Pass: The entire batch processed through the backbone together"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Output"
          },
          {
            type: "text",
            content: "Batched logo pairs ready for the Second Pipeline"
          }
        ]
      },
      {
        id: "logo-pipeline",
        title: "Logo Refinement Pipeline",
        content: [
          {
            type: "text",
            content: "Objective: Ensure any logos, text, or brand elements from the garment appear accurately in the final output."
          },
          {
            type: "heading",
            level: 4,
            content: "Inputs"
          },
          {
            type: "list",
            items: [
              "Batched logo pairs from Logo Detection & Matching",
              "Original garment logos as reference",
              "Text conditioning from Dual CLIP",
              "Image conditioning from FLUX Redux"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Configuration"
          },
          {
            type: "list",
            items: [
              "FLUX Fill backbone (same as Initial Pipeline)",
              "ACE++ LoRA: Enabled (for strong subject consistency and accurate reproduction)"
            ]
          },
          {
            type: "text",
            content: "ACE++ LoRA is specifically renowned for maintaining image consistency in diffusion models. By enabling it here, we force the model to reproduce logos with high fidelity to the original garment."
          },
          {
            type: "heading",
            level: 4,
            content: "Process"
          },
          {
            type: "list",
            items: [
              "Receive batched logo pairs from detection and matching",
              "Process through backbone with ACE++ LoRA enabled",
              "Generate refined logo regions with improved clarity and accuracy"
            ]
          },
          {
            type: "heading",
            level: 4,
            content: "Output"
          },
          {
            type: "text",
            content: "Refined logo images → passed to Logo Integration"
          },
          {
            type: "heading",
            level: 3,
            content: "Logo Integration"
          },
          {
            type: "text",
            content: "The final step seamlessly integrates refined logos back into the main image:"
          },
          {
            type: "list",
            items: [
              "Each refined logo is retrieved from the batch",
              "Using the stored bounding box coordinates from detection, logos are positioned correctly",
              "Because detection included padding around each logo, pasting creates smooth transitions",
              "No visible edges, color mismatches, or artifacts appear at logo boundaries"
            ]
          },
          {
            type: "text",
            content: "Output: Final high-fidelity generated image with accurate textures AND precise brand elements"
          }
        ]
      },
      {
        id: "summary",
        title: "Summary",
        content: [
          {
            type: "text",
            content: "This Virtual Try-On pipeline represents a carefully engineered system where each component addresses specific challenges in garment transfer:"
          },
          {
            type: "table",
            headers: ["Component", "Challenge Addressed"],
            rows: [
              ["Agentic System", "Automates region detection, eliminating manual labeling"],
              ["Refinement Engine", "Prevents over/under-segmentation through comparative analysis"],
              ["Custom Segmentation", "Handles edge cases like lower-neck exposure and collar transitions"],
              ["Inpaint Stitcher", "Maximizes detail preservation through smart cropping"],
              ["Concatenation", "Enables shared latent space for accurate texture transfer"],
              ["Mask Processing", "Creates natural fabric flow and seamless blending"],
              ["FLUX Redux", "Forces generated clothing to match input garment"],
              ["Dual Pipeline", "Separates texture and logo optimization for best results"],
              ["Logo Matching", "Ensures correct logo correspondence despite detection variations"]
            ]
          },
          {
            type: "text",
            content: "The result is a system capable of producing photorealistic virtual try-on images that maintain fabric accuracy, natural appearance, and brand fidelity."
          },
          {
            type: "heading",
            level: 4,
            content: "Deployment"
          },
          {
            type: "text",
            content: "This system is deployed on Modal Labs, leveraging their serverless GPU infrastructure for scalable, production-ready inference."
          }
        ]
      }
    ],
  },
  {
    id: "optimization",
    title: "Optimizations",
    icon: <Zap className="w-6 h-6" />,
    description: "Performance optimizations for cold-start latency, VRAM efficiency, and inference speed",
    overview: [
      {
        type: "text",
        content: "The Virtual Try-On pipeline is deployed in a serverless GPU environment where computational resources are provisioned on-demand. With limited GPU capacity and variable user traffic throughout the day, usage patterns tend to be sparse—periods of high activity interspersed with idle windows. This means containers are frequently spun down during quiet periods and spun up fresh when new requests arrive, resulting in many users experiencing cold starts rather than hitting warm, ready-to-serve instances."
      },
      {
        type: "text",
        content: "Cold start latency compounds across every component: model weights must be loaded from storage, computation graphs compiled, and memory allocated before the first inference can begin. Without optimization, users face wait times exceeding a minute before seeing results—an unacceptable experience for a production system."
      },
      {
        type: "table",
        headers: ["Challenge", "Impact"],
        rows: [
          ["Cold Start Latency", "Users wait for model loading and compilation before first inference"],
          ["VRAM Consumption", "Limits model size and batch capacity on constrained hardware"],
          ["Inference Speed", "Affects throughput and end-to-end response time"]
        ]
      },
      {
        type: "text",
        content: "Each optimization targets one or more of these challenges, and together they transform a slow, resource-hungry pipeline into an efficient production system."
      }
    ],
    subsections: [
      {
        id: "safetensors",
        title: "Safetensors Loading",
        content: [
          {
            type: "text",
            content: "Model weight files traditionally use Python's pickle-based formats (.bin, .pt), which require sequential deserialization and full memory loading before GPU transfer. In a cold start scenario, this adds significant latency as gigabytes of weights are processed through Python's object reconstruction."
          },
          {
            type: "text",
            content: "We use safetensors format for all model weight files, which enables memory-mapped loading. The GPU can stream weights directly from disk without fully materializing them in CPU RAM first—a technique that dramatically reduces initialization time."
          },
          {
            type: "table",
            headers: ["Aspect", "Pickle Format", "Safetensors"],
            rows: [
              ["Loading Speed", "Slow (sequential)", "Fast (memory-mapped)"],
              ["Memory Usage", "Full file in RAM", "Zero-copy loading"],
              ["Security", "Arbitrary code execution risk", "Safe, no code execution"],
              ["Cold Start Impact", "Significant latency", "Minimal latency"]
            ]
          },
          {
            type: "text",
            content: "Beyond performance, safetensors eliminates the security vulnerabilities inherent in pickle files, which can execute arbitrary code during deserialization."
          }
        ]
      },
      {
        id: "text-embedder-cache",
        title: "Text Embedder Cache",
        content: [
          {
            type: "text",
            content: "The standard FLUX pipeline includes a text encoder stack (T5-XXL + CLIP) consuming approximately 7.8 GB of VRAM. During extensive testing, we discovered that most of the conditioning signal for virtual try-on comes from FLUX Redux (image conditioning), not the text embedder. The text encoder's role is limited to providing general task context—essentially telling the model \"this is a garment inpainting task.\""
          },
          {
            type: "text",
            content: "Since our prompts are static and task-specific, we pre-compute the text embeddings offline, cache them as safetensors files, and remove the text encoder entirely from the runtime pipeline. This straightforward change eliminates a massive memory footprint without impacting output quality."
          },
          {
            type: "table",
            headers: ["Metric", "Before", "After"],
            rows: [
              ["VRAM Usage", "+7.8 GB for T5-XXL + CLIP", "0 GB (cached embeddings only)"],
              ["Cold Start", "Load 7.8 GB of encoder weights", "Load ~50 MB of cached embeddings"],
              ["Runtime", "Encode prompts on every request", "Direct embedding lookup"]
            ]
          },
          {
            type: "text",
            content: "This single optimization saves approximately 7.8 GB of VRAM, freeing capacity for larger batch sizes or higher resolution processing."
          }
        ]
      },
      {
        id: "custom-loader",
        title: "Custom Pipeline Loader",
        content: [
          {
            type: "text",
            content: "Standard Diffusers pipeline loaders assume a complete model stack: transformer backbone, VAE, text encoders, and tokenizers. When using cached text embeddings, loading the full stack wastes resources and time on components that will never be used."
          },
          {
            type: "text",
            content: "We implement a custom loader that constructs the FLUX Fill pipeline with only the required components:"
          },
          {
            type: "link",
            href: "https://github.com/YashBhamare123/TryOnPort/blob/main/main.py",
            linkText: "View source: main.py"
          },
          {
            type: "code",
            language: "python",
            content: `def _load_components(self, input : dict):
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
            return {subfolder : None}`
          },
          {
            type: "table",
            headers: ["Component", "Standard Loader", "Custom Loader"],
            rows: [
              ["Transformer", "✓", "✓"],
              ["VAE", "✓", "✓"],
              ["T5-XXL Encoder", "✓", "✗"],
              ["CLIP Encoder", "✓", "✗"],
              ["Tokenizers", "✓", "✗"],
              ["Cached Embeddings", "✗", "✓"]
            ]
          },
          {
            type: "text",
            content: "The result is faster initialization and reduced memory footprint by avoiding unnecessary component instantiation."
          }
        ]
      },
      {
        id: "flash-attention",
        title: "Flash Attention",
        content: [
          {
            type: "text",
            content: "Attention computation is the primary bottleneck in transformer-based diffusion models. We leverage Scaled Dot-Product Attention (SDPA)—PyTorch's built-in optimized attention implementation that automatically selects the most efficient kernel for the current hardware and input characteristics."
          },
          {
            type: "table",
            headers: ["Metric", "Standard Attention", "SDPA"],
            rows: [
              ["Memory Scaling", "O(n²)", "O(n) with memory-efficient mode"],
              ["Speed", "Baseline", "2-4× faster on modern GPUs"],
              ["Implementation", "Manual", "Automatic in Diffusers"]
            ]
          },
          {
            type: "text",
            content: "Diffusers automatically uses SDPA when available (PyTorch 2.0+), providing memory-efficient attention for long sequences and Flash Attention kernels on compatible hardware with zero configuration required."
          }
        ]
      },
      {
        id: "fp8-quantization",
        title: "FP8 Quantization",
        content: [
          {
            type: "text",
            content: "The FLUX Fill transformer backbone contains billions of parameters, each stored as FP16 (2 bytes) or FP32 (4 bytes). This creates a large VRAM footprint, slow weight loading, and memory bandwidth bottlenecks during inference."
          },
          {
            type: "text",
            content: "We employ FP8 quantization for the transformer backbone, reducing precision from 16-bit to 8-bit floating point. The iterative denoising process in diffusion models is inherently robust to small precision errors—each step corrects minor deviations from the previous step. The final output is visually indistinguishable from FP16 inference."
          },
          {
            type: "table",
            headers: ["Aspect", "FP16", "FP8"],
            rows: [
              ["Memory per Parameter", "2 bytes", "1 byte"],
              ["VRAM Reduction", "Baseline", "~50% reduction"],
              ["Load Speed", "Baseline", "~2× faster"],
              ["Quality Impact", "Full precision", "Negligible loss"]
            ]
          },
          {
            type: "text",
            content: "This optimization roughly halves the transformer's memory footprint while providing faster weight loading."
          }
        ]
      },
      {
        id: "regional-compilation",
        title: "Regional Compilation",
        content: [
          {
            type: "text",
            content: "PyTorch's torch.compile() with the Inductor backend provides significant inference speedups, but introduces substantial compilation overhead—typically 50-60 seconds with default settings. In a serverless environment where many users hit cold containers due to sparse usage patterns, full compilation is counterproductive. Users would wait a full minute before inference even begins."
          },
          {
            type: "text",
            content: "The FLUX Fill transformer consists of 19 Double-Stream Blocks (cross-attention between text and image) and 38 Single-Stream Blocks (self-attention processing). All blocks within each category share identical architecture. Once one block is compiled, its optimized kernels can be reused across all similar blocks."
          },
          {
            type: "text",
            content: "Instead of compiling the entire model, we selectively compile only the first Double-Stream Block (cache reused by remaining 18 blocks) and the first Single-Stream Block (cache reused by remaining 37 blocks):"
          },
          {
            type: "link",
            href: "https://github.com/YashBhamare123/TryOnPort/blob/main/main.py",
            linkText: "View source: main.py"
          },
          {
            type: "code",
            language: "python",
            content: `if params.compile_repeated:
    pipe.transformer.single_transformer_blocks = nn.ModuleList([
        torch.compile(block) for block in pipe.transformer.single_transformer_blocks
    ])

    pipe.transformer.transformer_blocks = nn.ModuleList([
        torch.compile(block) for block in pipe.transformer.transformer_blocks
    ])`
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌─────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────┘`
          },
          {
            type: "table",
            headers: ["Metric", "Full Compilation", "Regional Compilation"],
            rows: [
              ["Compile Time", "50-60 seconds", "~9 seconds"],
              ["Inference Speed", "Optimized", "Identical (cache reuse)"],
              ["Cold Start Total", "60+ seconds", "~15 seconds"]
            ]
          },
          {
            type: "text",
            content: "This 6× reduction in compilation time makes serverless deployment practical without sacrificing inference performance."
          }
        ]
      },
      {
        id: "lora-hotswapping",
        title: "LoRA Hotswapping",
        content: [
          {
            type: "text",
            content: "The dual-pipeline architecture uses different LoRA adapters for different purposes: a realism LoRA for the Initial Pipeline and ACE++ LoRA for subject consistency in the Logo Pipeline. Normally, switching LoRAs between pipelines would invalidate PyTorch's compilation cache, triggering full recompilation and negating all regional compilation benefits."
          },
          {
            type: "text",
            content: "We use PyTorch's LoRA Hotswapping mechanism, which compiles the model with a maximum LoRA rank parameter. This allocates weight buffers sized for the maximum rank, allowing any LoRA with rank ≤ max_rank to be swapped instantly without recompilation."
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌─────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────┘`
          },
          {
            type: "table",
            headers: ["Scenario", "Without Hotswapping", "With Hotswapping"],
            rows: [
              ["First LoRA", "9 seconds (regional compile)", "9 seconds"],
              ["Second LoRA", "9 seconds (recompile)", "<1 second (weight copy)"],
              ["Total for both", "18 seconds", "~10 seconds"]
            ]
          }
        ]
      },
      {
        id: "teacache",
        title: "TeaCache",
        content: [
          {
            type: "text",
            content: "Diffusion models generate images through iterative denoising—typically 20-50 steps. At each step, the full transformer forward pass executes. However, adjacent timesteps often produce highly similar intermediate outputs, meaning much computation is redundant."
          },
          {
            type: "text",
            content: "TeaCache (Timestep Embedding Aware Cache) is a training-free caching optimization that monitors how much intermediate outputs change between timesteps. When changes are small, it reuses cached outputs instead of recomputing, dynamically deciding when to cache vs. compute based on timestep embeddings."
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌─────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────┘`
          },
          {
            type: "text",
            content: "We implement TeaCache in Diffusers by overriding the transformer's forward pass. Before each forward pass, the system estimates output similarity to the previous step. If the estimated change is below threshold, it returns the cached output; otherwise, it computes a new output and updates the cache."
          },
          {
            type: "link",
            href: "https://github.com/YashBhamare123/TryOnPort/blob/main/sampling/teacache.py",
            linkText: "View source: sampling/teacache.py"
          },
          {
            type: "code",
            language: "python",
            content: `if self.enable_teacache:
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
        hidden_states += self.previous_residual`
          },
          {
            type: "table",
            headers: ["Metric", "Standard Diffusion", "With TeaCache"],
            rows: [
              ["Forward Passes", "25 (all steps)", "~18-20 (20-30% cached)"],
              ["Inference Time", "Baseline", "~20-30% faster"],
              ["Quality Impact", "Full quality", "Minimal perceptual difference"]
            ]
          },
          {
            type: "text",
            content: "TeaCache provides meaningful inference speedups with negligible quality degradation—a key optimization for production throughput."
          }
        ]
      },
      {
        id: "batched-logo-inference",
        title: "Batched Logo Inference",
        content: [
          {
            type: "text",
            content: "The Logo Pipeline processes multiple detected logos per garment. Processing each logo individually wastes GPU parallelism, incurs repeated kernel launch overhead, and leaves compute resources underutilized."
          },
          {
            type: "text",
            content: "Detected and matched logo pairs are resized to consistent dimensions, stacked into a batch tensor, and processed in a single forward pass:"
          },
          {
            type: "link",
            href: "https://github.com/YashBhamare123/TryOnPort/blob/main/Logo/processing.py",
            linkText: "View source: Logo/processing.py"
          },
          {
            type: "code",
            language: "python",
            content: `# Resize all cropped logos to uniform dimensions
final_resizer = Resize((min_height, min_width), antialias=True)

final_images, final_masks = [], []
for img, msk in zip(intermediate_images, intermediate_masks):
    final_images.append(final_resizer(img))
    final_masks.append(final_resizer(msk))

# Stack into batch tensors for single forward pass
batched_images = torch.stack(final_images)
batched_masks = torch.stack(final_masks)

final_image_tensor = batched_images.to(self.device, self.dtype)
final_mask_tensor = batched_masks.to(self.device, self.dtype)`
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌─────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────┘`
          },
          {
            type: "table",
            headers: ["Logos Detected", "Individual Processing", "Batched Processing"],
            rows: [
              ["1 logo", "1× forward pass", "1× forward pass"],
              ["3 logos", "3× forward pass", "1× forward pass"],
              ["5 logos", "5× forward pass", "1× forward pass"]
            ]
          },
          {
            type: "text",
            content: "GPU utilization improves significantly when processing garments with multiple brand elements."
          }
        ]
      },
      {
        id: "optimization-summary",
        title: "Summary",
        content: [
          {
            type: "text",
            content: "These optimizations work together as a cohesive system, each addressing different aspects of production inference:"
          },
          {
            type: "table",
            headers: ["Optimization", "Primary Benefit", "Impact"],
            rows: [
              ["Safetensors", "Cold start latency", "Memory-mapped loading, faster init"],
              ["Text Embedder Cache", "VRAM reduction", "7.8 GB savings"],
              ["Custom Loader", "Resource efficiency", "Load only required components"],
              ["Flash Attention (SDPA)", "Inference speed", "2-4× attention speedup"],
              ["FP8 Quantization", "VRAM + speed", "50% memory reduction"],
              ["Regional Compilation", "Cold start latency", "50s → 9s compile time"],
              ["LoRA Hotswapping", "Pipeline switching", "Avoid recompilation on LoRA swap"],
              ["TeaCache", "Inference speed", "20-30% faster generation"],
              ["Batched Logo Inference", "Throughput", "Parallel logo processing"]
            ]
          },
          {
            type: "text",
            content: "Together, these optimizations enable production-grade virtual try-on inference with fast cold starts, efficient resource usage, and high throughput—all without sacrificing output quality."
          },
          {
            type: "heading",
            level: 4,
            content: "Deployment"
          },
          {
            type: "text",
            content: "This optimized system is deployed on Modal Labs, leveraging their serverless GPU infrastructure. The cold-start optimizations are specifically designed for this environment, where sparse usage patterns mean many users hit freshly-provisioned containers rather than warm instances."
          }
        ]
      }
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    icon: <Cloud className="w-6 h-6" />,
    description: "Infrastructure and deployment strategies for scalable serving",
    overview: [
      {
        type: "text",
        content: "The Virtual Try-On system is deployed as a distributed cloud-native application, designed for scalability, reliability, and low latency. The architecture separates concerns across multiple specialized services."
      },
      {
        type: "table",
        headers: ["Layer", "Technology", "Purpose"],
        rows: [
          ["Frontend", "Next.js on Vercel", "User interface and interaction"],
          ["API Gateway", "FastAPI on Modal", "Request routing and orchestration"],
          ["Inference", "Modal Workers", "GPU-accelerated image generation"],
          ["User Database", "MongoDB Atlas", "User data and session management"],
          ["Image Storage", "Cloudinary", "Image hosting and CDN delivery"]
        ]
      },
      {
        type: "text",
        content: "This separation allows each component to scale independently based on demand—the compute-intensive inference layer can scale GPU resources while the lightweight frontend handles concurrent users efficiently."
      },
      {
        type: "image",
        src: "/images/deployment_architecture.png",
        alt: "Deployment Architecture Diagram",
        caption: "Complete deployment architecture showing the data flow from user browser through inference and back"
      }
    ],
    subsections: [
      {
        id: "user-interface",
        title: "User Interface Layer",
        content: [
          {
            type: "text",
            content: "The entry point for all user interactions. Users access the application through a modern web browser where they can upload subject images, select garment images, view generated try-on results, and manage their session history."
          },
          {
            type: "text",
            content: "The browser renders the Next.js application and handles local image selection before upload. All communication with backend services occurs over HTTPS for security."
          }
        ]
      },
      {
        id: "nextjs-vercel",
        title: "Next.js on Vercel",
        content: [
          {
            type: "text",
            content: "The frontend is built with Next.js, a React framework that provides server-side rendering, API routes, and optimized performance out of the box."
          },
          {
            type: "table",
            headers: ["Feature", "Benefit"],
            rows: [
              ["Server-Side Rendering", "Fast initial page loads and SEO optimization"],
              ["API Routes", "Secure backend communication through server functions"],
              ["Edge Network", "Global CDN distribution for low-latency asset delivery"],
              ["Automatic Scaling", "Handles traffic spikes without manual intervention"]
            ]
          },
          {
            type: "text",
            content: "Next.js was chosen for production-ready UI with full control over design and branding, optimized bundle splitting and lazy loading, seamless integration with Vercel's deployment platform, and custom authentication, routing, and state management."
          },
          {
            type: "heading",
            level: 4,
            content: "Vercel Deployment"
          },
          {
            type: "text",
            content: "The Next.js application is deployed on Vercel, providing zero-configuration deployment where Git push triggers automatic builds. Every PR gets a unique preview URL for testing, server-side logic runs close to users globally via Edge Functions, and built-in analytics provide performance monitoring."
          }
        ]
      },
      {
        id: "fastapi-modal",
        title: "FastAPI on Modal",
        content: [
          {
            type: "text",
            content: "The API layer is built with FastAPI, a modern Python web framework, deployed on Modal as an ASGI application."
          },
          {
            type: "table",
            headers: ["Component", "Description"],
            rows: [
              ["FastAPI", "High-performance async Python framework"],
              ["Modal ASGI", "Serverless deployment with automatic scaling"],
              ["Public Endpoint", "HTTPS endpoint accessible from the frontend"]
            ]
          },
          {
            type: "text",
            content: "FastAPI provides async support for non-blocking I/O, automatic OpenAPI/Swagger documentation, Pydantic models for request/response validation, and is one of the fastest Python web frameworks available."
          },
          {
            type: "heading",
            level: 4,
            content: "Request Handling"
          },
          {
            type: "text",
            content: "The FastAPI gateway receives requests from the Next.js frontend and validates incoming request data, authenticates the request if required, makes internal calls to the inference worker, and returns the generated result to the frontend."
          },
          {
            type: "text",
            content: "The separation between the API gateway and inference worker allows the gateway to remain responsive while GPU-intensive work happens in dedicated workers."
          }
        ]
      },
      {
        id: "modal-workers",
        title: "Modal GPU Workers",
        content: [
          {
            type: "text",
            content: "The core inference logic runs on Modal Workers equipped with GPU acceleration. This is where the actual virtual try-on generation occurs."
          },
          {
            type: "table",
            headers: ["Specification", "Configuration"],
            rows: [
              ["GPU", "NVIDIA A100 / H100"],
              ["Framework", "PyTorch with Diffusers"],
              ["Scaling", "Auto-scaling based on queue depth"],
              ["Cold Start", "Optimized with regional compilation"]
            ]
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌───────────────────────────────────────────────────────────────────┐
│ MODAL WORKER                                                      │
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   Fetch     │ -> │  Inference  │ -> │   Upload    │            │
│  │   Images    │    │   Pipeline  │    │   Result    │            │
│  └─────────────┘    └─────────────┘    └─────────────┘            │
│        │                  │                  │                    │
│        ▼                  ▼                  ▼                    │
│   Cloudinary         GPU Compute        Cloudinary                │
└───────────────────────────────────────────────────────────────────┘`
          },
          {
            type: "heading",
            level: 4,
            content: "Internal Call Mechanism"
          },
          {
            type: "text",
            content: "The FastAPI gateway makes internal calls to the inference worker. This internal communication bypasses public networking overhead, runs within Modal's private network, enables efficient data transfer between services, and supports automatic retry and error handling."
          },
          {
            type: "text",
            content: "When a worker receives an inference request, it fetches the subject and garment images directly from Cloudinary using HTTPS, reducing data transfer through the API gateway and leveraging Cloudinary's CDN for fast image retrieval."
          }
        ]
      },
      {
        id: "mongodb-atlas",
        title: "MongoDB Atlas",
        content: [
          {
            type: "text",
            content: "MongoDB Atlas serves as the primary database for user data and application state."
          },
          {
            type: "table",
            headers: ["Use Case", "Data Stored"],
            rows: [
              ["User Profiles", "Account information, preferences"],
              ["Usage Metrics", "Request counts, timestamps"],
              ["Authentication", "User credentials, tokens"]
            ]
          },
          {
            type: "text",
            content: "MongoDB Atlas was chosen as a managed service requiring no database administration, with global clusters for multi-region deployment and low latency. The flexible document model adapts to changing requirements, and automatic sharding enables horizontal scaling."
          },
          {
            type: "text",
            content: "The frontend communicates with MongoDB Atlas over HTTPS for user authentication and session management."
          }
        ]
      },
      {
        id: "cloudinary",
        title: "Cloudinary",
        content: [
          {
            type: "text",
            content: "Cloudinary serves as the image storage and delivery platform, handling both input images and generated outputs."
          },
          {
            type: "table",
            headers: ["Function", "Description"],
            rows: [
              ["Image Upload", "Users upload subject/garment images"],
              ["Image Storage", "Persistent storage for all images"],
              ["CDN Delivery", "Fast global delivery of images"],
              ["Transformations", "On-the-fly image resizing and optimization"]
            ]
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌───────────────────────────────────────────────────────────────────┐
│ IMAGE LIFECYCLE                                                   │
│                                                                   │
│  User Upload ──► Cloudinary ──► Worker Fetch ──► Inference        │
│                      │                              │             │
│                      │                              ▼             │
│  User Display ◄── CDN Delivery ◄── Output Upload ◄──┘             │
└───────────────────────────────────────────────────────────────────┘`
          },
          {
            type: "text",
            content: "Cloudinary provides optimized delivery with automatic format selection (WebP, AVIF) based on browser, global CDN with edge locations worldwide, on-the-fly transformations without storing multiple versions, and secure direct upload from browser without passing through backend."
          }
        ]
      },
      {
        id: "request-flow",
        title: "Request Flow",
        content: [
          {
            type: "text",
            content: "The complete request flow for a virtual try-on generation follows these steps:"
          },
          {
            type: "list",
            items: [
              "User Initiates Request: The user selects subject and garment images in their browser",
              "Image Upload: Images are uploaded directly to Cloudinary, which returns URLs",
              "API Request: The frontend sends an HTTPS request to the FastAPI gateway on Modal",
              "Worker Dispatch: The FastAPI gateway makes an internal call to a Modal worker",
              "Inference Execution: The worker fetches images from Cloudinary and runs the pipeline",
              "Result Storage: The worker uploads the generated image to Cloudinary",
              "Response Delivery: The result URL flows back through the gateway to the frontend"
            ]
          },
          {
            type: "code",
            language: "plaintext",
            content: `┌───────────────────────────────────────────────────────────────────┐
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
└───────────────────────────────────────────────────────────────────┘`
          }
        ]
      },
      {
        id: "deployment-summary",
        title: "Summary",
        content: [
          {
            type: "text",
            content: "The Virtual Try-On deployment architecture leverages best-in-class cloud services for each layer of the stack:"
          },
          {
            type: "table",
            headers: ["Component", "Technology", "Key Benefit"],
            rows: [
              ["Frontend", "Next.js + Vercel", "Global edge delivery, zero-config deploys"],
              ["API Gateway", "FastAPI + Modal", "Async handling, automatic scaling"],
              ["Inference", "Modal Workers", "GPU access, cold-start optimization"],
              ["User Database", "MongoDB Atlas", "Managed, globally distributed"],
              ["Image Storage", "Cloudinary", "CDN delivery, on-the-fly transforms"]
            ]
          },
          {
            type: "text",
            content: "This architecture provides scalability where each layer scales independently, performance through edge computing and CDN delivery, reliability via managed services with built-in redundancy, great developer experience with Git-based deployments, and cost efficiency through pay-per-use GPU computing."
          }
        ]
      }
    ],
  },
];

// Render content blocks
const ContentRenderer = ({ blocks }: { blocks: ContentBlock[] }) => {
  return (
    <div className="space-y-6 w-full max-w-full">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            if (block.level === 4) {
              return (
                <h4 key={index} className="text-lg font-semibold text-foreground mt-8 mb-3">
                  {block.content}
                </h4>
              );
            }
            return (
              <h3 key={index} className="text-xl font-bold text-foreground mt-10 mb-4 border-b border-border/50 pb-2">
                {block.content}
              </h3>
            );
          case "text":
            return (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {block.content}
              </p>
            );
          case "image":
            return (
              <figure key={index} className="my-6 md:my-8">
                <div className="w-full">
                  <img
                    src={block.src}
                    alt={block.alt}
                    className="block rounded-lg md:rounded-xl"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '70vh',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground text-center italic px-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "code":
            return (
              <div key={index} className="my-4 md:my-6">
                <pre className="bg-card border border-border rounded-lg md:rounded-xl p-3 md:p-4 overflow-x-auto">
                  <code className="text-xs md:text-sm text-foreground font-mono whitespace-pre">
                    {block.content}
                  </code>
                </pre>
              </div>
            );
          case "link":
            return (
              <div key={index} className="my-4">
                <a
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {block.linkText || block.href}
                </a>
              </div>
            );
          case "list":
            return (
              <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={index} className="my-4 md:my-6 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <table className="w-full border-collapse border border-border rounded-lg overflow-hidden min-w-[400px]">
                  <thead>
                    <tr className="bg-muted/50">
                      {block.headers?.map((header, i) => (
                        <th key={i} className="border border-border px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-border px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const Documentation = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle URL hash on initial load (for navigation from other pages)
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # 
    if (hash) {
      // Small delay to ensure the page content is rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 100; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      // No hash - scroll to top of page
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Scroll spy: track active section and subsection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    // Observe all sections and subsections
    documentationSections.forEach((section) => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) observer.observe(sectionElement);

      section.subsections.forEach((subsection) => {
        const subsectionElement = document.getElementById(subsection.id);
        if (subsectionElement) observer.observe(subsectionElement);
      });
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll with easing for sidebar
  const smoothScrollSidebar = (element: Element, container: Element) => {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Check if element is already visible in container
    const isVisible = elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom;
    if (isVisible) return;

    // Calculate target scroll position to center the element
    const targetScrollTop = container.scrollTop +
      (elementRect.top - containerRect.top) -
      (containerRect.height / 2) +
      (elementRect.height / 2);

    const startScrollTop = container.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const duration = 400; // ms
    let startTime: number | null = null;

    // Ease out cubic for satisfying deceleration (inertia feel)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);

      container.scrollTop = startScrollTop + (distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Auto-scroll sidebar to active section with smooth inertia
  useEffect(() => {
    if (activeSection) {
      const activeLink = document.querySelector(`[data-section-id="${activeSection}"]`);
      const sidebar = document.querySelector('aside');
      if (activeLink && sidebar) {
        smoothScrollSidebar(activeLink, sidebar);
      }
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setSidebarOpen(false);
    }
  };

  // Helper to check if a section or any of its subsections is active
  const isSectionActive = (section: Section) => {
    return activeSection === section.id ||
      section.subsections.some(sub => sub.id === activeSection);
  };

  return (
    <div className="min-h-screen bg-background docs-page overflow-x-hidden">
      <Navbar />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden bg-card border border-border rounded-lg p-2 shadow-lg hover:bg-muted transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border/30 overflow-y-auto z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          <div className="p-6">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              On This Page
            </h2>
            <nav className="space-y-1">
              {documentationSections.map((section) => (
                <div key={section.id} className="space-y-1">
                  <button
                    onClick={() => scrollToSection(section.id)}
                    data-section-id={section.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isSectionActive(section)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted hover:text-primary"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${isSectionActive(section) ? "scale-110" : ""
                        }`}>
                        {section.icon}
                      </div>
                      <span className="flex-1">{section.title}</span>
                    </div>
                  </button>
                  <div className="ml-7 space-y-0.5 border-l-2 border-border/50 pl-3">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => scrollToSection(subsection.id)}
                        data-section-id={subsection.id}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all duration-200 relative ${activeSection === subsection.id
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {activeSection === subsection.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-[13px] w-0.5 h-full bg-primary rounded-full" />
                        )}
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 bg-background max-w-full overflow-hidden">
          {/* Hero Header */}
          <section className="relative py-24 overflow-hidden bg-background">
            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-20 w-32 h-32 border border-primary/10 rounded-full animate-float" />
              <div className="absolute bottom-10 left-20 w-20 h-20 border border-primary/5 rounded-full animate-float-slow" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-12">
              <div className="max-w-4xl">
                <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-widest mb-4 md:mb-6">
                  Technical Documentation
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold leading-tight mb-4 md:mb-6 text-gradient-animated">
                  Complete System Architecture
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mt-4 md:mt-6">
                  Explore every component of our virtual try-on pipeline, from segmentation models to deployment infrastructure.
                </p>
              </div>
            </div>
          </section>

          {/* Documentation Content */}
          <section className="py-12 md:py-20 bg-background w-full">
            <div className="mx-auto px-4 md:px-6 lg:px-12 w-full max-w-5xl">
              {documentationSections.map((section) => (
                <div key={section.id} id={section.id} className="mb-20 scroll-mt-24 w-full max-w-full">
                  {/* Section Header */}
                  <div className="flex items-start gap-4 mb-8 pb-6 border-b border-border">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-primary [&>svg]:w-10 [&>svg]:h-10">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                        {section.title}
                      </h2>
                      <p className="text-muted-foreground">{section.description}</p>
                    </div>
                  </div>

                  {/* Section Overview */}
                  {section.overview && (
                    <div className="mb-12">
                      <ContentRenderer blocks={section.overview} />
                    </div>
                  )}

                  {/* Subsections */}
                  <div className="space-y-12">
                    {section.subsections.map((subsection) => (
                      <div
                        key={subsection.id}
                        id={subsection.id}
                        className="scroll-mt-24 group"
                      >
                        <h3 className="text-2xl font-display font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {subsection.title}
                        </h3>
                        <ContentRenderer blocks={subsection.content} />
                        <div className="mt-8 h-px bg-border/50" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Footer />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Documentation;
