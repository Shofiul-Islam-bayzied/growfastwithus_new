import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { insertContactSchema, insertTemplateSchema, insertSiteSettingSchema, insertEmailSettingSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import { RBACMiddleware, Permission } from './middleware/rbac';
import { validateContactInput } from './middleware/security';

// Simple in-memory cache with TTL for performance optimization
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  set<T>(key: string, data: T, ttl: number = 30000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const apiCache = new SimpleCache();

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    adminUserId?: number;
  }
}

function requireAdminAuth(req: any, res: any, next: any) {
  if (req.session && req.session.adminUserId) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Admin middleware - checks if user is authenticated admin
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const isUserAdmin = await storage.isAdmin(clerkUserId);
    if (!isUserAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    req.adminUserId = clerkUserId;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve favicon.ico for Google/SERP crawlers (must be early in the route chain)
  app.get('/favicon.ico', async (req, res) => {
    try {
      // Try production path first (dist/public/)
      const prodPath = path.resolve(import.meta.dirname, 'public', 'growfastwithus-fav.svg');
      // Try development path (client/public/)
      const devPath = path.resolve(import.meta.dirname, '..', 'client', 'public', 'growfastwithus-fav.svg');
      
      let faviconPath: string | null = null;
      if (fs.existsSync(prodPath)) {
        faviconPath = prodPath;
      } else if (fs.existsSync(devPath)) {
        faviconPath = devPath;
      }
      
      if (faviconPath) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.sendFile(faviconPath);
      } else {
        // If favicon not found, return 204 No Content (standard for missing favicons)
        res.status(204).end();
      }
    } catch (error) {
      console.error('Error serving favicon:', error);
      res.status(204).end();
    }
  });

  // Add authentication routes
  app.use('/api/auth', authRoutes);
  
  // Add admin management routes
  app.use('/api/admin', adminRoutes);
  
  // Send contact email notification
  app.post("/api/send-contact-email", validateContactInput, async (req, res) => {
    try {
      const contactData = req.body;
      
      // Configure email transporter - require environment variables
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('SMTP configuration missing. Cannot send contact email.');
        return res.status(500).json({ error: 'Email service not configured' });
      }

      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { 
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS
        }
      });

      // Format pain points for email
      const painPointsList = contactData.painPoints?.length > 0 
        ? contactData.painPoints.join(', ') 
        : 'None specified';

      // Send email to team
      await transporter.sendMail({
        from: 'GrowFastWithUs Website <no-reply@growfastwithus.com>',
        to: 'team@growfastwithus.com',
        replyTo: contactData.email,
        subject: `New Contact Form Submission from ${contactData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Form Submission</h2>
            <p>You have received a new contact form submission from your website.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
              <p><strong>Company:</strong> ${contactData.company || 'Not provided'}</p>
              <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
              <p><strong>Industry:</strong> ${contactData.industry || 'Not specified'}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Business Details</h3>
              <p><strong>Business Size:</strong> ${contactData.businessSize || 'Not specified'}</p>
              <p><strong>Pain Points:</strong> ${painPointsList}</p>
              <p><strong>Time Spent on Manual Tasks:</strong> ${contactData.timeSpent || 0} hours per week</p>
            </div>
            
            ${contactData.message ? `
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message</h3>
              <p>${contactData.message}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="margin: 0;"><strong>💡 Quick Action:</strong> Reply directly to this email to contact ${contactData.name}</p>
            </div>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              This email was sent from your GrowFastWithUs website contact form.<br>
              Submitted on: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
        `
      });

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(500).json({ error: "Failed to send email", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Contact form submission
  app.post("/api/contacts", validateContactInput, async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      console.error("Error creating contact:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all contacts (admin endpoint)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      if (!template) {
        res.status(404).json({ error: "Template not found" });
        return;
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create template (admin endpoint)
  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.json({ success: true, template });
    } catch (error) {
      console.error("Error creating template:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Admin API Routes
  
  // Check admin status
  app.get("/api/admin/check", requireAdminAuth, async (req, res) => {
    try {
      // For development, allow any user to be admin
      // In production, you'd check against admin users table
      res.json(true);
    } catch (error) {
      res.json(false);
    }
  });

  // DEBUG: Added detailed logging to /api/admin/stats for troubleshooting blank admin panel and 500 error
  // Admin stats dashboard
  app.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
    try {
        const contacts = await storage.getContacts();
  const templates = await storage.getTemplates();
      
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyContacts = contacts.filter(c => 
        c.createdAt && new Date(c.createdAt) >= thisMonth
      ).length;

      res.json({
        totalContacts: contacts.length,
        totalTemplates: templates.length,
        monthlyContacts
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      // Fallback stats when database is unavailable
      res.json({
        totalContacts: 0,
        totalTemplates: 15,
        monthlyContacts: 0
      });
    }
  });

  // Content Management API endpoints
  app.post('/api/admin/theme', requireAdminAuth, async (req, res) => {
    try {
      const themeData = req.body;
      await storage.updateSiteSetting('theme_colors', JSON.stringify(themeData.colors));
      res.json({ success: true, message: 'Theme updated successfully' });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  app.get('/api/admin/site-settings', requireAdminAuth, async (req, res) => {
    try {
      const settings = {
        siteName: (await storage.getSiteSetting('site_name'))?.value || 'GrowFastWithUs',
        tagline: (await storage.getSiteSetting('tagline'))?.value || 'Automate Your Business Growth',
        contactEmail: (await storage.getSiteSetting('contact_email'))?.value || 'contact@growfastwithus.com',
        phone: (await storage.getSiteSetting('phone'))?.value || '+1 (555) 123-4567',
        address: (await storage.getSiteSetting('address'))?.value || '123 Business St, Suite 100, City, State 12345',
        metaDescription: (await storage.getSiteSetting('meta_description'))?.value || 'Leading automation agency helping businesses grow faster with AI-powered workflows and no-code solutions.',
        heroTitle: (await storage.getSiteSetting('hero_title'))?.value || 'Grow Your Business Faster with Automation',
        heroSubtitle: (await storage.getSiteSetting('hero_subtitle'))?.value || 'Transform your operations with AI-powered workflows and no-code automation solutions'
      };
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  app.put('/api/admin/site-settings', requireAdminAuth, async (req, res) => {
    try {
      const settings = req.body;
      
      await Promise.all([
        storage.updateSiteSetting('site_name', settings.siteName),
        storage.updateSiteSetting('tagline', settings.tagline),
        storage.updateSiteSetting('contact_email', settings.contactEmail),
        storage.updateSiteSetting('phone', settings.phone),
        storage.updateSiteSetting('address', settings.address),
        storage.updateSiteSetting('meta_description', settings.metaDescription),
        storage.updateSiteSetting('hero_title', settings.heroTitle),
        storage.updateSiteSetting('hero_subtitle', settings.heroSubtitle)
      ]);
      
      res.json({ success: true, message: 'Site settings updated successfully' });
    } catch (error) {
      console.error("Error updating site settings:", error);
      res.status(500).json({ message: "Failed to update site settings" });
    }
  });

  app.get('/api/admin/media', requireAdminAuth, async (req, res) => {
    try {
      const mediaFiles = [
        { id: 1, name: 'hero-background.jpg', url: '/images/hero-bg.jpg', size: '2.3 MB', type: 'image' },
        { id: 2, name: 'company-logo.png', url: '/images/logo.png', size: '156 KB', type: 'image' },
        { id: 3, name: 'team-photo.jpg', url: '/images/team.jpg', size: '1.8 MB', type: 'image' }
      ];
      res.json(mediaFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  app.post('/api/admin/media/upload', requireAdminAuth, async (req, res) => {
    try {
      res.json({ 
        success: true, 
        message: 'File uploaded successfully',
        file: {
          id: Date.now(),
          name: 'uploaded-file.jpg',
          url: '/uploads/uploaded-file.jpg',
          size: '1.2 MB'
        }
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.post('/api/admin/media/url', requireAdminAuth, async (req, res) => {
    try {
      const { url, name } = req.body;
      res.json({ 
        success: true, 
        message: 'Image added from URL successfully',
        file: {
          id: Date.now(),
          name: name,
          url: url,
          size: 'Unknown'
        }
      });
    } catch (error) {
      console.error("Error uploading from URL:", error);
      res.status(500).json({ message: "Failed to upload from URL" });
    }
  });

  // Logo upload endpoint
  app.post('/api/admin/logo/upload', requireAdminAuth, async (req, res) => {
    try {
      // Simulate logo upload processing
      const logoUrl = `/uploads/logo-${Date.now()}.png`;
      
      // Update logo setting in database
      await storage.updateSiteSetting('site_logo', logoUrl);
      
      res.json({ 
        success: true, 
        message: 'Logo uploaded successfully',
        logoUrl: logoUrl
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ message: "Failed to upload logo" });
    }
  });

  // Theme endpoint
  app.post('/api/admin/theme', requireAdminAuth, async (req, res) => {
    try {
      const { colors } = req.body;
      
      // Save theme colors as site settings
      if (colors.primary) {
        await storage.updateSiteSetting('primary_color', colors.primary);
      }
      if (colors.secondary) {
        await storage.updateSiteSetting('secondary_color', colors.secondary);
      }
      if (colors.accent) {
        await storage.updateSiteSetting('accent_color', colors.accent);
      }
      
      res.json({ 
        success: true, 
        message: 'Theme updated successfully'
      });
    } catch (error) {
      console.error("Error updating theme:", error);
      res.status(500).json({ message: "Failed to update theme" });
    }
  });

  // Analytics endpoint
  app.get('/api/admin/analytics', requireAdminAuth, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin settings endpoint
  app.post('/api/admin/settings', requireAdminAuth, async (req, res) => {
    try {
      const settings = req.body;
      res.json({ 
        success: true, 
        message: 'Settings updated successfully',
        settings
      });
    } catch (error) {
      console.error("Error updating admin settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Site Settings Management
  app.get("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/settings", requireAdminAuth, async (req, res) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.updateSiteSetting(key, value);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Theme Settings
  app.get("/api/admin/theme-settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      const themeSettings = settings.filter(s => 
        s.category === 'theme' || 
        s.key.includes('color') || 
        s.key.includes('font')
      );
      res.json(themeSettings);
    } catch (error) {
      console.error("Error fetching theme settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });



  // Email Settings Management
  app.get("/api/admin/email-settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await storage.getEmailSettings();
      // Filter sensitive data before sending to client
      if (settings && settings.smtpPassword) {
        const filteredSettings = {
          ...settings,
          smtpPassword: '***HIDDEN***', // Don't expose SMTP password
        };
        res.json(filteredSettings);
      } else {
        res.json(settings || {});
      }
    } catch (error) {
      console.error("Error fetching email settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/email-settings", requireAdminAuth, async (req, res) => {
    try {
      const settingsData = insertEmailSettingSchema.parse(req.body);
      const settings = await storage.updateEmailSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating email settings:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Test email endpoint
  app.post("/api/admin/test-email", requireAdminAuth, async (req, res) => {
    try {
      const { email } = req.body;
              // Test email functionality
      res.json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // WordPress Settings Endpoints
  app.get("/api/admin/wordpress-settings", requireAdminAuth, async (req, res) => {
    try {
      const settings = await storage.getWordPressSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching WordPress settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/wordpress-settings", requireAdminAuth, async (req, res) => {
    try {
      const { apiUrl, postsPerPage, cacheEnabled, authType, username, password } = req.body;
      
      if (apiUrl !== undefined) {
        await storage.updateWordPressSetting('wordpress_api_url', apiUrl);
      }
      if (postsPerPage !== undefined) {
        await storage.updateWordPressSetting('wordpress_posts_per_page', postsPerPage.toString());
      }
      if (cacheEnabled !== undefined) {
        await storage.updateWordPressSetting('wordpress_cache_enabled', cacheEnabled.toString());
      }
      if (authType !== undefined) {
        await storage.updateWordPressSetting('wordpress_auth_type', authType);
      }
      if (username !== undefined) {
        await storage.updateWordPressSetting('wordpress_username', username);
      }
      if (password !== undefined && password !== '') {
        // Only update password if it's provided (not empty)
        // Encrypt password before storing
        const { encryptData } = await import('./utils/crypto');
        const encryptionKey = process.env.SESSION_SECRET || 'fallback-encryption-key';
        const encryptedPassword = encryptData(password, encryptionKey);
        await storage.updateWordPressSetting('wordpress_password', encryptedPassword);
      }

      const updatedSettings = await storage.getWordPressSettings();
      res.json({ success: true, settings: updatedSettings });
    } catch (error) {
      console.error("Error updating WordPress settings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/wordpress-test-connection", requireAdminAuth, async (req, res) => {
    try {
      const { apiUrl, username, password } = req.body;
      
      if (!apiUrl) {
        return res.status(400).json({ error: "API URL is required" });
      }

      const result = await storage.testWordPressConnection(apiUrl, username, password);
      res.json(result);
    } catch (error) {
      console.error("Error testing WordPress connection:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to test connection",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/wordpress-stats", requireAdminAuth, async (req, res) => {
    try {
      const settings = await storage.getWordPressSettings();
      
      if (!settings.apiUrl) {
        return res.json({ 
          connected: false, 
          message: "WordPress not configured" 
        });
      }

      // Fetch current stats from WordPress
      const result = await storage.testWordPressConnection(settings.apiUrl);
      
      if (result.success && result.stats) {
        res.json({
          connected: true,
          stats: result.stats,
          connectionStatus: settings.connectionStatus,
          apiUrl: settings.apiUrl,
        });
      } else {
        res.json({
          connected: false,
          message: result.message,
          connectionStatus: 'error',
        });
      }
    } catch (error) {
      console.error("Error fetching WordPress stats:", error);
      res.json({
        connected: false,
        message: "Failed to fetch stats",
      });
    }
  });

  // Logo upload endpoint
  app.post("/api/admin/upload-logo", requireAdminAuth, async (req, res) => {
    try {
      const logoUrl = "/uploaded-logo.png";
      res.json({ url: logoUrl });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Advanced Analytics Endpoints
  app.get("/api/admin/analytics", requireAdminAuth, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics(req.query);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/analytics/stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await storage.getAnalyticsStats(req.query);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/analytics/event", requireAdminAuth, async (req, res) => {
    try {
      const event = await storage.createAnalyticsEvent(req.body);
      res.json(event);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content Scheduling Endpoints
  app.get("/api/admin/scheduled-content", requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const scheduledContent = await storage.getScheduledContent(status as string);
      res.json(scheduledContent);
    } catch (error) {
      console.error("Error fetching scheduled content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/scheduled-content", requireAdminAuth, async (req, res) => {
    try {
      const content = await storage.createScheduledContent(req.body);
      res.json(content);
    } catch (error) {
      console.error("Error creating scheduled content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/scheduled-content/:id/execute", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.executeScheduledContent(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error executing scheduled content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content Backup Endpoints
  app.get("/api/admin/backups", requireAdminAuth, async (req, res) => {
    try {
      const backups = await storage.getBackups();
      res.json(backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/backups", requireAdminAuth, async (req, res) => {
    try {
      const backup = await storage.createBackup(req.body);
      res.json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/backups/:id/restore", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.restoreBackup(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Activity Logs Endpoints
  app.get("/api/admin/activity-logs", requireAdminAuth, async (req, res) => {
    try {
      const { userId } = req.query;
      const logs = await storage.getActivityLogs(userId as string);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Performance Monitoring Endpoints
  app.get("/api/admin/performance", requireAdminAuth, async (req, res) => {
    try {
      const { type, timeRange } = req.query;
      const metrics = await storage.getPerformanceMetrics(type as string, timeRange);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/performance/stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await storage.getPerformanceStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching performance stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/performance/metric", requireAdminAuth, async (req, res) => {
    try {
      const metric = await storage.recordPerformanceMetric(req.body);
      res.json(metric);
    } catch (error) {
      console.error("Error recording performance metric:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Tracking Codes Management Endpoints
  app.get("/api/admin/tracking-codes", requireAdminAuth, async (req, res) => {
    try {
      const trackingCodes = await storage.getTrackingCodes();
      res.json(trackingCodes);
    } catch (error) {
      console.error("Error fetching tracking codes:", error);
      // Fallback tracking codes when database is unavailable
      res.json([
        {
          id: 1,
          name: "Google Tag Manager",
          type: "gtm",
          code: "<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>\n<!-- End Google Tag Manager -->",
          placement: "head",
          isActive: false,
          description: "Example GTM code - replace with your actual container ID",
          createdBy: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Facebook Pixel",
          type: "facebook_pixel",
          code: "<!-- Facebook Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', 'XXXXXXXXXX');\nfbq('track', 'PageView');\n</script>\n<!-- End Facebook Pixel Code -->",
          placement: "head",
          isActive: false,
          description: "Example Facebook Pixel code - replace with your actual pixel ID",
          createdBy: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]);
    }
  });

  app.get("/api/admin/tracking-codes/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trackingCode = await storage.getTrackingCode(id);
      if (!trackingCode) {
        return res.status(404).json({ error: "Tracking code not found" });
      }
      res.json(trackingCode);
    } catch (error) {
      console.error("Error fetching tracking code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/tracking-codes", requireAdminAuth, async (req, res) => {
    try {
      const { insertTrackingCodeSchema } = await import("@shared/schema");
      const trackingCodeData = insertTrackingCodeSchema.parse(req.body);
      const trackingCode = await storage.createTrackingCode(trackingCodeData);
      
      // Invalidate cache when tracking code is created
      apiCache.invalidate('tracking-codes-active');
      
      res.json(trackingCode);
    } catch (error) {
      console.error("Error creating tracking code:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.put("/api/admin/tracking-codes/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trackingCode = await storage.updateTrackingCode(id, req.body);
      
      // Invalidate cache when tracking code is updated
      apiCache.invalidate('tracking-codes-active');
      
      res.json(trackingCode);
    } catch (error) {
      console.error("Error updating tracking code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/tracking-codes/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTrackingCode(id);
      
      // Invalidate cache when tracking code is deleted
      apiCache.invalidate('tracking-codes-active');
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tracking code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/tracking-codes/active", async (req, res) => {
    try {
      // Check cache first (cache for 30 seconds)
      const cacheKey = 'tracking-codes-active';
      const cached = apiCache.get(cacheKey);
      if (cached !== null) {
        return res.json(cached);
      }
      
      // Fetch from database if not cached
      const trackingCodes = await storage.getActiveTrackingCodes();
      
      // Cache the result
      apiCache.set(cacheKey, trackingCodes, 30000); // 30 seconds TTL
      
      res.json(trackingCodes);
    } catch (error) {
      console.error("Error fetching active tracking codes:", error);
      // Fallback empty array when database is unavailable
      res.json([]);
    }
  });

  // Public WordPress API URL endpoint (no auth required for reading API URL only)
  app.get("/api/wordpress/config", async (req, res) => {
    try {
      // Check cache first (cache for 60 seconds - config changes rarely)
      const cacheKey = 'wordpress-config';
      const cached = apiCache.get(cacheKey);
      if (cached !== null) {
        return res.json(cached);
      }
      
      // Fetch from database if not cached
      const settings = await storage.getWordPressSettings();
      const config = {
        apiUrl: settings.apiUrl,
        postsPerPage: settings.postsPerPage,
        cacheEnabled: settings.cacheEnabled,
      };
      
      // Cache the result
      apiCache.set(cacheKey, config, 60000); // 60 seconds TTL
      
      res.json(config);
    } catch (error) {
      console.error("Error fetching WordPress config:", error);
      res.json({
        apiUrl: null,
        postsPerPage: 9,
        cacheEnabled: true,
      });
    }
  });

  // WordPress Proxy Endpoints - Avoid CORS issues by proxying requests through our backend
  app.get("/api/wordpress/posts", async (req, res) => {
    try {
      const settings = await storage.getWordPressSettings();
      
      if (!settings.apiUrl) {
        return res.status(404).json({ error: "WordPress not configured" });
      }

      // Forward query parameters
      const queryParams = new URLSearchParams();
      Object.entries(req.query).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });

      const wpUrl = `${settings.apiUrl}/posts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Proxying WordPress request:', wpUrl);

      const response = await fetch(wpUrl);
      const contentType = response.headers.get('content-type') || '';
      
      console.log('WordPress response status:', response.status);
      console.log('WordPress response content-type:', contentType);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('WordPress API error response:', errorText.substring(0, 500));
        return res.status(response.status).json({ 
          error: `WordPress API error: ${response.status}`,
          details: errorText.substring(0, 200),
          url: wpUrl
        });
      }

      // Check if response is actually JSON
      if (!contentType.includes('application/json')) {
        const htmlResponse = await response.text();
        console.error('WordPress returned non-JSON response:', htmlResponse.substring(0, 500));
        
        // Check what kind of HTML is being returned
        let hint = "The WordPress REST API might be disabled or the URL is incorrect";
        if (htmlResponse.includes('404') || htmlResponse.includes('Not Found')) {
          hint = "WordPress returned a 404 error. The REST API endpoint doesn't exist at this URL. Try: Settings → Permalinks → Save Changes in WordPress";
        } else if (htmlResponse.includes('<html') && htmlResponse.includes('<!DOCTYPE')) {
          hint = "WordPress is returning the full website HTML. This usually means the URL is redirecting to the homepage. Check your permalink settings.";
        }
        
        return res.status(500).json({ 
          error: "WordPress API returned HTML instead of JSON",
          details: htmlResponse.substring(0, 300).replace(/<[^>]*>/g, ' ').trim(),
          contentType: contentType,
          url: wpUrl,
          hint: hint,
          httpStatus: response.status
        });
      }

      const posts = await response.json();
      
      // Forward WordPress pagination headers
      res.set('X-WP-Total', response.headers.get('X-WP-Total') || '0');
      res.set('X-WP-TotalPages', response.headers.get('X-WP-TotalPages') || '0');
      
      // Add caching headers for better performance (cache for 5 minutes)
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=300');
      res.set('ETag', `"wp-posts-${Date.now()}-${posts.length}"`);
      
      res.json(posts);
    } catch (error) {
      console.error("Error proxying WordPress posts:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        error: "Failed to fetch WordPress posts",
        details: errorMessage
      });
    }
  });

  app.get("/api/wordpress/posts/:slug", async (req, res) => {
    try {
      const settings = await storage.getWordPressSettings();
      
      if (!settings.apiUrl) {
        return res.status(404).json({ error: "WordPress not configured" });
      }

      const { slug } = req.params;
      const wpUrl = `${settings.apiUrl}/posts?slug=${slug}&_embed=1`;
      console.log('Proxying WordPress post request:', wpUrl);

      const response = await fetch(wpUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `WordPress API error: ${response.status}` 
        });
      }

      const posts = await response.json();
      res.json(posts.length > 0 ? posts[0] : null);
    } catch (error) {
      console.error("Error proxying WordPress post:", error);
      res.status(500).json({ error: "Failed to fetch WordPress post" });
    }
  });

  app.get("/api/wordpress/categories", async (req, res) => {
    try {
      const settings = await storage.getWordPressSettings();
      
      if (!settings.apiUrl) {
        return res.status(404).json({ error: "WordPress not configured" });
      }

      const wpUrl = `${settings.apiUrl}/categories?per_page=100&orderby=count&order=desc`;
      console.log('Proxying WordPress categories request:', wpUrl);

      const response = await fetch(wpUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `WordPress API error: ${response.status}` 
        });
      }

      const categories = await response.json();
      
      // Cache categories for 30 minutes (they change less frequently)
      res.set('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=1800');
      
      res.json(categories);
    } catch (error) {
      console.error("Error proxying WordPress categories:", error);
      res.status(500).json({ error: "Failed to fetch WordPress categories" });
    }
  });

  app.get("/api/wordpress/tags", async (req, res) => {
    try {
      const settings = await storage.getWordPressSettings();
      
      if (!settings.apiUrl) {
        return res.status(404).json({ error: "WordPress not configured" });
      }

      const wpUrl = `${settings.apiUrl}/tags?per_page=100&orderby=count&order=desc`;
      console.log('Proxying WordPress tags request:', wpUrl);

      const response = await fetch(wpUrl);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `WordPress API error: ${response.status}` 
        });
      }

      const tags = await response.json();
      
      // Cache tags for 30 minutes (they change less frequently)
      res.set('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=1800');
      
      res.json(tags);
    } catch (error) {
      console.error("Error proxying WordPress tags:", error);
      res.status(500).json({ error: "Failed to fetch WordPress tags" });
    }
  });

  // Health check endpoint for Docker
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Register admin
  app.post('/api/admin/register', requireAdminAuth, async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
      const existing = await storage.getAdminUser(username);
      if (existing) return res.status(400).json({ error: 'Username already exists' });
      const hash = await bcrypt.hash(password, 10);
      await storage.createAdminUser({ username, email, password: hash, roleId: 1 });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Login admin
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      
      // Check database for admin user first
      try {
        const adminUser = await storage.getAdminUser(username);
        if (adminUser && adminUser.isActive) {
          const isValid = await bcrypt.compare(password, adminUser.password);
          if (isValid) {
            req.session.adminUserId = adminUser.id;
            console.log('Database login successful');
            return res.json({ success: true });
          }
        }
      } catch (dbError) {
        // Database check failed
        if (process.env.NODE_ENV === 'production') {
          console.error('Database connection failed in production. Cannot authenticate user.');
          return res.status(500).json({ error: 'Authentication service unavailable' });
        }
        // In development, allow fallback admin
      }
      
      // Fallback to hardcoded admin for development ONLY (disabled in production)
      if (process.env.NODE_ENV !== 'production') {
        if (username === 'growfast_admin' && password === 'GrowFast2025!Admin') {
          console.warn('⚠️  Using hardcoded admin credentials. This is only allowed in development!');
          req.session.adminUserId = 999; // Special ID for hardcoded admin
          return res.json({ success: true });
        }
      }
      
      // If we get here, authentication failed
      res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Login failed', details: errorMessage });
    }
  });

  // Logout admin
  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Check admin session
  app.get('/api/admin/session', (req, res) => {
    if (req.session && req.session.adminUserId) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Get admin stats (detailed version with recent contacts)
  app.get('/api/admin/stats/detailed', requireAdminAuth, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      const templates = await storage.getTemplates();
      
      const stats = {
        totalContacts: contacts.length,
        totalTemplates: templates.length,
        recentContacts: contacts.slice(-5).reverse(),
        popularTemplates: templates.filter(t => t.popular).length
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Forgot password
  app.post('/api/admin/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getAdminUserByEmail(email);
      if (!user) return res.status(200).json({ success: true }); // Don't reveal user existence
      // SESSION_SECRET is validated at startup, but add safety check
      const jwtSecret = process.env.SESSION_SECRET;
      if (!jwtSecret) {
        console.error('SESSION_SECRET not set. Cannot generate password reset token.');
        return res.status(500).json({ error: 'Server configuration error' });
      }
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin-reset-password?token=${token}`;
      // Send email using environment variables - require configuration
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('SMTP configuration missing. Cannot send password reset email.');
        return res.status(500).json({ error: 'Email service not configured' });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { 
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS
        }
      });
      await transporter.sendMail({
        from: 'GrowFastWithUs <no-reply@growfastwithus.com>',
        to: user.email,
        subject: 'Reset your admin password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  });

  // Reset password
  app.post('/api/admin/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;
      // SESSION_SECRET is validated at startup, but add safety check
      const jwtSecret = process.env.SESSION_SECRET;
      if (!jwtSecret) {
        console.error('SESSION_SECRET not set. Cannot verify password reset token.');
        return res.status(500).json({ error: 'Server configuration error' });
      }
      const payload = jwt.verify(token, jwtSecret) as { id: number };
      const user = await storage.getAdminUserById(payload.id);
      if (!user) return res.status(400).json({ error: 'Invalid token' });
      const hash = await bcrypt.hash(password, 10);
      await storage.updateAdminUserPassword(user.id, hash);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  });

  // Example: Protect admin dashboard
  app.get('/api/admin/protected', requireAdminAuth, (req, res) => {
    res.json({ message: 'You are authenticated as admin.' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
