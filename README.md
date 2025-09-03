# SwipePlans - Group Decision Making App

![App Preview](https://imgix.cosmicjs.com/094f1b40-88db-11f0-8af5-6d65ce6e8553-photo-1551218808-94e220e084d2-1756913478190.jpg?w=1200&h=300&fit=crop&auto=format,compress)

SwipePlans is a mobile-first group decision making platform that eliminates the awkwardness of choosing activities together. Create custom tile sets, share unique access codes, and let everyone swipe anonymously on options. Only unanimous matches get revealed - no hurt feelings, just fun group decisions!

## ✨ Features

- 📱 **Mobile-First Tinder-Style Interface** - Intuitive swipe gestures for decision making
- 🎯 **Custom Tile Set Creation** - Build personalized collections of options with rich media
- 🔐 **Secure Access Code Sharing** - Generated codes like "WEEKEND2024" for easy group access
- 🤝 **Anonymous Group Swiping** - Privacy-first design prevents hurt feelings
- 🎉 **Smart Match Detection** - Automatic celebration when everyone agrees
- 🏷️ **Rich Content Support** - Images, descriptions, external links, and category tagging
- 📊 **Session Tracking** - Monitor participation and completion status
- 🎭 **Multiple Categories** - Movies, Activities, Restaurants, Date Night, Travel, Books

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68b85dfa66cccb5104c6ff67&clone_repository=68b860e766cccb5104c6ff8f)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to create a mobile website that is similar function to Tinder where you swipe on things, right for yes and left for no, but the things are tiles filled with whatever you want (movies to watch, date night, various activities, book club ideas) you name it. I want you to be able to create the list of things that will appear in the swiping options and then I want you to be able to create a unique code that unlocks that set of tiles. You then send the code out to whoever you want (friends, family, partners) and then they can use the code to unlock the set of tiles to swipe on. From there they can swipe right on the ones that are a yes and left on a no, and then just like tinder, if everyone in the group swipes right on something then it's a match and everyone can know about the match, and if it's a no then no one is notified that there isn't a match. Essentially this mobile site is a way for people to decide on things as a group without having to discuss it or have their feelings hurt on if there isn't a match. Can we build this?"

### Code Generation Prompt

> Create the mobile app for this swiping idea and connect it with the Cosmic CMS. I want to create a mobile website that is similar function to Tinder where you swipe on things, right for yes and left for no, but the things are tiles filled with whatever you want (movies to watch, date night, various activities, book club ideas) you name it. I want you to be able to create the list of things that will appear in the swiping options and then I want you to be able to create a unique code that unlocks that set of tiles. You then send the code out to whoever you want (friends, family, partners) and then they can use the code to unlock the set of tiles to swipe on. From there they can swipe right on the ones that are a yes and left on a no, and then just like tinder, if everyone in the group swipes right on something then it's a match and everyone can know about the match, and if it's a no then no one is notified that there isn't a match. Essentially this mobile site is a way for people to decide on things as a group without having to discuss it or have their feelings hurt on if there isn't a match. Can we build this?

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🚀 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless content management
- **Framer Motion** - Smooth swipe animations
- **React Hook Form** - Form management
- **Vercel** - Deployment platform

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. **Clone this repository**
```bash
git clone <repository-url>
cd swipeplans
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your Cosmic credentials in `.env.local`:**
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

5. **Run the development server**
```bash
bun dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📚 Cosmic SDK Examples

### Fetch Tile Sets by Access Code
```javascript
import { cosmic } from '@/lib/cosmic'

// Find tile set by access code
const tileSet = await cosmic.objects.findOne({
  type: 'tile-sets',
  'metadata.access_code': 'WEEKEND2024'
}).depth(1)
```

### Get Tiles for Swiping
```javascript
// Get all tiles for a specific tile set
const tiles = await cosmic.objects.find({
  type: 'tiles',
  'metadata.tile_set': tileSetId
}).props(['id', 'title', 'metadata']).depth(1)
```

### Record Swipe Results
```javascript
// Save a user's swipe decision
await cosmic.objects.insertOne({
  type: 'swipe-results',
  title: `${sessionId}-${tileId}-swipe`,
  metadata: {
    session: sessionId,
    tile: tileId,
    decision: 'Yes', // or 'No'
    timestamp: new Date().toISOString()
  }
})
```

### Create New Session
```javascript
// Start a new swiping session
const session = await cosmic.objects.insertOne({
  type: 'sessions',
  title: `Session-${participantId}`,
  metadata: {
    tile_set: tileSetId,
    participant_id: participantId,
    participant_name: displayName,
    started_date: new Date().toISOString(),
    is_complete: false
  }
})
```

## 🔌 Cosmic CMS Integration

SwipePlans uses Cosmic as the backend for all content management:

### Content Types
- **Tile Sets**: Main containers with access codes and categories
- **Tiles**: Individual swipeable options with rich media
- **Sessions**: User participation tracking
- **Swipe Results**: Individual swipe decisions
- **Matches**: Successful group consensus records

### Key Features
- **Access Code System**: Unique shareable codes for each tile set
- **Anonymous Participation**: Privacy-first design with anonymous IDs
- **Rich Media Support**: Images, descriptions, and external links
- **Category Organization**: Movies, Activities, Restaurants, Date Night, Travel, Books
- **Match Detection**: Automatic detection of unanimous group decisions

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
bun run build
```

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
```bash
bun run build
bun run export
```

1. Upload the `out` folder to Netlify
2. Configure environment variables
3. Set up continuous deployment

### Environment Variables for Production

Set these environment variables in your hosting platform:

```env
COSMIC_BUCKET_SLUG=your-production-bucket-slug
COSMIC_READ_KEY=your-production-read-key  
COSMIC_WRITE_KEY=your-production-write-key
```

## 📱 Usage

1. **Create a Tile Set**: Build a collection of options in Cosmic CMS
2. **Generate Access Code**: Share the unique code with your group
3. **Group Participation**: Friends use the code to start swiping
4. **Anonymous Swiping**: Everyone swipes yes/no on options privately
5. **Celebrate Matches**: Get notified when everyone agrees on something!

---

Built with ❤️ using [Cosmic](https://www.cosmicjs.com) - The headless CMS for modern applications.
<!-- README_END -->