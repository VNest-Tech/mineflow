# MineFlow Supabase Integration Setup Guide

This guide will walk you through setting up Supabase for your MineFlow application and making it fully functional.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `mineflow` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 2-3 minutes)

### 2. Get Your Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```bash
# .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important**: Never commit your `.env` file to version control!

### 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create:
- All necessary tables with proper relationships
- Indexes for performance
- Row Level Security (RLS) policies
- Sample data for categories and materials

### 5. Test the Connection

1. Start your development server: `npm run dev`
2. Open your browser and navigate to the app
3. Check the browser console for any connection errors
4. The Dashboard should now load with real-time data from Supabase

## 🔧 Advanced Configuration

### Row Level Security (RLS)

The database schema includes RLS policies that allow authenticated users to access all data. If you want to implement more restrictive access:

1. Modify the policies in `database-schema.sql`
2. Implement user authentication in your app
3. Update the policies to use user-specific conditions

### Real-time Subscriptions

The application automatically subscribes to database changes for real-time updates. This means:
- New trucks appear immediately on the dashboard
- Status changes update in real-time
- No need to refresh the page

### Database Backups

Supabase automatically creates daily backups. To manually backup:
1. Go to **Settings** → **Database**
2. Click "Create backup"
3. Download the backup file

## 📊 Data Management

### Adding Sample Data

You can add more sample data using the SQL Editor:

```sql
-- Add sample trucks
INSERT INTO trucks (truck_no, is_royalty, gross_weight, tare_weight, net_weight, current_stage, trips, orders_served) VALUES
  ('MH12AB1234', true, 15500, 8500, 7000, 'Weigh Out', 12, 8),
  ('MH14CD5678', false, 18200, 9200, 9000, 'Weigh Out', 8, 6);

-- Add sample orders
INSERT INTO orders (order_no, customer, material, ordered_qty, rate) VALUES
  ('ORD001', 'ABC Construction Pvt Ltd', 'Stone Aggregate 20mm', 500, 150),
  ('ORD002', 'XYZ Builders', 'Stone Dust', 300, 100);
```

### Data Import/Export

- **Import**: Use the SQL Editor or Supabase's table interface
- **Export**: Use the table interface to export as CSV or JSON

## 🚨 Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables" Error

**Solution**: Ensure your `.env` file exists and contains the correct values:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 2. "Failed to fetch" Errors

**Possible causes**:
- Incorrect project URL
- Invalid anon key
- Network connectivity issues
- RLS policies blocking access

**Solutions**:
- Verify your credentials in `.env`
- Check the browser console for specific error messages
- Ensure your database schema is properly set up

#### 3. Tables Not Found

**Solution**: Run the `database-schema.sql` file in your Supabase SQL Editor

#### 4. Real-time Not Working

**Possible causes**:
- Database not set up for real-time
- Network issues
- Subscription errors

**Solutions**:
- Check the browser console for subscription errors
- Verify your Supabase project supports real-time
- Restart your development server

### Debug Mode

Enable debug logging by adding this to your `.env`:

```bash
VITE_DEBUG=true
```

This will show detailed database operations in the console.

## 🔒 Security Considerations

### Environment Variables
- Never expose your Supabase credentials in client-side code
- Use environment variables for all sensitive configuration
- Consider using different keys for development and production

### Row Level Security
- The current setup allows all authenticated users full access
- Implement proper user roles and permissions for production
- Consider implementing user authentication before deploying

### API Rate Limiting
- Supabase includes rate limiting by default
- Monitor your usage in the dashboard
- Implement client-side rate limiting if needed

## 📱 Production Deployment

### Environment Setup
1. Set up production environment variables
2. Use production Supabase project
3. Configure proper RLS policies
4. Set up monitoring and alerts

### Performance Optimization
1. Monitor query performance in Supabase dashboard
2. Add database indexes for frequently queried fields
3. Implement pagination for large datasets
4. Use Supabase's built-in caching

### Monitoring
1. Set up Supabase alerts for:
   - High database usage
   - Failed queries
   - Storage limits
2. Monitor application performance
3. Set up error tracking

## 🎯 Next Steps

After successful setup:

1. **Test all features**: Ensure CRUD operations work correctly
2. **Add authentication**: Implement user login/logout
3. **Customize data**: Add your specific business logic
4. **Deploy**: Move to production environment
5. **Monitor**: Set up monitoring and alerting

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase project configuration
3. Ensure the database schema is properly set up
4. Check the troubleshooting section above
5. Consult Supabase documentation and community forums

---

**Happy coding! 🚀**

Your MineFlow application is now fully integrated with Supabase and ready for real-time data management!
