# Document Hub Core {
  - Document storage
  - Text/Layout extraction
  - Text reading with customizable view
  - Extension runtime
  - API surface
  - Marketplace infrastructure
}
# Core Storage Functions

# Document Ingestion

- Upload documents (HTML, PDF XPS EPUB MOBI FB2 CBZ SVG TXT Image DOCX XLSX PPTX HWPX )

# Storage Management
- Store original documents
- Version control (track document changes (the transformed one))
- Folder/collection organization
- Tagging system
# Text Extraction Pipeline
- PyMuPDF (text, layout, TOC, etc...)
- Heading hierarchy extraction
- Page number preservation
- Metadata extraction (title, author, date)
- Special elements (tables, math, other symbols) marked as "Math", "Table",etc...
# On-Demand Processing
- Handwriting recognition
- Mathematical formula extraction
- Special symbol processing
# Text Storage & Indexing
- Fuzzy search capability across all documents
- Search in a document or folder
- Search history
# Structuring
- Tree like of the extracted (fold in fold out)
- Structure first will be base on output of PyMuPDF
# Customization **Important**
- Font family selection (5-10 options)
- Font size adjustment (14px-24px)
- Line height control
- Letter spacing adjustment
- Paragraph spacing
- Margin width control
- Preset themes (Day, Night, Sepia, High Contrast)
- Background color customization
- Text color adjustment
# Reading Mode Functions **Important**
- Toggle: TextMode ↔ Reading Mode (compiled base on the customization)
- Smooth transition animations
- Remember last view preference per document
# Reading Experience **Important**
- Continuous scroll
- Current page position store across all documents
- TOC navigable
- Bookmarking
- Current reading position of all documents show at the front page
# Editing Capabilities **Important**
- Edit text in the text-mode only
- Customization can be made in reading-mode (to see the effect)
# Annotation System
- Highlight text (multiple colors) (Position of all highlighted text can be retrive in Highlight section)
- Add notes (Position of all notes can be retrive in Highlight section)
- Inline comments (Text highlighted that have comment in it, position of all can be retrieved)
# Export
- PDF/HTML/Epub and the transformed text
# Sharing
- Shared folders
- Shared documents
- Comment
- Real-time collaboration indicators
- Activity history (version)
# Document Intelligence
- Language detection
# System Functions
- User authentication
# Performance Features
- Sync across devicess

# Full UI flexibility (custom views, renderers)
Data processing hooks (intercept and transform)
Custom storage/sync providers
WASM support for performance
But maintain control over core security operations

# Core structure
// The ENTIRE core is just these 5 primitives
class DocumentHubCore {
  constructor() {
    this.primitives = {
      1. Storage,      // Binary + metadata storage
      2. Extraction,   // Text + structure extraction  
      3. Runtime,      // Extension execution environment
      4. Events,       // System-wide event bus
      5. Security      // Permissions & isolation
    };
  }
}