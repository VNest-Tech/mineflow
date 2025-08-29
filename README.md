# MineFlow - Mining Operations Management System

A comprehensive React-based mining operations management system with real-time tracking, driver management, and delivery proof capabilities.

## Features

### Driver Dashboard
- **Real-time Dispatch Tracking**: View and manage active dispatches
- **Delivery Proof Upload**: Capture photos and videos for delivery confirmation
- **GPS Location Tracking**: Automatic location capture for deliveries
- **Status Updates**: Mark dispatches as delivered with proof
- **Statistics Dashboard**: View daily and total completion stats

### Admin Dashboard
- **Truck Management**: Track all trucks and their status
- **Order Management**: Manage customer orders and deliveries
- **Exception Handling**: Monitor and resolve operational exceptions
- **Reports & Analytics**: Comprehensive reporting and data visualization
- **User Management**: Manage drivers and system users

### Technical Features
- **Real-time Authentication**: Secure login with Supabase Auth
- **File Storage**: Photo and video upload to Supabase Storage
- **Row Level Security**: Secure data access based on user roles
- **Mobile Responsive**: Optimized for mobile devices
- **Multi-language Support**: English and Hindi support
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **UI Components**: Custom component library with Lucide icons
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd mineflow-main
npm install
```

### 2. Set up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Database Schema**
   - Go to your Supabase project SQL editor
   - Run the contents of `supabase-schema.sql`
   - This creates all necessary tables, indexes, and security policies

3. **Configure Storage**
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `mineflow-media`
   - Set the bucket to public
   - Configure CORS if needed

### 3. Environment Configuration

1. **Copy Environment Template**
   ```bash
   cp env.example .env
   ```

2. **Update Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

### Core Tables

#### `users`
- Driver and admin user profiles
- Role-based access control
- Truck assignments

#### `truck_processes`
- Dispatch tracking
- Current stage and status
- Driver assignments

#### `truck_stages`
- Individual stage tracking
- Timestamps and completion status
- Media attachments

#### `delivery_proofs`
- Photo and video uploads
- GPS location data
- Delivery notes

## Authentication & Security

### User Roles
- **Driver**: Can view and update their own dispatches
- **Admin**: Full system access
- **Supervisor**: Limited admin access
- **Operator**: Stage-specific operations
- **Dispatcher**: Dispatch management
- **Auditor**: Read-only access

### Row Level Security (RLS)
- Users can only access their own data
- Admins have full access
- Secure by default

## API Integration

### Driver Service
```typescript
// Get driver profile
const profile = await DriverService.getDriverProfile(userId);

// Get active dispatches
const dispatches = await DriverService.getDriverDispatches(driverId);

// Upload delivery proof
await DriverService.uploadDeliveryProof(dispatchId, proofData);

// Update dispatch status
await DriverService.updateDispatchStatus(dispatchId, 'delivered');
```

### Authentication
```typescript
// Sign in
const { error } = await signIn(email, password);

// Get current user
const { user } = useAuth();

// Sign out
await signOut();
```

## File Upload

### Storage Configuration
- **Bucket**: `mineflow-media`
- **Path Structure**: `delivery-proofs/{dispatchId}/{timestamp}-{type}.{ext}`
- **Supported Formats**: Images (jpg, png, webp), Videos (mp4, mov)

### Upload Process
1. Capture photo/video using device camera
2. Upload to Supabase Storage
3. Generate public URLs
4. Store metadata in database

## Mobile Optimization

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens

### Camera Integration
- Native camera access
- Photo and video capture
- Automatic file compression

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Configure CORS in Supabase dashboard
- Set up custom domain if needed

### Recommended Hosting
- **Vercel**: Easy deployment with Vite
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Enterprise hosting

## Development

### Project Structure
```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components
│   ├── Pages/          # Page components
│   └── UI/             # Reusable UI components
├── contexts/           # React contexts
├── lib/                # External library configs
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Testing

### Manual Testing Checklist
- [ ] Driver login/logout
- [ ] Dispatch viewing and updates
- [ ] Photo/video upload
- [ ] GPS location capture
- [ ] Status updates
- [ ] Mobile responsiveness
- [ ] Error handling

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check environment variables
   - Verify Supabase project settings
   - Ensure RLS policies are correct

2. **File Upload Failures**
   - Check storage bucket permissions
   - Verify CORS configuration
   - Check file size limits

3. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check network connectivity
   - Review RLS policies

### Support
For issues and questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check browser console for errors
4. Verify environment configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Supabase for the backend infrastructure
- Lucide for the icon library
- Tailwind CSS for styling
- React team for the amazing framework
