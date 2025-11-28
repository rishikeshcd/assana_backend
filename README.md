# Backend API Documentation

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file with MongoDB connection string
3. Start server: `npm run dev`

## Models

All models use a singleton pattern - only one document exists per section.

### HomeBanner
- `mainTitle` (String)
- `subtitle` (String)
- `introductionParagraph` (String)
- `experienceSectionTitle` (String)
- `experienceItems_1` through `experienceItems_7` (String)
- `backgroundImage` (String) - Image URL

### HomeServices
- `colorectalConditionsTitle` (String)
- `colorectalConditionsItem1` through `colorectalConditionsItem6` (String)
- `gutWellnessTitle` (String)
- `gutWellnessItem1` through `gutWellnessItem6` (String)
- `educationTitle` (String)
- `educationItem1` through `educationItem3` (String)

### HomeWhyAssana
- `mainTitle` (String)
- `subtitle` (String)
- `introductionParagraph` (String)

### HomeWhyDifferent
- `mainTitle` (String)
- `subtitle` (String)
- `introductionParagraph` (String)

### ServicesComponent
- `componentHeading` (String)
- `services` (Array of Objects)
  - `serviceHeading` (String)
  - `serviceOpenHeading` (String)
  - `serviceOpenPara1` (String)
  - `serviceOpenPara2` (String)

### Video
- `Heading` (String)
- `subHeading` (String)
- `videoLink` (String)

### PatientFeedbackComponent
- `componentHeading` (String)
- `componentSubHeading` (String)
- `testimonials` (Array of Objects)
  - `patientName` (String)
  - `patientProblem` (String)
  - `patientFeeback` (String)
  - `patientImg` (String) - Image URL

### AskedQuestionsComponent
- `componentHeading` (String)
- `faqs` (Array of Objects)
  - `questionHeading` (String)
  - `answerPara` (String)

### GetStartedComponent
- `Heading` (String)
- `subHeading` (String)

## Routes

All routes follow the pattern:
- `GET /api/<page>/<section>` - Get section data
- `PUT /api/<page>/<section>` - Update section data

### Image Upload

`POST /api/uploads`
- Content-Type: `multipart/form-data`
- Field name: `file`
- Max size: 5MB
- Allowed types: image/jpeg, image/png, image/gif, image/webp
- Returns: `{ url: "...", filename: "..." }`

## Error Handling

All routes return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `500` - Server Error

Error responses:
```json
{
  "error": "Error message"
}
```

