[https://docs.fileverse.io/0x86A3a4404EFCF8CEcC492E310015d349A035b96b/6\#key=DpO\_K6hOcTHxV\_2EnTywtpP3KJkgmgr8ydAB2AtPxGFi5X6h0X1xLEAWGw1AiGJF](https://docs.fileverse.io/0x86A3a4404EFCF8CEcC492E310015d349A035b96b/6#key=DpO_K6hOcTHxV_2EnTywtpP3KJkgmgr8ydAB2AtPxGFi5X6h0X1xLEAWGw1AiGJF) 

# Kesennuma Hackatsuon 2025 Spec

## 1\. Background

* **Problem Statement:**   
  * Currently, the experience of accessing information about Kesennuma is fragmented and difficult to relate to the real-world experience. Content about Kesennuma, whether it is text, photos, videos, etc., is presented disconnected from the actual place.   
* **Context / History:**   
  * Prior work conducted by Hidenori Watanave: Hiroshima Archive, 3D map visualization with spatially aligned historical photographs and stories: [https://hiroshima.mapping.jp/index\_en.html](https://hiroshima.mapping.jp/index_en.html).   
    [https://github.com/wtnv-lab/hiroshimaArchive\_OSS](https://github.com/wtnv-lab/hiroshimaArchive_OSS)  
      
  * Kesennuma Kanko (Tourism) Website. This website has lots of good content about sightseeing spots, events, stores, itineraries. This content is served through mostly the format of blog posts. Some simple embedded Google Maps.  [https://en.kesennuma-kanko.jp/](https://en.kesennuma-kanko.jp/)   
  * AI Route Planner: [https://visit-kesennuma.com/](https://visit-kesennuma.com/)   
* **Stakeholders:** \[Teams, users, external systems\]  
  * Tourism Association (providing content)   
  * Businesses (to create presence on platform)   
  * Visitors to Kesennuma, access local stories / information    
  * Residents, with stories to contribute  
  * Developers   
  * Other communities, interested in creating similar projects (reproducibility) 

---

## 2\. Motivation

* **Goals & Success Stories:**  
  * Increased tourism to the region   
    * More interest due to better understanding of what the community offers, easier to envision having a good time   
  * Increased migration to the region   
    * Encourage feelings of belonging to community, from before actually migrating to Kesennuma   
  * Residents / contributors capture their experiences, created shared history   
    * Residents can open the website and have clear cues for how to contribute a story. Contributing the story should be easy, with freeform input of photos, videos, and text. Each story should have a location parameter, in order to place onto the map. These stories could have tags, so that users can filter for particular themes. Ideally, the photos / videos could be overlaid on top of the 3D map, so there is a perceptual link between historical content and digital twin.   
    * Ability to upload 3D assets, like point clouds, meshes, and gaussian splats. See Hiroshima Archive for examples of this.   
    * Ability to have “keyframe”, or specific view of the 3D map with which the content would be served. Ex: [https://ion.cesium.com/stories/viewer/?id=f86622ba-8be7-42a8-992c-81821f9d35e5\#slide-id-350356](https://ion.cesium.com/stories/viewer/?id=f86622ba-8be7-42a8-992c-81821f9d35e5#slide-id-350356)   
  * Visitors to the website that are not active contributors  
    * Options of guided tours through the digital experience, as well as freeform exploration.   
    * Kesennuma Tourism Website already has suggested itineraries, as well as AI generated itineraries. These itineraries could be shown via simulated walk on the 3D map, organically introducing the surrounding community along the way.  
    * Example user flow:   
      * User will open the website.   
      * The user can see featured itineraries on initial view.   
      * Click on a featured itinerary  
      * User view flies to the first location on the itinerary, which is defined as the keyframe for the location   
      * User can read / view the content associated with the location   
      * User can trigger the simulated walk to the next location, by clicking on next button  
      * User will see the walk from first location to the next location, seeing the pins along the walk  
      * User can take manual control and explore in 3D freely at any time  
      * User can return to the guided tour by clicking next button.   
  * Onboarding / replicable framework for creating these digital platforms for other communities in Japan.   
  * NFT Stamp Rally for visiting places  
    - What is an NFT Stamp Rally?  
    - NFT stamp rallies are a digital evolution of Japan's traditional stamp rallies (スタンプラリー), where participants collect blockchain-based NFTs instead of physical stamps by visiting locations and scanning QR codes with a smartphone app.  
    - **How they work:**  
      - Download an app (like EXPO 2025 Digital Wallet), visit tourist spots or facilities, and scan QR codes to collect unique digital stamps  
      - Most use SBTs (Soul Bound Tokens) that cannot be transferred or tampered with, serving as verifiable proof of attendance  
    - Popular use cases:  
      - Tourism campaigns (Kansai region sightseeing, Izumo City)  
      - Railway company events (Tokyu Lines)  
      - EXPO 2025 Osaka with over 200 stamps across pavilions  
      - Shopping areas and special vending machines  
    - **Benefits over traditional rallies**  
      - Participants can accumulate stamps across multiple rallies over time, making collecting itself a purpose  
      - Often include prizes, lottery entries, or digital rewards  
      - Creates verifiable digital memories and proof of experiences  
      - Combines physical tourism with digital collectibles  
      - It's basically gamifying tourism and event participation with blockchain technology while maintaining the beloved Japanese tradition of stamp collecting.  
    - Campaign system for availing NFT stamps- example: go to the Onsen 2 times to get the NFT stamp  
      - Benefits:  
        - Gamified visitor system that encourages people to visit places of interest and collect soulbound NFTs that serve as an immutable proof of visit.  
        - Allowing vendors to create their own campaigns for the stamp rallies


## 3\. Scope and Approaches

### 3.1 Non-Goals & Out of Scope

**Platform Boundaries:**
* Not building a "facts-only" website - focusing on personal stories and experiences
* Not a social media platform - no user profiles, feeds, or messaging
* Not replacing existing Kesennuma websites - complementing them with 3D spatial experience
* Not a native mobile app (Phase 1) - mobile-responsive web only
* Not a marketplace - no direct transactions or booking systems

**Technical Limitations:**

| Feature | Reasoning | Tradeoffs |
|---------|-----------|-----------|
| Real-time multiplayer 3D | Complex infrastructure, high costs | Users explore independently; no shared presence |
| Full moderation dashboard | Limited dev resources for Phase 1 | Manual review via simple admin panel; relies on community standards |
| Multi-language AI translation | Budget constraints | Manual translations for key content; Japanese/English only initially |
| VR/AR support | Scope creep, limited adoption | Desktop/mobile web only; defers immersive experiences |
| Rate limiting / DDoS protection | Expected low volume initially | May need to add if traffic spikes; monitoring required |
| Advanced 3D editing tools | Complexity vs. benefit | Pre-processed assets only; upload raw files, no in-browser editing |

**Web3 Boundaries:**
* No wallet required for browsing/exploring
* No cryptocurrency purchases - NFTs are free proof-of-visit only
* No trading/transferring of NFTs (Soulbound tokens only)
* No complex smart contracts or DeFi integrations

---

### 3.2 Technical Stack & Value Propositions

**Core Technology Decisions:**

| Component | Choice | Value | Tradeoffs |
|-----------|--------|-------|-----------|
| **Frontend Framework** | Next.js 14+ (TypeScript) | SEO-friendly, server components, static generation for itineraries | Learning curve; may be overkill for simple pages |
| **Styling** | Tailwind CSS | Rapid development, consistent design, smaller bundle sizes | Verbose class names; design system needed |
| **3D Visualization** | Cesium.js | Industry-standard geospatial 3D, supports point clouds/terrain | Large bundle size (~3MB); GPU-intensive |
| **Map Data** | OpenStreetMap + Cesium Terrain | Free, community-maintained, good Japan coverage | May need custom tileset for best quality |
| **Backend API** | Next.js API Routes + Supabase | Unified codebase, quick setup, real-time subscriptions | Vendor lock-in; may need migration if scaling >500k users |
| **Database** | Supabase (PostgreSQL) | PostGIS for geospatial queries, built-in auth, row-level security | Costs scale with storage/bandwidth |
| **File Storage** | Supabase Storage + CDN | Integrated with DB, automatic image optimization | Max 5GB free tier; need paid plan for 3D assets |
| **3D Asset Pipeline** | Cesium Ion (free tier) | Automatic tiling of large 3D models, streaming optimization | 5GB upload limit; processing time for large meshes |
| **NFT/Blockchain** | Base (Ethereum L2) | Ultra-low gas fees (<$0.01), Coinbase backing, growing ecosystem | Requires wallet setup; may confuse non-crypto users |
| **Wallet Integration** | Rainbow Kit / WalletConnect | Clean UX, supports major wallets, mobile-friendly | Additional dependency; wallet setup friction |
| **Authentication** | Supabase Auth + Magic Links | No passwords, low friction for contributors | Requires email; no true anonymity |

**Key Value Propositions:**
1. **Spatial Context** - Stories are tied to physical locations on accurate 3D terrain
2. **Guided Discovery** - Curated itineraries with cinematic camera paths between locations
3. **Community Memory** - Permanent, attributed contributions from residents
4. **Proof of Visit** - Blockchain-verified digital souvenirs (NFTs) without complexity
5. **Reproducible Framework** - Open source for other communities to adapt

---

### 3.3 Alternative Approaches Considered

#### 3D Mapping Technology

| Approach | Pros | Cons |
|----------|------|------|
| **Cesium.js** ✓ (Selected) | Industry-standard geospatial, photorealistic terrain, cesium ion integration | 3MB bundle, requires WebGL 2.0, steep learning curve |
| Three.js + Mapbox GL | Smaller bundle, more customizable rendering | Manual terrain integration, no native point cloud support |
| Google Maps 3D API | Easy integration, familiar UX | Vendor lock-in, limited customization, higher costs |
| Unity WebGL | Rich 3D features, physics engine | 10-20MB bundle, long load times, mobile compatibility issues |

#### Backend Architecture

| Approach | Pros | Cons |
|----------|------|------|
| **Next.js + Supabase** ✓ (Selected) | Fast development, one codebase, real-time features | Supabase vendor lock-in, costs at scale |
| Separate Node.js API | Full control, custom optimization | More maintenance, separate deployments |
| Firebase | Real-time out of box, generous free tier | NoSQL may complicate geospatial queries, Google lock-in |
| Prisma + PostgreSQL | Strong typing, migration management | Need separate hosting, more DevOps overhead |

#### NFT Platform

| Approach | Pros | Cons |
|----------|------|------|
| **Base (Ethereum L2)** ✓ (Selected) | Ultra-low fees (<$0.01), Coinbase ecosystem, Ethereum security, growing adoption | Newer chain (less battle-tested), requires bridging from L1 |
| Polygon PoS | Low fees, mature ecosystem, familiar to Japanese users | Separate security model from Ethereum, two tokens (MATIC/ETH) |
| Ethereum L1 | Most secure, widest support | Gas fees $5-50, slower confirmation |
| Solana | Very fast, very low fees | Less adoption in Japan, recent stability issues |
| Centralized DB + "NFT" UI | No wallet friction, free | Not actually blockchain, defeats proof-of-visit authenticity |

#### Content Management

| Approach | Pros | Cons |
|----------|------|------|
| **Custom forms in Next.js** ✓ (Selected) | Full control, tight integration with 3D map | Need to build admin panel |
| Strapi / Sanity CMS | Rich admin UI, workflows, versioning | Additional service, higher complexity |
| Markdown files in Git | Version controlled, simple, free | No non-technical contributor UI, manual deployment |

---

### 3.4 Relevant Metrics

**Engagement Metrics:**
- Monthly active users (browsing vs. contributing)
- Average session duration on 3D map
- Itinerary completion rate
- Stories viewed per session
- Geographic coverage (pins per square km)

**Content Metrics:**
- Total stories/locations added
- Stories per contributor (participation distribution)
- User-generated vs. admin-curated content ratio
- Media types uploaded (photos/videos/3D assets)

**NFT Stamp Rally Metrics:**
- NFT stamps claimed per month
- Unique wallets participating
- Physical visits confirmed (if QR codes tracked)
- Campaign completion rate (multi-visit challenges)

**Technical Metrics:**
- 3D map load time (target <5s)
- Time to First Byte (TTFB) for API calls
- CDN cache hit rate for media
- Error rate for NFT minting
- Mobile vs. desktop usage ratio

**Community Impact:**
- Tourism Association content adoption
- Businesses creating stamp rally campaigns
- Other communities expressing interest in framework
- Press mentions / social media reach

---

## 4\. Step-by-Step Flow

### 4.1 Main ("Happy") Paths

#### Flow A: Visitor Browses Featured Itinerary

1. **Pre-condition:** User visits website, 3D map and featured itineraries are loaded
2. **Actor: Visitor** clicks on featured itinerary card (e.g., "Historic Fishing District Tour")
3. **System validates:**
   - Itinerary exists and has valid stops
   - All location keyframes are defined
4. **System executes:**
   - Fetches itinerary data from Supabase (`itineraries` + `itinerary_stops` tables)
   - Animates camera to first stop's keyframe (lat/lon/heading/pitch/zoom)
   - Displays story panel with content (text, images, videos) for first stop
   - Shows progress indicator (Stop 1 of 5)
5. **Actor: Visitor** clicks "Next" button
6. **System executes:**
   - Calculates path from current stop to next stop using terrain data
   - Animates camera along path (simulated walk, ~3-5 seconds)
   - Displays nearby pins along the route (discoverable content)
   - Arrives at next stop's keyframe, displays content
7. **Actor: Visitor** (optional) clicks on nearby pin during transit
8. **System executes:**
   - Pauses itinerary mode
   - Flies camera to selected pin
   - Displays pin's story content in side panel
   - Shows "Resume Tour" button
9. **Post-condition:** User completes itinerary or exits to free exploration mode

---

#### Flow B: Contributor Submits Story

1. **Pre-condition:** User wants to contribute content, not yet authenticated
2. **Actor: Contributor** clicks "Share Your Story" button in navigation
3. **System validates:** User authentication status
4. **System executes:**
   - Redirects to Supabase Auth magic link flow
   - Sends email with login link
5. **Actor: Contributor** clicks magic link in email
6. **System validates:**
   - Token is valid and not expired
   - Email is verified
7. **System executes:**
   - Creates/updates user record in `users` table
   - Sets authentication cookie
   - Redirects to story submission form
8. **Actor: Contributor** fills out form:
   - Title (required)
   - Description (required, rich text)
   - Location (required, click on 3D map or enter coordinates)
   - Tags (optional, multi-select: food, history, nature, events, etc.)
   - Media files (optional, drag-drop images/videos/3D assets)
   - Keyframe (optional, set camera view for optimal viewing)
9. **System validates:**
   - Required fields present
   - Location is within Kesennuma bounds (lat: 38.8-39.0, lon: 141.5-141.7)
   - Files under size limits (images <10MB, videos <100MB, 3D <500MB)
   - File types allowed (jpg, png, mp4, webm, ply, glb, etc.)
10. **System executes:**
    - Uploads media to Supabase Storage
    - Optimizes images (webp conversion, multiple sizes)
    - Queues large 3D assets for Cesium Ion processing
    - Inserts story record to `stories` table (status: 'pending_review')
    - Sends notification to moderators
11. **Post-condition:** Story is submitted, awaiting admin approval; contributor sees confirmation

---

#### Flow C: Visitor Claims NFT Stamp (Physical Visit)

1. **Pre-condition:** Visitor is physically at a location in Kesennuma with an NFT stamp campaign
2. **Actor: Visitor** scans QR code at physical location (e.g., onsen entrance)
3. **System validates:**
   - QR code format is valid
   - Campaign is active and not expired
   - Location ID matches campaign
4. **System executes:**
   - Redirects to NFT claim page with campaign ID in URL
   - Displays campaign info (name, description, reward preview)
   - Checks if wallet is connected
5. **Actor: Visitor** clicks "Connect Wallet" (if not connected)
6. **System executes:**
   - Launches RainbowKit wallet connection modal
   - User selects wallet (MetaMask, Coinbase Wallet, WalletConnect, etc.)
7. **Actor: Visitor** approves connection in wallet app
8. **System validates:**
   - Wallet address is valid
   - Network is Base (chain ID: 8453)
9. **System executes:**
   - Checks campaign eligibility via smart contract
   - Queries `visits` table for visit history
   - Evaluates campaign rules (e.g., "Visit onsen 2 times")
10. **System validates:**
    - User meets campaign requirements
    - NFT has not already been claimed by this address
11. **System executes:**
    - Calls smart contract `mintStamp(campaignId, walletAddress)` on Base
    - Records visit in `visits` table (location_id, wallet_address, timestamp)
    - Waits for transaction confirmation (~2 seconds on Base)
12. **System executes:**
    - Displays success animation with NFT artwork
    - Shows transaction hash and link to BaseScan
    - Updates user's NFT collection view
    - Records mint in `nft_stamps` table
13. **Post-condition:** User owns Soulbound NFT as proof of visit; visit is logged

---

### 4.2 Alternate / Error Paths

| # | Condition | System Action | Suggested Handling |
|---|-----------|---------------|-------------------|
| **A1** | Itinerary has no stops | 404 error logged | Display "Itinerary unavailable" message, suggest other itineraries |
| **A2** | Camera animation fails (WebGL crash) | Catch error, fallback to instant jump | Jump to keyframe without animation, log error to monitoring |
| **A3** | User's device doesn't support WebGL 2.0 | Detect on page load | Show 2D map fallback with Mapbox GL, inform about limited features |
| **B1** | Magic link expired (>10 minutes) | Token validation fails | Show "Link expired" message, offer to resend |
| **B2** | File upload fails (network timeout) | Supabase client error | Show retry button, allow individual file re-upload |
| **B3** | Location outside Kesennuma bounds | Validation error on submit | Highlight map picker, show error: "Please select a location within Kesennuma" |
| **B4** | 3D asset processing fails in Cesium Ion | Webhook returns error status | Email contributor, mark asset as "processing_failed", allow re-upload |
| **B5** | Profanity/spam detected in submission | Content moderation flag (manual review) | Mark story as 'flagged', notify moderators, show "under review" to user |
| **C1** | User wallet is on wrong network | Check chain ID ≠ 8453 | Show "Switch to Base network" button, trigger wallet network switch |
| **C2** | User doesn't meet campaign requirements | Smart contract returns eligibility = false | Display progress: "Visit 1 of 2 times completed", show next steps |
| **C3** | NFT already claimed by this wallet | Check `nft_stamps` table for duplicate | Show "Already claimed!" with link to view NFT in collection |
| **C4** | Transaction fails (insufficient gas) | Transaction reverted | Show error with gas estimate, link to bridge ETH to Base |
| **C5** | QR code is tampered/invalid | QR data doesn't match campaign format | Show "Invalid QR code" error, provide support contact |
| **C6** | Smart contract is paused (emergency) | Contract call reverts with "Paused" | Show maintenance message, link to status page |

---

## 5\. UML Diagrams

### 5.1 Class Diagram - Data Model

```mermaid
classDiagram
    class Story {
        +Int id
        +String title
        +String slug
        +String excerpt
        +Float latitude
        +Float longitude
        +String coverImageUrl
        +UUID authorId
        +String status
        +Boolean featured
        +Int viewCount
        +DateTime publishedAt
        +DateTime createdAt
        +DateTime updatedAt
        +getContentBlocks()
        +getMediaGallery()
        +getTags()
        +getCameraKeyframe()
    }

    class StoryContent {
        +UUID id
        +Int storyId
        +String blockType
        +Int order
        +JSON data
        +DateTime createdAt
        +render()
    }

    class ContentBlock {
        <<interface>>
        +String type
        +Int order
        +JSON data
    }

    class TextBlock {
        +String content
        +String format
        +render()
    }

    class ImageBlock {
        +UUID mediaId
        +String caption
        +String alt
        +String layout
        +render()
    }

    class VideoBlock {
        +UUID mediaId
        +String caption
        +Boolean autoplay
        +render()
    }

    class GalleryBlock {
        +Array~UUID~ mediaIds
        +String layout
        +render()
    }

    class QuoteBlock {
        +String text
        +String author
        +render()
    }

    class EmbedBlock {
        +String embedType
        +String url
        +JSON metadata
        +render()
    }

    class Model3DBlock {
        +UUID mediaId
        +JSON viewerSettings
        +render()
    }

    class StoryMedia {
        +UUID id
        +Int storyId
        +String mediaType
        +String url
        +String thumbnailUrl
        +JSON metadata
        +Int fileSize
        +Boolean isUsed
        +DateTime uploadedAt
        +getUsageCount()
    }

    class StoryTag {
        +Int storyId
        +Int tagId
    }

    class Tag {
        +Int id
        +String name
        +String slug
        +String color
        +String icon
        +Int storyCount
    }

    class CameraKeyframe {
        +UUID id
        +Int storyId
        +Float latitude
        +Float longitude
        +Float altitude
        +Float heading
        +Float pitch
        +Float roll
        +String description
        +Boolean isDefault
    }

    class Itinerary {
        +UUID id
        +String name
        +String description
        +Boolean featured
        +DateTime createdAt
    }

    class ItineraryStop {
        +UUID id
        +UUID itineraryId
        +Int storyId
        +Int order
        +UUID keyframeId
    }

    class User {
        +UUID id
        +String email
        +String name
        +String avatar
        +String bio
        +DateTime createdAt
    }

    class NFTCampaign {
        +UUID id
        +String name
        +String description
        +Int locationId
        +Int requiredVisits
        +String contractAddress
        +Boolean active
        +DateTime startDate
        +DateTime endDate
    }

    class Visit {
        +UUID id
        +Int locationId
        +String walletAddress
        +DateTime timestamp
        +String campaignId
    }

    class NFTStamp {
        +UUID id
        +String walletAddress
        +UUID campaignId
        +String tokenId
        +String transactionHash
        +DateTime mintedAt
    }

    Story "1" --> "*" StoryContent : contains
    StoryContent --> ContentBlock : implements
    ContentBlock <|-- TextBlock
    ContentBlock <|-- ImageBlock
    ContentBlock <|-- VideoBlock
    ContentBlock <|-- GalleryBlock
    ContentBlock <|-- QuoteBlock
    ContentBlock <|-- EmbedBlock
    ContentBlock <|-- Model3DBlock

    Story "1" --> "*" StoryMedia : hasMedia
    ImageBlock "*" --> "1" StoryMedia : references
    VideoBlock "*" --> "1" StoryMedia : references
    Model3DBlock "*" --> "1" StoryMedia : references
    GalleryBlock "*" --> "*" StoryMedia : references

    Story "1" --> "*" CameraKeyframe : hasKeyframes
    Story "*" --> "*" Tag : taggedWith
    StoryTag "*" --> "1" Story
    StoryTag "*" --> "1" Tag

    Itinerary "1" --> "*" ItineraryStop : contains
    ItineraryStop "*" --> "1" Story : references
    ItineraryStop "*" --> "0..1" CameraKeyframe : usesKeyframe

    Story "*" --> "1" User : authoredBy
    NFTCampaign "1" --> "*" Visit : tracks
    NFTCampaign "1" --> "*" NFTStamp : issues
    Visit "*" --> "1" Story : atLocation
```

### 5.2 Sequence Diagram - Visitor Browses Itinerary

```mermaid
sequenceDiagram
    participant Visitor
    participant NextJS
    participant CesiumViewer
    participant API
    participant Supabase

    Visitor->>NextJS: Load homepage
    NextJS->>API: GET /api/itineraries?featured=true
    API->>Supabase: SELECT * FROM itineraries WHERE featured = true
    Supabase-->>API: Return itineraries
    API-->>NextJS: Return JSON
    NextJS-->>Visitor: Display featured itineraries

    Visitor->>NextJS: Click itinerary card
    NextJS->>API: GET /api/itineraries/:id/stops
    API->>Supabase: SELECT stops JOIN stories
    Supabase-->>API: Return stops with story data
    API-->>NextJS: Return JSON

    NextJS->>CesiumViewer: Initialize with first stop keyframe
    CesiumViewer->>CesiumViewer: Animate camera to position
    CesiumViewer-->>Visitor: Display 3D view + story panel

    Visitor->>CesiumViewer: Click "Next" button
    CesiumViewer->>CesiumViewer: Calculate path to next stop
    CesiumViewer->>CesiumViewer: Animate camera along path
    CesiumViewer->>CesiumViewer: Show nearby pins during transit
    CesiumViewer-->>Visitor: Arrive at next stop, display content
```

### 5.3 Sequence Diagram - Contributor Submits Story

```mermaid
sequenceDiagram
    participant Contributor
    participant NextJS
    participant SupabaseAuth
    participant API
    participant SupabaseStorage
    participant SupabaseDB
    participant Moderator

    Contributor->>NextJS: Click "Share Your Story"
    NextJS->>SupabaseAuth: Check auth status
    SupabaseAuth-->>NextJS: Not authenticated
    NextJS-->>Contributor: Show magic link form

    Contributor->>SupabaseAuth: Submit email
    SupabaseAuth->>Contributor: Send magic link email
    Contributor->>SupabaseAuth: Click magic link
    SupabaseAuth->>SupabaseDB: Create/update user record
    SupabaseAuth-->>NextJS: Set auth cookie, redirect

    NextJS-->>Contributor: Display submission form
    Contributor->>NextJS: Fill form + upload media
    NextJS->>NextJS: Validate form data

    NextJS->>SupabaseStorage: Upload media files
    SupabaseStorage-->>NextJS: Return file URLs

    NextJS->>API: POST /api/stories
    API->>API: Validate location bounds
    API->>SupabaseDB: INSERT story (status: pending_review)
    SupabaseDB-->>API: Return story record
    API->>Moderator: Send notification (webhook/email)
    API-->>NextJS: 201 Created
    NextJS-->>Contributor: Show confirmation message

    Moderator->>NextJS: Review story in admin panel
    Moderator->>API: PATCH /api/stories/:id (approved: true)
    API->>SupabaseDB: UPDATE story SET approved = true
    SupabaseDB-->>API: OK
    API-->>Moderator: Story published
```

### 5.4 Sequence Diagram - NFT Stamp Claim

```mermaid
sequenceDiagram
    participant Visitor
    participant NextJS
    participant RainbowKit
    participant Wallet
    participant API
    participant SmartContract
    participant Base
    participant SupabaseDB

    Visitor->>Visitor: Scan QR code at physical location
    Visitor->>NextJS: Open claim page (/nft/claim?campaign=xxx)
    NextJS->>API: GET /api/campaigns/:id
    API->>SupabaseDB: SELECT campaign details
    SupabaseDB-->>API: Return campaign
    API-->>NextJS: Return campaign info
    NextJS-->>Visitor: Display campaign + "Connect Wallet"

    Visitor->>RainbowKit: Click "Connect Wallet"
    RainbowKit->>Wallet: Request connection
    Wallet->>Visitor: Approve connection
    Wallet-->>RainbowKit: Return wallet address
    RainbowKit-->>NextJS: Connected (address, chainId)

    NextJS->>NextJS: Check chainId === 8453 (Base)
    alt Wrong network
        NextJS->>RainbowKit: Request network switch
        RainbowKit->>Wallet: Switch to Base
        Wallet-->>RainbowKit: Network switched
    end

    NextJS->>API: POST /api/nft/check-eligibility
    API->>SupabaseDB: SELECT visits WHERE walletAddress & campaignId
    SupabaseDB-->>API: Return visit history
    API->>API: Evaluate campaign rules (e.g., 2 visits required)

    alt Not eligible
        API-->>NextJS: { eligible: false, progress: "1/2 visits" }
        NextJS-->>Visitor: Show progress message
    else Eligible
        API-->>NextJS: { eligible: true }
        NextJS-->>Visitor: Show "Claim NFT" button

        Visitor->>NextJS: Click "Claim NFT"
        NextJS->>SmartContract: mintStamp(campaignId, walletAddress)
        SmartContract->>Wallet: Request transaction approval
        Wallet->>Visitor: Approve transaction
        Visitor->>Wallet: Confirm
        Wallet->>Base: Submit transaction
        Base-->>Wallet: Transaction hash
        Wallet-->>SmartContract: Transaction submitted
        SmartContract-->>NextJS: Transaction hash

        NextJS->>NextJS: Wait for confirmation (poll Base)
        Base-->>NextJS: Transaction confirmed

        NextJS->>API: POST /api/nft/record-mint
        API->>SupabaseDB: INSERT nft_stamps record
        API->>SupabaseDB: INSERT visit record
        SupabaseDB-->>API: OK
        API-->>NextJS: Mint recorded

        NextJS-->>Visitor: Show success animation + NFT artwork
    end
```

### 5.5 State Diagram - Story Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: User starts submission
    Draft --> Validating: Submit form
    Validating --> Draft: Validation errors
    Validating --> Uploading: Validation passed
    Uploading --> Uploading: Upload media files
    Uploading --> Draft: Upload failed
    Uploading --> PendingReview: Upload complete

    PendingReview --> Flagged: Auto-moderation detects issue
    PendingReview --> Approved: Moderator approves
    PendingReview --> Rejected: Moderator rejects

    Flagged --> PendingReview: Moderator reviews
    Flagged --> Rejected: Confirmed violation

    Rejected --> [*]: Notify contributor
    Approved --> Published: Story goes live
    Published --> Archived: Admin archives
    Archived --> Published: Admin restores
    Published --> [*]: User deletes
```

### 5.6 State Diagram - NFT Campaign Status

```mermaid
stateDiagram-v2
    [*] --> Draft: Admin creates campaign
    Draft --> Scheduled: Set start date (future)
    Draft --> Active: Activate immediately

    Scheduled --> Active: Start date reached
    Scheduled --> Cancelled: Admin cancels

    Active --> Paused: Admin pauses
    Active --> Completed: End date reached
    Active --> Cancelled: Admin cancels

    Paused --> Active: Admin resumes
    Paused --> Cancelled: Admin cancels

    Completed --> [*]: Campaign ends
    Cancelled --> [*]: Campaign cancelled

    note right of Active
        Users can claim NFTs
        Visits are tracked
    end note

    note right of Paused
        No new claims allowed
        Existing progress saved
    end note
```

---

## 6\. Edge Cases and Concessions

### 6.1 Technical Edge Cases

#### 3D Rendering and Performance

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Low-end mobile devices (GPU <2GB)** | 3D map stutters or crashes | Detect GPU capabilities; auto-downgrade to 2D fallback map; show performance warning banner |
| **Slow network (<1Mbps)** | 3D tiles take >30s to load | Progressive loading with low-res preview; offline mode with cached essential tiles; bandwidth detection |
| **Safari WebGL limitations** | Some 3D features don't work | Detect browser; disable advanced shaders; show "Best viewed in Chrome" notice |
| **3D asset corruption during upload** | Cesium Ion processing fails | Validate file format pre-upload; retry mechanism; email contributor with error details |
| **Camera clipping through terrain** | User sees underground/artifacts | Clamp camera altitude to terrain height + 2m minimum; smooth collision detection |

#### Geospatial Data

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **GPS coordinates outside Kesennuma** | Story appears in wrong location | Strict bounding box validation (lat: 38.8-39.0, lon: 141.5-141.7); map picker limited to bounds |
| **Duplicate locations (same coordinates)** | Overlapping pins unclickable | Cluster nearby pins (<10m apart); expand on hover; show list view |
| **Historical coordinates drift (tectonic shift)** | Old photos misaligned with current 3D | Accept as known limitation; allow keyframe adjustments by moderators |
| **User enters decimal degrees wrong (e.g., 141.5 as 41.5)** | Invalid location | Validate coordinates within Japan bounds; show map preview before submit |

#### Content and Media

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Non-Latin characters in filenames** | Upload fails or encoding issues | Sanitize filenames to ASCII + hash; preserve original name in metadata |
| **HEIC/AVIF images from new iPhones** | Browser doesn't render | Server-side conversion to JPEG/WebP during upload; inform user of conversion |
| **Video codecs unsupported (e.g., AV1)** | Video won't play in older browsers | Transcode to H.264 fallback; warn if upload is exotic format |
| **Extremely large point clouds (>2GB)** | Processing timeout, storage costs | Hard limit at 500MB per asset; suggest downsampling tools; reject with clear error |
| **Malicious SVG with scripts** | XSS vulnerability | Sanitize SVG on upload; strip script tags; render in sandboxed iframe |

#### User Authentication and State

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Magic link opened on different device** | Auth token doesn't match session | Store token in URL; create new session on click; show warning about device mismatch |
| **User starts 3 stories, closes browser mid-upload** | Orphaned draft records | Cron job cleans up drafts >7 days old with no completed upload; local storage saves draft form |
| **Simultaneous edits by moderator and contributor** | Conflict on save | Last-write-wins; show warning "Modified by X at Y"; add version history later |
| **User deletes account mid-review** | Stories have null author | Soft-delete users; mark stories as "Anonymous" if author deleted; maintain attribution chain |

---

### 6.2 Blockchain and NFT Edge Cases

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **User scans QR code but has no wallet** | Can't claim NFT | Progressive onboarding: explain wallet need; link to Coinbase Wallet tutorial; offer to email reminder |
| **Gas price spike on Base (>$0.10)** | Users reluctant to claim | Monitor gas; pause minting if >threshold; use meta-transactions (admin pays gas) for Phase 2 |
| **User switches wallet mid-claim** | Visit history doesn't match | Lock wallet address on first scan; show warning if address changes; require re-scan |
| **Smart contract exploit or bug** | Unauthorized mints, lost NFTs | Pausable contract; admin multisig; bug bounty program; insurance fund for recovery |
| **Base network downtime** | Can't confirm transactions | Queue claims; retry on recovery; show status page; SMS notification when network is back |
| **User loses wallet private key** | Can't access NFTs | Soulbound tokens can't be transferred anyway; offer commemorative PDF backup; educate on wallet security |
| **Multiple people share QR code photo online** | Stamp farming without physical visit | Rate limit claims per campaign ID per hour; geolocation verification (optional, privacy tradeoff); unique time-limited codes |
| **Campaign ends while user is mid-claim** | Transaction submitted after deadline | Grace period: accept transactions up to 10 minutes after end time; clearly display countdown |

---

### 6.3 User Experience Edge Cases

#### Itinerary Playback

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **User pauses tour and explores for 30 minutes** | Forgets where they were | "Resume Tour" button persists; show minimap with tour path highlighted; save progress in localStorage |
| **Itinerary has 1 stop removed after user starts** | Broken reference, error on "Next" | Check stop existence before transition; skip deleted stops; notify user "1 stop unavailable" |
| **Camera animation interrupted by low battery mode** | Tour stops mid-flight | Detect reduced motion preference; offer instant jumps instead; save battery mode |
| **User rotates device during cinematic camera** | Orientation breaks layout | Lock orientation during tour; show rotate icon; pause/resume on orientation change |

#### Accessibility

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Screen reader users can't navigate 3D map** | Inaccessible to blind users | Provide text-only "story list" view; keyboard navigation for pins; ARIA labels on all controls |
| **Colorblind users can't distinguish tag colors** | Tags unreadable | Use icons + patterns in addition to colors; test with colorblind simulators |
| **Users with motion sensitivity** | Camera animations cause nausea | Detect `prefers-reduced-motion`; disable animations; offer "teleport" mode |
| **Users with cognitive disabilities** | Complex UI overwhelming | Simplified "Stories Only" mode; clear language (CEFR A2 level); consistent navigation |

#### Language and Localization

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Japanese text wraps incorrectly** | Line breaks mid-word | Use `word-break: keep-all` for CJK; proper `lang` attributes; test with long katakana words |
| **Mixed Japanese/English content** | Inconsistent fonts | Font stack: Noto Sans JP for Japanese, Inter for Latin; fallback to system fonts |
| **User browser set to unsupported language** | UI shows English anyway | Detect locale; show language picker; prioritize Japanese/English; gracefully fallback |
| **Date/time format confusion (US vs Japan)** | Users misread timestamps | Always use ISO 8601 with timezone; localized display (YYYY年MM月DD日 for Japanese) |

---

### 6.4 Content Moderation Edge Cases

| Edge Case | Impact | Mitigation Strategy |
|-----------|--------|-------------------|
| **Spam bot submits 100 stories** | DB flooded, moderators overwhelmed | Rate limit: 3 submissions per user per day; CAPTCHA on repeat submissions; auto-flag duplicates |
| **Contributor posts copyrighted images** | DMCA takedown risk | Terms of Service require original content; DMCA agent contact; remove on complaint |
| **Inappropriate content uploaded (nudity, violence)** | Harms reputation, legal risk | Client-side image hash check against database; AWS Rekognition for auto-flagging; manual review queue |
| **Political/controversial content** | Community conflict | Clear content policy: focus on culture/history/experiences; moderators can mark "sensitive" |
| **No moderators available for 48 hours** | Pending stories pile up | Email digest to backup moderators; public queue shows "review time: ~3 days"; auto-approve trusted users (Phase 2) |

---

### 6.5 Design Concessions and Known Limitations

#### Phase 1 Scope Reductions

| Concession | Reasoning | Workaround / Future Plan |
|------------|-----------|-------------------------|
| **No real-time collaborative editing** | Complexity, server costs | Contributors edit independently; moderators can edit approved stories; consider in Phase 3 |
| **No offline mode for 3D map** | Cesium tiles are huge (GB); complex cache logic | Offer downloadable PDF itineraries; show cached 2D map; Service Worker for Phase 2 |
| **No AI auto-translation** | API costs ($0.02/story), accuracy concerns | Manual translations by volunteers; highlight machine-translated badge; may add in Phase 2 with budget |
| **No advanced analytics dashboard** | Dev time vs value | Use Plausible Analytics for pageviews; Google Analytics for events; build custom dashboard in Phase 2 |
| **No mobile native app** | Platform fragmentation, app store fees | Progressive Web App (PWA) with install prompt; push notifications via web; revisit if >10k MAU |

#### Intentional Tradeoffs

| Decision | Full Expected Behavior | Actual Behavior | Justification |
|----------|----------------------|-----------------|---------------|
| **Soulbound NFTs (non-transferable)** | Users can trade/sell NFTs | NFTs locked to wallet | Preserves proof-of-visit authenticity; avoids speculation; aligns with community values |
| **Magic link auth only (no password)** | Users have persistent login | Login expires after 7 days | Reduces friction for casual contributors; less security risk; Supabase best practice |
| **Single image per story cover** | Multiple cover images in carousel | One cover image only | Simplifies card UI; faster page load; users can add more images in content blocks |
| **Moderator approval required** | Auto-publish user content | Manual review before publish | Protects quality and community standards; prevents spam; acceptable <24hr delay |
| **No video streaming (direct CDN serve)** | Adaptive bitrate streaming | Single MP4 file served | Reduces infrastructure complexity; Supabase CDN is fast; can add HLS encoding in Phase 2 |

#### Performance Compromises

| Metric | Ideal Target | Realistic Target | Reason for Gap |
|--------|--------------|------------------|----------------|
| **3D map initial load** | <2 seconds | <5 seconds | Cesium library is 3MB; terrain tiles are large; acceptable for immersive experience |
| **Time to Interactive (TTI)** | <3 seconds | <6 seconds | Next.js hydration + 3D engine init; optimize in Phase 2 with lazy loading |
| **Mobile data usage per session** | <10 MB | <50 MB | 3D tiles and images; show data warning; offer "lite mode" |
| **NFT mint confirmation** | <5 seconds | <30 seconds | Base network finality; show progress spinner; acceptable for one-time action |
| **Search results latency** | <200ms | <1 second | PostGIS queries on large datasets; add indexes and caching in Phase 2 |

---

### 6.6 Accepted Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation Plan |
|------|-----------|--------|-----------------|
| **Supabase free tier exceeded** | Medium | High (site goes down) | Monitor usage weekly; upgrade to Pro ($25/mo) at 50k MAU; set up billing alerts |
| **Cesium Ion quota exhausted** | Low | Medium (can't process 3D assets) | Track uploads; limit to 10 assets/month Phase 1; paid plan at $199/mo if needed |
| **GDPR/privacy complaints** | Low | High (legal liability) | Clear privacy policy; cookie consent; right-to-delete endpoint; GDPR-compliant hosting (Supabase EU region) |
| **Smart contract immutability bug** | Low | Critical (can't fix NFTs) | Thorough audit pre-deploy; pausable contract; proxy pattern for upgrades; insurance fund |
| **Contributor disputes authorship** | Medium | Medium (reputation damage) | Email confirmation for all submissions; Terms of Service agreement; DMCA process |
| **Malicious 3D model crashes browsers** | Low | Medium (bad UX) | Validate file structure; sandbox 3D viewer in iframe; size limits; manual review |
| **Low adoption (<100 users in 6 months)** | Medium | High (project deemed failure) | Soft launch with Tourism Association; partner with local businesses; press outreach; iterate based on feedback |

---

### 6.7 Browser and Device Compatibility

#### Minimum Supported Environments

| Platform | Minimum Version | Known Limitations |
|----------|----------------|-------------------|
| **Chrome/Edge** | 90+ (2021) | Full support |
| **Firefox** | 88+ (2021) | Some Cesium shaders slower; acceptable |
| **Safari Desktop** | 14+ (2020) | WebGL context limits; may need page refresh after extended use |
| **Safari iOS** | 14+ (2020) | Reduced 3D quality on older iPhones (<iPhone 12); disable shadows |
| **Android Chrome** | 90+ (2021) | Full support on mid-range devices (Snapdragon 600+) |
| **Internet Explorer** | Not supported | Redirect to modern browser download page |

#### Graceful Degradation Plan

1. **No WebGL 2.0** → Fallback to Mapbox GL 2D map with markers
2. **No JavaScript** → Static site with story index and text-only content
3. **No Web3 wallet support** → Hide NFT features; show explainer about browser limitations
4. **Poor network (<0.5 Mbps)** → Show low-bandwidth mode toggle; disable 3D previews

---

### 6.8 Data Consistency and Edge Cases

| Scenario | Issue | Resolution |
|----------|-------|------------|
| **Story deleted while user is reading** | 404 error mid-session | Soft-delete only; show "Story removed" message; keep content in DB for 30 days |
| **Tag renamed while user has old cache** | Tag filter shows no results | Versioned tag slugs; API returns both old and new names; cache bust on tag changes |
| **Itinerary re-ordered after user starts** | Next button skips or repeats stops | Lock itinerary version when user starts; show update banner; offer to restart |
| **NFT campaign deactivated mid-scan** | Claim page shows inactive campaign | Check status before QR redirect; show expiry message; log attempt for analytics |
| **Media file deleted from CDN** | Broken images in stories | Retain file references; periodic health check; show placeholder + report button |

---

### 6.9 Out-of-Scope Edge Cases (Won't Fix in Phase 1)

- **Time-based content (stories only visible certain hours)** → Adds complexity; use featured/archival status instead
- **Multi-author stories** → One contributor per story; they can credit others in text
- **Nested itineraries (sub-tours within tours)** → Flat structure only; curate multiple itineraries instead
- **Advanced 3D annotations (arrows, labels)** → Use image overlays or descriptive text; defer to Phase 3
- **Story versioning/edit history** → Last-edit-wins; moderators can restore from backups if needed
- **User roles beyond contributor/moderator** → Binary permission model for Phase 1; add roles in Phase 2
- **Webhooks for external integrations** → API-first design allows future integrations; not prioritized now
- **Automatic itinerary generation from AI** → Manual curation only; may explore in Phase 3
- **Live streaming or 360° video** → Pre-recorded video only; streaming is expensive and complex

---

### 6.10 Future-Proofing Considerations

**Design decisions to support future enhancements:**

- Database schema uses `JSONB` columns for flexible metadata extension
- NFT contract is upgradeable via proxy pattern (OpenZeppelin)
- API routes versioned (`/api/v1/stories`) for backward compatibility
- 3D viewer component abstracted; can swap Cesium for other engines
- Story content uses block-based system; easy to add new block types
- Modular Next.js architecture; pages can be split into micro-frontends
- Supabase RLS policies allow fine-grained permissions as roles expand

**Known technical debt to address:**

1. **No database migrations framework** → Using Supabase dashboard; will add Prisma Migrate in Phase 2
2. **No end-to-end tests** → Unit tests only; will add Playwright tests before public launch
3. **No image CDN optimization** → Using Supabase's basic CDN; may add Cloudinary/ImageKit later
4. **Hard-coded configuration** → Move to environment variables + feature flags for Phase 2
5. **No monitoring/alerting** → Add Sentry for errors, Uptime Robot for availability in Phase 2

## 7\. Open Questions

### 7.1 Technical Decisions Pending

#### Database and Infrastructure

| Question | Context | Options | Decision Needed By |
|----------|---------|---------|-------------------|
| **SQLite vs PostgreSQL for production?** | Current schema uses SQLite (dev only). README spec assumes Supabase PostgreSQL. | 1) Keep SQLite + deploy on Fly.io/Railway<br>2) Migrate to Supabase PostgreSQL (preferred)<br>3) Self-hosted PostgreSQL | Before Phase 1 deployment |
| **Database migration strategy** | No migrations framework currently. Using Prisma but need migration workflow. | 1) Prisma Migrate<br>2) Raw SQL migrations<br>3) Supabase Dashboard (manual) | Before first production deploy |
| **Hosting provider for Next.js app** | Need deployment target for Phase 1. | 1) Vercel (easiest Next.js hosting)<br>2) Netlify<br>3) Railway/Fly.io<br>4) AWS/GCP (more complex) | Within 2 weeks |
| **CDN strategy for 3D assets** | Cesium tiles and large media files need efficient delivery. | 1) Supabase Storage + CDN<br>2) Cloudflare R2 + CDN<br>3) AWS S3 + CloudFront | Before beta testing |

#### Blockchain Implementation

| Question | Context | Options | Decision Needed By |
|----------|---------|---------|-------------------|
| **NFT smart contract development approach** | No blockchain code in repo yet. Need Solidity contracts. | 1) Build from scratch (ERC-721)<br>2) Use OpenZeppelin templates<br>3) Fork existing soulbound token contract (e.g., POAP)<br>4) Use thirdweb SDK (no-code) | Before NFT feature development |
| **Who deploys and manages smart contracts?** | Contracts are immutable. Need multisig or admin key management. | 1) Team holds private key (risky)<br>2) Multisig wallet (Gnosis Safe)<br>3) Timelock contract<br>4) DAO governance (Phase 3) | Before contract deployment |
| **Gas fee payment model** | Visitors may not have ETH on Base. Who pays gas? | 1) Users pay their own gas (~$0.01)<br>2) Gasless transactions via relayer (admin pays)<br>3) Hybrid: first NFT free, rest user-paid | Before NFT beta |
| **NFT metadata storage** | Where to host NFT artwork and metadata? | 1) IPFS (decentralized, slower)<br>2) Arweave (permanent, upfront cost)<br>3) Supabase Storage (centralized, easy) | Before first campaign launch |

#### 3D Platform Integration

| Question | Context | Options | Decision Needed By |
|----------|---------|---------|-------------------|
| **3D terrain data source** | Need high-resolution terrain for Kesennuma. Cesium World Terrain may be insufficient. | 1) Cesium World Terrain (free, medium quality)<br>2) Custom terrain from JAXA AW3D (high quality, manual processing)<br>3) Google Earth Engine (if accessible) | Before Phase 1 launch |
| **Photogrammetry/3D asset acquisition** | Who creates 3D models of landmarks (Pier 7, etc.)? | 1) Contract drone photogrammetry service<br>2) Tourism Association provides assets<br>3) Community-sourced (Phase 2)<br>4) Use generic 3D models temporarily | Within 1 month |
| **Cesium Ion usage limits** | Free tier: 5GB storage, 50k tile requests/month. Will we exceed? | 1) Stay on free tier, optimize usage<br>2) Budget $200/mo for Plus plan<br>3) Self-host tiles (complex) | Monitor after beta launch |

---

### 7.2 Content and Policy Questions

#### Content Moderation

| Question | Stakeholders | Notes |
|----------|--------------|-------|
| **Who are the official moderators?** | Tourism Association, development team | Need names, contact info, backup moderators |
| **Moderation SLA (Service Level Agreement)** | Contributors, public | Target: <24hr for story approval? <1hr for urgent content removal? |
| **Content policy for political/sensitive topics** | Community, businesses | Tohoku earthquake content allowed? Political figures? Labor disputes? |
| **Copyright policy enforcement** | Contributors, Tourism Association | Require photo ownership certification? DMCA agent contact? |
| **Liability for user-generated content** | Legal, developers | Need Terms of Service review by lawyer? Disclaimer language? |

#### Data Ownership and Privacy

| Question | Stakeholders | Notes |
|----------|--------------|-------|
| **Who owns contributed stories?** | Contributors, platform | Creative Commons license? Platform can reuse content? Contributors retain rights? |
| **Can contributors delete their stories?** | Contributors, moderators | Full deletion or just hide from public? What if featured in itinerary? |
| **GDPR/privacy compliance** | EU visitors, legal | Cookie consent banner needed? Data retention policy? Right to be forgotten? |
| **Wallet addresses = personal data?** | NFT claimers, legal | Are blockchain addresses PII under GDPR? Can we legally store them? |

#### Localization and Accessibility

| Question | Stakeholders | Notes |
|----------|--------------|-------|
| **Primary language: Japanese or English?** | Visitors, contributors | UI language priority? Story submission in which language(s)? |
| **Translation workflow for stories** | Contributors, moderators | Auto-translate with disclaimer? Require manual translations? Both languages mandatory? |
| **Accessibility compliance level** | Disabled users, legal | Target WCAG 2.1 Level AA? Government standards (JIS X 8341)? |
| **Furigana for kanji?** | Non-native readers | Add reading aids to Japanese text? Automatic or manual? |

---

### 7.3 Stakeholder Approvals and Partnerships

#### Kesennuma Tourism Association

| Question | Status | Action Required |
|----------|--------|----------------|
| **Formal partnership agreement** | Unknown | Written MOU? Verbal agreement sufficient for hackathon? |
| **Content licensing for existing materials** | Unknown | Can we republish photos/videos from kesennuma-kanko.jp? |
| **Official endorsement/branding** | Unknown | Can we use their logo? Say "official partner"? |
| **Staff access to admin panel** | Unknown | How many accounts? Training needed? |
| **Budget contribution** | Unknown | Will they fund hosting/infrastructure ($50-100/mo)? |

#### Local Businesses and Campaign Creators

| Question | Status | Action Required |
|----------|--------|----------------|
| **NFT campaign creation process** | Not defined | Self-service portal or request-based? Approval needed? |
| **QR code printing and distribution** | Not defined | Who prints QR codes? Weatherproof signs? Physical placement permissions? |
| **Campaign fees** | Not defined | Free for Phase 1? Revenue share model later? |
| **Business verification** | Not defined | How to verify legitimate businesses vs spam? |

#### Government and Legal

| Question | Status | Action Required |
|----------|--------|----------------|
| **Local government approval** | Unknown | Does Kesennuma city hall need to approve? Public notice required? |
| **Drone/photography permits** | Unknown | If capturing 3D assets, any restricted areas? |
| **Business registration** | Unknown | Is this a commercial project? Non-profit? Hackathon project only? |
| **Tax implications for NFTs** | Unknown | Are NFTs taxable in Japan? Disclosure requirements? |

---

### 7.4 Budget and Funding

| Item | Estimated Cost | Funding Source | Confirmed? |
|------|---------------|----------------|-----------|
| **Supabase Pro** | $25/month | Unknown | ❌ |
| **Vercel Pro** (if needed) | $20/month | Unknown | ❌ |
| **Cesium Ion Plus** (if needed) | $200/month | Unknown | ❌ |
| **Domain name** | $15/year | Unknown | ❌ |
| **Smart contract audit** | $3,000-10,000 | Unknown | ❌ |
| **Base ETH for gas** (admin wallet) | $100 | Unknown | ❌ |
| **3D photogrammetry service** | $500-2,000 | Tourism Association? | ❌ |
| **Developer time** (Phase 1) | Volunteer? | Hackathon project | ⚠️ |

**Total Phase 1 Estimate:** $4,000-12,000 + $65-245/month ongoing

**Questions:**
- Is this a funded project or volunteer/open-source?
- Grant opportunities? Japanese government tourism grants? Blockchain/web3 grants?
- Sponsorship from Coinbase (Base chain) or Cesium?

---

### 7.5 Timeline and Milestones

| Milestone | Target Date | Blocker(s) | Owner |
|-----------|-------------|-----------|--------|
| **Hackathon demo** | ? | Need confirmation of hackathon dates | Team |
| **Database migration to PostgreSQL** | ? | Hosting provider decision | Backend dev |
| **Smart contract deployment** | ? | Contract development approach decision, audit | Blockchain dev |
| **3D terrain integration** | ? | Terrain data source decision | 3D/Frontend dev |
| **Beta launch (private)** | ? | Moderator onboarding, content policy | PM |
| **Public launch** | ? | All blockers above, legal review | All |

**Questions:**
- What is the Kesennuma Hackatsuon 2025 end date?
- Is there a post-hackathon continuation plan?
- Who maintains the platform after hackathon?

---

### 7.6 User Research and Validation

#### Assumptions to Test

| Assumption | Risk if Wrong | Validation Method |
|------------|--------------|-------------------|
| **Visitors want 3D exploration** | Complexity outweighs value; users prefer simple map | User testing with 5-10 tourists; analytics on 3D vs 2D usage |
| **Contributors will submit quality stories** | Spam/low-quality content overwhelms moderators | Soft launch with invite-only contributors; monitor submission quality |
| **NFT stamp rallies drive tourism** | Feature unused; development wasted | Survey: would you visit Kesennuma for digital collectibles? Look at EXPO 2025 data |
| **Users understand blockchain/wallets** | High drop-off on NFT claim flow | Prototype testing; measure conversion rate QR scan → NFT claimed |
| **Japanese users want English content** | Translation effort wasted | Analytics on language preference; survey bilingual users |

#### Research Questions

- **Have potential users been interviewed?** Tourists? Residents? Business owners?
- **Is there a survey or focus group planned?**
- **Competitive analysis:** How do users currently discover Kesennuma? What apps/sites do they use?
- **Accessibility testing:** Have users with disabilities tested the prototype?

---

### 7.7 Open Technical Risks

| Risk | Likelihood | Mitigation Strategy | Owner |
|------|-----------|---------------------|--------|
| **Cesium.js bundle size kills mobile performance** | Medium | Lazy load Cesium, offer 2D fallback, performance testing on low-end devices | Frontend dev |
| **No developer familiar with Solidity** | High? | Contract template approach, hire/consult blockchain dev, use thirdweb no-code | TBD |
| **Supabase RLS policies too complex** | Medium | Start with simple admin-only writes, iterate permissions in Phase 2 | Backend dev |
| **User confusion about wallet setup** | High | Progressive disclosure, walkthroughs, skip NFTs for now | UX/Product |
| **Terrain data too large for free tier** | Medium | Use lower-resolution terrain, tile optimization, budget for paid tier | 3D dev |

---

### 7.8 Post-Hackathon Sustainability

**Critical Questions:**

1. **Who maintains the codebase after hackathon?**
   - Open source with no dedicated maintainer?
   - Tourism Association hires developer?
   - Original team continues as volunteers?

2. **Ongoing costs: who pays?**
   - Tourism Association operational budget?
   - Sponsorship/grants?
   - Ads or premium features (controversial)?

3. **Infrastructure management:**
   - Who has access to production servers/databases?
   - Incident response plan if site goes down?
   - Security update policy?

4. **Content moderation at scale:**
   - If 1,000+ stories submitted, can volunteer moderators keep up?
   - Paid moderation staff needed?

5. **Community governance:**
   - How are feature decisions made?
   - Can community vote on changes?
   - Role of original developers vs Tourism Association?

6. **Replication for other communities:**
   - Documentation for other cities to fork this?
   - Support model for derivative projects?
   - Trademark/branding considerations?

---

### 7.9 Immediate Blockers (Need Resolution ASAP)

**🚨 High Priority:**

1. ✅ **Confirm hackathon deadline** → Determines MVP scope
2. ✅ **Choose production database** (SQLite vs PostgreSQL) → Blocks schema design
3. ✅ **Assign moderator role** → Need real person for testing approval flow
4. ✅ **Decide on smart contract approach** → Blocks NFT feature development
5. ✅ **Secure Kesennuma 3D terrain data** → Blocks realistic demo

**⚠️ Medium Priority (before Phase 1 launch):**

6. Get Tourism Association content license → Blocks initial story seeding
7. Finalize hosting provider → Blocks deployment setup
8. Draft Terms of Service / Privacy Policy → Legal risk
9. Create moderator documentation → Training materials needed
10. Set up error monitoring (Sentry) → Production debugging

**ℹ️ Low Priority (can defer to Phase 2):**

11. Accessibility audit → Improve over time
12. Multi-language AI translation → Manual for now
13. Advanced analytics → Basic metrics sufficient initially
14. Backup/disaster recovery plan → Less critical for beta

## 8\. Glossary / References

### 8.1 Technical Terms

#### General Platform Terms

- **Digital Twin** -- A virtual 3D representation of a physical place (Kesennuma) that mirrors real-world geography, terrain, and landmarks
- **Geospatial Data** -- Information that has a geographic component, including coordinates (latitude/longitude), elevation, and spatial relationships
- **Keyframe** -- A specific camera position/angle/zoom in the 3D viewer, saved to optimally display a story or location
- **Itinerary** -- A curated sequence of locations/stories with guided camera transitions between stops
- **Story** -- User-generated content (text, images, videos, 3D assets) tied to a specific geographic location in Kesennuma
- **Content Block** -- Modular building blocks for story content (text, image, video, gallery, quote, embed, 3D model blocks)
- **Pin** -- Visual marker on the 3D map representing a story location
- **Simulated Walk** -- Animated camera transition between itinerary stops that follows terrain/paths

#### 3D and Mapping Terms

- **Cesium.js** -- Open-source JavaScript library for creating 3D globes and maps, optimized for geospatial visualization
- **Cesium Ion** -- Cloud platform for tiling, optimizing, and streaming 3D content (terrain, imagery, point clouds, models)
- **WebGL** -- Web Graphics Library, browser API for rendering interactive 3D graphics without plugins
- **Terrain Tiles** -- Pre-processed chunks of elevation data streamed progressively to render 3D landscape
- **Point Cloud** -- Collection of data points in 3D space, often from LiDAR or photogrammetry scans
- **Photogrammetry** -- Process of creating 3D models from overlapping 2D photographs
- **Mesh** -- 3D model composed of vertices, edges, and faces (e.g., .glb, .obj files)
- **Gaussian Splat** -- Emerging 3D representation technique using gaussian distributions for high-quality, real-time rendering
- **PostGIS** -- PostgreSQL extension for storing and querying geographic data with spatial indexes

#### Blockchain and Web3 Terms

- **NFT (Non-Fungible Token)** -- Unique digital asset on a blockchain, used here as proof-of-visit collectibles
- **Soulbound Token (SBT)** -- NFT that cannot be transferred or sold, permanently tied to the wallet that claimed it
- **Smart Contract** -- Self-executing code on blockchain (written in Solidity) that enforces rules without intermediaries
- **Wallet** -- Software (MetaMask, Coinbase Wallet, etc.) that stores cryptographic keys to interact with blockchain
- **Base** -- Ethereum Layer 2 blockchain built by Coinbase, offering low fees (~$0.01) and fast transactions
- **Layer 2 (L2)** -- Blockchain built on top of Ethereum (Layer 1) to improve speed and reduce costs while inheriting security
- **Gas Fee** -- Transaction cost paid to blockchain validators (miners/validators) to process operations
- **Mint** -- Process of creating and issuing a new NFT on the blockchain
- **ERC-721** -- Ethereum standard for NFTs (each token is unique)
- **MetaMask** -- Popular browser extension wallet for Ethereum and compatible chains
- **RainbowKit** -- React library for easy wallet connection UI with support for multiple wallet providers
- **WalletConnect** -- Protocol enabling mobile wallet connections via QR code scanning

#### Authentication and Database Terms

- **Magic Link** -- Passwordless authentication where users click a link sent to their email to log in
- **Supabase** -- Open-source Firebase alternative providing PostgreSQL database, authentication, storage, and real-time features
- **Row-Level Security (RLS)** -- Database security model where access rules are enforced at the row level based on user context
- **JSONB** -- PostgreSQL's binary JSON data type, allowing flexible schema and efficient querying
- **Prisma** -- TypeScript ORM (Object-Relational Mapping) that provides type-safe database access
- **ORM** -- Object-Relational Mapping, converts database tables to programming objects

#### Frontend and Development Terms

- **Next.js** -- React framework with server-side rendering, static generation, and API routes
- **Server Components** -- React components that render on the server, reducing JavaScript sent to browser
- **SSR (Server-Side Rendering)** -- Generating HTML on the server for each request (faster initial load, better SEO)
- **SSG (Static Site Generation)** -- Pre-building HTML pages at build time (fastest performance)
- **Tailwind CSS** -- Utility-first CSS framework using class names like `flex`, `text-center`, `bg-blue-500`
- **TypeScript** -- JavaScript with static type checking to catch errors during development

#### Content Moderation Terms

- **Pending Review** -- Story status after submission, awaiting moderator approval
- **Flagged** -- Story marked by auto-moderation or users for manual review due to potential policy violations
- **Approved** -- Story status after moderator review, ready to be published
- **Soft Delete** -- Marking content as deleted without removing from database (allows recovery)

---

### 8.2 Acronyms

- **API** -- Application Programming Interface
- **CDN** -- Content Delivery Network
- **CORS** -- Cross-Origin Resource Share
- **DMCA** -- Digital Millennium Copyright Act (US copyright law)
- **GDPR** -- General Data Protection Regulation (EU privacy law)
- **GPU** -- Graphics Processing Unit
- **IPFS** -- InterPlanetary File System (decentralized storage)
- **JWT** -- JSON Web Token (authentication token format)
- **L1** -- Layer 1 (base blockchain, e.g., Ethereum mainnet)
- **L2** -- Layer 2 (scaling solution built on L1)
- **MVP** -- Minimum Viable Product
- **NFT** -- Non-Fungible Token
- **PII** -- Personally Identifiable Information
- **PWA** -- Progressive Web App
- **QR Code** -- Quick Response Code (2D barcode)
- **REST** -- Representational State Transfer (API architecture)
- **RLS** -- Row-Level Security
- **SBT** -- Soulbound Token
- **SEO** -- Search Engine Optimization
- **SLA** -- Service Level Agreement
- **SQL** -- Structured Query Language
- **SSL/TLS** -- Secure Sockets Layer / Transport Layer Security
- **ToS** -- Terms of Service
- **UI/UX** -- User Interface / User Experience
- **WCAG** -- Web Content Accessibility Guidelines
- **XSS** -- Cross-Site Scripting (security vulnerability)

---

### 8.3 Key External Resources

#### Inspiration and Prior Work

- **Hiroshima Archive** -- Spatial storytelling platform with historical content overlaid on 3D maps
  - Website: [https://hiroshima.mapping.jp/index_en.html](https://hiroshima.mapping.jp/index_en.html)
  - GitHub: [https://github.com/wtnv-lab/hiroshimaArchive_OSS](https://github.com/wtnv-lab/hiroshimaArchive_OSS)
  - Creator: Hidenori Watanave

- **Kesennuma Tourism Website** -- Official tourism site with blog posts, itineraries, and local information
  - Website: [https://en.kesennuma-kanko.jp/](https://en.kesennuma-kanko.jp/)
  - Content: Sightseeing spots, events, stores, travel guides

- **Visit Kesennuma AI Route Planner** -- AI-powered itinerary generator for Kesennuma
  - Website: [https://visit-kesennuma.com/](https://visit-kesennuma.com/)

#### Technical Documentation

**Cesium**
- Cesium.js Official Docs: [https://cesium.com/docs/](https://cesium.com/docs/)
- Cesium Ion Platform: [https://ion.cesium.com/](https://ion.cesium.com/)
- Cesium Stories (inspiration): [https://ion.cesium.com/stories/viewer/?id=f86622ba-8be7-42a8-992c-81821f9d35e5](https://ion.cesium.com/stories/viewer/?id=f86622ba-8be7-42a8-992c-81821f9d35e5)
- Cesium Community Forum: [https://community.cesium.com/](https://community.cesium.com/)

**Next.js**
- Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
- Next.js 14+ App Router: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- Next.js API Routes: [https://nextjs.org/docs/pages/building-your-application/routing/api-routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

**Supabase**
- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Auth: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- Supabase Storage: [https://supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)
- PostGIS Tutorial: [https://supabase.com/docs/guides/database/extensions/postgis](https://supabase.com/docs/guides/database/extensions/postgis)

**Blockchain and NFTs**
- Base (Ethereum L2): [https://base.org/](https://base.org/)
- Base Documentation: [https://docs.base.org/](https://docs.base.org/)
- OpenZeppelin Contracts: [https://docs.openzeppelin.com/contracts/](https://docs.openzeppelin.com/contracts/)
- RainbowKit Docs: [https://www.rainbowkit.com/docs/introduction](https://www.rainbowkit.com/docs/introduction)
- ERC-721 Standard: [https://eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721)
- Soulbound Token Discussion (Vitalik): [https://vitalik.eth.limo/general/2022/01/26/soulbound.html](https://vitalik.eth.limo/general/2022/01/26/soulbound.html)

**Prisma**
- Prisma Documentation: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- Prisma Schema Reference: [https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- Prisma Migrate: [https://www.prisma.io/docs/concepts/components/prisma-migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

#### Web3 Tools
- MetaMask: [https://metamask.io/](https://metamask.io/)
- Coinbase Wallet: [https://www.coinbase.com/wallet](https://www.coinbase.com/wallet)
- WalletConnect: [https://walletconnect.com/](https://walletconnect.com/)
- thirdweb (no-code Web3): [https://thirdweb.com/](https://thirdweb.com/)
- BaseScan (Base block explorer): [https://basescan.org/](https://basescan.org/)

#### Data Sources
- OpenStreetMap: [https://www.openstreetmap.org/](https://www.openstreetmap.org/)
- JAXA AW3D Terrain Data: [https://www.eorc.jaxa.jp/ALOS/en/aw3d30/](https://www.eorc.jaxa.jp/ALOS/en/aw3d30/)
- Geospatial Information Authority of Japan: [https://www.gsi.go.jp/ENGLISH/](https://www.gsi.go.jp/ENGLISH/)

#### NFT Stamp Rally References
- EXPO 2025 Digital Wallet: [https://www.expo2025.or.jp/en/](https://www.expo2025.or.jp/en/)
- POAP (Proof of Attendance Protocol): [https://poap.xyz/](https://poap.xyz/)
- Japan NFT Stamp Rally Examples:
  - Tokyu Lines NFT Stamp Rally
  - Kansai Tourism NFT Campaigns
  - Izumo City Digital Stamp Rally

#### Accessibility Standards
- WCAG 2.1 Guidelines: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
- JIS X 8341 (Japanese accessibility standard): [https://waic.jp/](https://waic.jp/)

---

### 8.4 Design and UX Resources

- **Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Documentation**: [https://react.dev/](https://react.dev/)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/handbook/](https://www.typescriptlang.org/docs/handbook/)
- **Web Accessibility Initiative (WAI)**: [https://www.w3.org/WAI/](https://www.w3.org/WAI/)
- **Google Fonts (Noto Sans Japanese)**: [https://fonts.google.com/noto/specimen/Noto+Sans+JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP)

---

### 8.5 Deployment and DevOps

- **Vercel (Next.js hosting)**: [https://vercel.com/docs](https://vercel.com/docs)
- **Railway**: [https://docs.railway.app/](https://docs.railway.app/)
- **Fly.io**: [https://fly.io/docs/](https://fly.io/docs/)
- **GitHub Actions**: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Sentry (error monitoring)**: [https://docs.sentry.io/](https://docs.sentry.io/)
- **Plausible Analytics**: [https://plausible.io/docs](https://plausible.io/docs)

---

### 8.6 Legal and Compliance

- **GDPR Information**: [https://gdpr.eu/](https://gdpr.eu/)
- **Creative Commons Licenses**: [https://creativecommons.org/licenses/](https://creativecommons.org/licenses/)
- **Japan Personal Information Protection Act**: [https://www.ppc.go.jp/en/](https://www.ppc.go.jp/en/)
- **DMCA Information**: [https://www.dmca.com/](https://www.dmca.com/)

---

### 8.7 Community and Support

- **GitHub Repository**: [https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025](https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025)
- **Project Issues**: [https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025/issues](https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025/issues)
- **Kesennuma Hackatsuon 2025**: [Event details TBD]

---

### 8.8 Additional Reading

**Spatial Storytelling and Digital Placemaking**
- "Digital Placemaking: The Use of Social Media in Community Building" - research on community engagement through digital platforms
- "Locative Media" by Rowan Wilken - academic book on location-aware technologies and cultural impact

**Web3 and Community Tokens**
- "The Value of Blockchain Technology" (Ethereum Foundation) - understanding blockchain's role in proof-of-attendance
- "Soulbound Tokens" by Vitalik Buterin - theoretical foundation for non-transferable NFTs

**Geospatial Technology**
- Cesium Blog: [https://cesium.com/blog/](https://cesium.com/blog/) - case studies and technical tutorials
- "Web Mapping Illustrated" by Tyler Mitchell - fundamentals of online mapping

**Tourism and Technology in Japan**
- "Digital Tourism in Japan" - studies on technology adoption in Japanese tourism
- Ministry of Land, Infrastructure, Transport and Tourism (MLIT) digital tourism initiatives

---

### 8.9 Citation Format

This specification document should be cited as:

```
Kesennuma Hackatsuon 2025 Team. (2025).
Kesennuma Digital Experiences: 3D Geospatial Storytelling Platform Specification.
GitHub Repository: https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025
```

For academic or formal references:
```
@misc{kesennuma2025spec,
  title={Kesennuma Digital Experiences: 3D Geospatial Storytelling Platform Specification},
  author={Kesennuma Hackatsuon 2025 Team},
  year={2025},
  publisher={GitHub},
  url={https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025},
  note={Open-source spatial storytelling platform for community-driven tourism}
}
```

---

## Document Information

**Version**: 1.0.0
**Last Updated**: October 2025
**Status**: Living Document (subject to updates as project evolves)
**License**: MIT License
**Contributors**: Jay Matsushiba and Kesennuma Hackatsuon 2025 Team
**Contact**: [GitHub Issues](https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025/issues)

---

## Appendix: Quick Start Development Guide

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Environment Setup
1. Clone repository: `git clone https://github.com/JayMatsushiba/kesennuma-hackatsuon-2025.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. Run database migrations: `npm run db:migrate`
5. Seed sample data: `npm run db:seed`
6. Start development server: `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000)

### Key Commands
- `npm run dev` - Start Next.js development server with hot reload
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks
- `npm run type-check` - Run TypeScript type checking
- `npm run db:studio` - Open Prisma Studio database GUI
- `npm run db:reset` - Reset database (caution: deletes all data)

### Project Structure
```
kesennuma-hackatsuon-2025/
├── app/                 # Next.js 14+ App Router pages
│   ├── page.tsx        # Homepage with 3D map
│   ├── api/            # Backend API routes
│   └── layout.tsx      # Root layout component
├── lib/                # Shared utilities and helpers
│   ├── cesium.ts       # Cesium viewer initialization
│   ├── prisma.ts       # Database client
│   └── validation.ts   # Zod schemas
├── prisma/             # Database schema and migrations
│   ├── schema.prisma   # Data model definitions
│   └── seed.ts         # Sample data seeder
├── public/             # Static assets (images, icons)
├── scripts/            # Build and utility scripts
└── package.json        # Dependencies and scripts
```

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, code style, and PR guidelines (to be created).

---

**End of Specification Document**

---

*This specification serves as the single source of truth for the Kesennuma Digital Experiences platform. All implementation decisions should reference this document. Updates should be reviewed by core team members and tracked via version control.*
