# Nutria - Improvement Plan V2

## Overview

Nutria is an AI-powered nutrition analysis platform that helps users evaluate packaged food products based on their nutritional content, ingredients, personal health conditions, and health goals.

The latest architecture uses Gemini Vision as the primary extraction engine and Tesseract OCR as a fallback system when AI quota limitations occur.

This improvement plan focuses on increasing reliability, usability, personalization, and robustness while ensuring the application remains functional even when AI services are unavailable.

---

# Current Architecture

```text
User Uploads Product Images
            ↓
      Gemini Vision
   (Primary Extraction)
            ↓
 Nutrition & Ingredient Parsing
            ↓
 Risk Scoring Engine
            ↓
 Personalized AI Analysis
            ↓
      Recommendation
```

Fallback:

```text
Gemini Quota Exceeded
            ↓
      Tesseract OCR
            ↓
 Continue Analysis Normally
```

This ensures Nutria remains operational regardless of Gemini availability.

---

# 1. Editable Nutrition Facts Verification

## Problem

Even though Gemini Vision is significantly more accurate than traditional OCR, extraction errors may still occur due to:

* Blurry images
* Poor lighting
* Curved packaging
* Incomplete nutrition labels
* Foreign language packaging

Incorrect nutritional values can directly impact risk assessment and recommendations.

## Improvement

Introduce a verification step after extraction.

Flow:

```text
Upload Images
↓
Gemini Vision Extraction
↓
Preview Extracted Nutrition Facts
↓
User Verification & Editing
↓
Run Analysis
```

Example:

```text
Calories : [220]
Protein  : [3]
Sugar    : [21]
Fat      : [12]
Sodium   : [150]
```

Users may correct values before analysis.

## Expected Impact

* Higher accuracy
* Reduced extraction errors
* Improved trustworthiness
* Better AI recommendations

---

# 2. Smart Invalid Image Detection

## Problem

Users may upload unrelated images such as:

* Selfies
* Animals
* Vehicles
* Landscapes
* Documents

Currently, Nutria may still attempt analysis.

## Improvement

Use Gemini Vision classification before extraction.

Detect whether uploaded images contain:

* Product packaging
* Nutrition Facts panel
* Ingredient list

If not detected:

```text
No nutrition-related information found.

Please upload:
• Product Packaging
• Nutrition Facts Panel
• Ingredient List
```

## Expected Impact

* Better user experience
* Reduced AI usage
* Fewer invalid analyses

---

# 3. Unified Multi-Image Upload

## Problem

Multiple upload fields create unnecessary complexity.

Current approach:

```text
Front Image
Nutrition Facts Image
Ingredient Image
```

## Improvement

Use a single upload component.

```text
Upload Product Photos
(Max 3 Images)
(Max 5 MB Each)
```

Users can upload:

```text
✓ Front Packaging
✓ Nutrition Facts
✓ Ingredient List
```

or any combination.

Flow:

```text
Upload Images
↓
Gemini Vision Reads All Images
↓
Merge Information
↓
Analyze Product
```

## Validation Rules

```text
Maximum Images : 3
Maximum Size   : 5 MB per image
Formats        : JPG, PNG, WEBP, JPEG
```

## Expected Impact

* Simpler UI
* Better usability
* Faster scanning workflow

---

# 4. Expanded Health Condition Support

## Current Conditions

* Diabetes
* Hypertension
* Obesity

## Proposed Expansion

### Metabolic

* Diabetes
* Obesity
* High Cholesterol

### Cardiovascular

* Hypertension
* Heart Disease

### Digestive

* GERD
* Lactose Intolerance
* Gluten Sensitivity

### Organ Conditions

* Kidney Disease
* Liver Disease

### Other Conditions

* Gout
* Pregnancy
* Food Allergies

## Expected Impact

* Better personalization
* Larger target audience
* More meaningful recommendations

---

# 5. Conditional Ingredient Analysis

## Problem

Not every user uploads an ingredient list.

Currently:

```text
Ingredients to Watch
```

may appear empty.

## Improvement

Only display ingredient-related analysis if ingredients are successfully extracted.

Logic:

```text
Ingredients Found?
├── Yes → Show Ingredient Analysis
└── No  → Hide Section
```

## Expected Impact

* Cleaner UI
* More relevant analysis
* Better presentation quality

---

# 6. Concise Personalized Analysis

## Problem

Current analysis is often too lengthy.

Many responses exceed:

```text
300-500 words
```

Most users only need key insights.

## Improvement

Limit AI output to concise and actionable recommendations.

Structure:

### Summary

```text
Not Recommended for Cutting
```

### Main Concerns

```text
• High Added Sugar
• Low Protein
• High Saturated Fat
```

### Recommendation

```text
Consume occasionally.
Avoid as a daily snack.
```

### Optional Detailed Analysis

```text
Show More ▼
```

## Expected Impact

* Better readability
* Faster decision making
* Improved mobile experience

---

# 7. Gemini Quota Fallback System

## Problem

Gemini API Free Tier has request limitations.

When quota is exhausted:

```text
429 Quota Exceeded
```

analysis quality degrades.

## Improvement

Implement automatic fallback.

Flow:

```text
Gemini Available?
├── Yes
│   ├── Vision Extraction
│   └── AI Analysis
│
└── No
    ├── Tesseract OCR
    ├── Local Risk Engine
    ├── Local Recommendation Engine
    └── Continue Analysis
```

Users should not notice service interruption.

## Expected Impact

* Higher reliability
* Continuous service availability
* Better deployment readiness

---

# 8. Disease-Specific Highlighting

## Problem

Users often receive generic explanations.

## Improvement

Highlight only the most critical nutrition concerns for the selected condition.

Examples:

### Diabetes

```text
High Sugar Alert
21g Added Sugar Detected
```

### Hypertension

```text
High Sodium Alert
```

### Kidney Disease

```text
High Potassium Alert
```

### High Cholesterol

```text
High Saturated Fat Alert
```

## Expected Impact

* More actionable insights
* Easier understanding
* Stronger personalization

---

# Priority Roadmap

## Phase 1 (Must Have)

* Editable Nutrition Facts
* Multi Image Upload
* Invalid Image Detection
* Shortened Analysis
* Gemini Fallback System

## Phase 2

* Expanded Health Conditions
* Disease-Specific Highlighting
* Conditional Ingredient Analysis

## Phase 3

* Food History Tracking
* Daily Nutrition Tracking
* PWA Support
* User Progress Dashboard

---

# Expected Outcome

With these improvements, Nutria evolves from a simple nutrition scanner into a comprehensive AI-powered nutrition assistant capable of:

* Understanding multiple packaging images
* Validating extracted nutrition information
* Handling Gemini quota limitations gracefully
* Supporting various health conditions
* Providing concise and actionable recommendations
* Delivering a more reliable and production-ready user experience

These enhancements significantly strengthen both the practical value and novelty of Nutria as an AI-based health technology project.
