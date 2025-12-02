import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  industry: text("industry"),
  businessSize: text("business_size"),
  painPoints: text("pain_points").array(),
  timeSpent: integer("time_spent"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  emailIdx: index("contacts_email_idx").on(table.email),
  createdAtIdx: index("contacts_created_at_idx").on(table.createdAt),
}));

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  features: text("features").array(),
  image: text("image"),
  popular: boolean("popular").default(false),
});

// Admin content management tables
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }).notNull().default('text'), // text, json, url, color, boolean
  category: varchar("category", { length: 100 }).notNull().default('general'),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  image: varchar("image", { length: 500 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emailSettings = pgTable("email_settings", {
  id: serial("id").primaryKey(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  notificationEmail: varchar("notification_email", { length: 255 }).notNull(),
  emailProvider: varchar("email_provider", { length: 100 }).notNull().default('smtp'),
  smtpHost: varchar("smtp_host", { length: 255 }),
  smtpPort: integer("smtp_port"),
  smtpUser: varchar("smtp_user", { length: 255 }),
  smtpPassword: varchar("smtp_password", { length: 255 }),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced RBAC System
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  roleId: integer("role_id").notNull(),
  isActive: boolean("is_active").default(true),
  isLocked: boolean("is_locked").default(false),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lastLogin: timestamp("last_login"),
  lastPasswordChange: timestamp("last_password_change"),
  passwordExpiresAt: timestamp("password_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RBAC Roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").notNull().default([]),
  isSystem: boolean("is_system").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RBAC Permissions
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  resource: varchar("resource", { length: 100 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // create, read, update, delete, manage
  conditions: jsonb("conditions"), // JSON conditions for fine-grained permissions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Session Management
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  refreshToken: varchar("refresh_token", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastActivity: timestamp("last_activity").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_sessions_user_id_idx").on(table.userId),
  expiresAtIdx: index("user_sessions_expires_at_idx").on(table.expiresAt),
  isActiveIdx: index("user_sessions_is_active_idx").on(table.isActive),
}));

// Comprehensive Audit Logging
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: varchar("session_id", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }),
  resourceId: varchar("resource_id", { length: 100 }),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  severity: varchar("severity", { length: 20 }).default('info'), // info, warning, error, critical
  status: varchar("status", { length: 20 }).default('success'), // success, failure, pending
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
  createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  actionIdx: index("audit_logs_action_idx").on(table.action),
}));

// Security Events
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  eventType: varchar("event_type", { length: 100 }).notNull(), // login, logout, failed_login, password_change, etc.
  description: text("description"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  location: jsonb("location"), // GeoIP data
  riskScore: integer("risk_score").default(0),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Configuration Management
export const systemConfig = pgTable("system_config", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }).notNull().default('string'), // string, number, boolean, json
  category: varchar("category", { length: 100 }).notNull().default('general'),
  description: text("description"),
  isSensitive: boolean("is_sensitive").default(false),
  updatedBy: integer("updated_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics tracking
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type").notNull(),
  eventData: jsonb("event_data"),
  userId: varchar("user_id"),
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  referrer: varchar("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tracking codes management
export const trackingCodes = pgTable("tracking_codes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // gtm, facebook_pixel, google_analytics, etc.
  code: text("code").notNull(),
  placement: varchar("placement", { length: 50 }).notNull().default('head'), // head, body, both
  isActive: boolean("is_active").default(true),
  description: text("description"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content scheduling
export const scheduledContent = pgTable("scheduled_content", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type").notNull(),
  contentId: integer("content_id"),
  scheduledAction: varchar("scheduled_action").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  contentData: jsonb("content_data"),
  status: varchar("status").default("pending"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  executedAt: timestamp("executed_at"),
});

// Content backups
export const contentBackups = pgTable("content_backups", {
  id: serial("id").primaryKey(),
  backupType: varchar("backup_type").notNull(),
  backupData: jsonb("backup_data").notNull(),
  backupSize: integer("backup_size"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  restoredAt: timestamp("restored_at"),
});

// Activity logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  action: varchar("action").notNull(),
  resourceType: varchar("resource_type"),
  resourceId: varchar("resource_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email campaigns
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  targetAudience: jsonb("target_audience"),
  status: varchar("status").default("draft"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  openRate: decimal("open_rate").default("0"),
  clickRate: decimal("click_rate").default("0"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// A/B testing
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  testType: varchar("test_type").notNull(),
  variantA: jsonb("variant_a").notNull(),
  variantB: jsonb("variant_b").notNull(),
  status: varchar("status").default("draft"),
  trafficSplit: integer("traffic_split").default(50),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  conversionGoal: varchar("conversion_goal"),
  results: jsonb("results"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead scoring
export const leadScoring = pgTable("lead_scoring", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  score: integer("score").default(0),
  scoringFactors: jsonb("scoring_factors"),
  lastCalculated: timestamp("last_calculated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Performance metrics
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type").notNull(),
  metricValue: decimal("metric_value").notNull(),
  metricUnit: varchar("metric_unit"),
  timestamp: timestamp("timestamp").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertContactSchema = createInsertSchema(contacts);
export const insertTemplateSchema = createInsertSchema(templates);
export const insertSiteSettingSchema = createInsertSchema(siteSettings);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertEmailSettingSchema = createInsertSchema(emailSettings);
export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const insertTrackingCodeSchema = createInsertSchema(trackingCodes);

// New RBAC schemas
export const insertRoleSchema = createInsertSchema(roles);
export const insertPermissionSchema = createInsertSchema(permissions);
export const insertUserSessionSchema = createInsertSchema(userSessions);
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const insertSecurityEventSchema = createInsertSchema(securityEvents);
export const insertSystemConfigSchema = createInsertSchema(systemConfig);

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertEmailSetting = z.infer<typeof insertEmailSettingSchema>;
export type EmailSetting = typeof emailSettings.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertTrackingCode = z.infer<typeof insertTrackingCodeSchema>;
export type TrackingCode = typeof trackingCodes.$inferSelect;

// New RBAC types
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;
