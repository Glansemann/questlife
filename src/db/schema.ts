import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ---- Auth (NextAuth) ----
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// ---- QuestLife Core ----

export const stats = sqliteTable("stats", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  strength: integer("strength").notNull().default(0),
  knowledge: integer("knowledge").notNull().default(0),
  creativity: integer("creativity").notNull().default(0),
  social: integer("social").notNull().default(0),
  endurance: integer("endurance").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: text("last_active_date"),
});

export const goals = sqliteTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(), // fitness, learning, social, finance, creativity, health
  description: text("description"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const quests = sqliteTable("quests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  goalId: text("goal_id").references(() => goals.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("normal"), // easy, normal, hard, epic
  xpReward: integer("xp_reward").notNull().default(50),
  statType: text("stat_type").notNull(), // strength, knowledge, creativity, social, endurance
  status: text("status").notNull().default("active"), // active, completed, expired, skipped
  date: text("date").notNull(), // YYYY-MM-DD
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  key: text("key").notNull(), // unique achievement identifier
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questId: text("quest_id").references(() => quests.id),
  type: text("type").notNull(), // quest_completed, level_up, achievement_unlocked, streak
  xpGained: integer("xp_gained").default(0),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ---- Guilds (friend groups) ----

export const guilds = sqliteTable("guilds", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  inviteCode: text("invite_code").unique(),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const guildMembers = sqliteTable("guild_members", {
  id: text("id").primaryKey(),
  guildId: text("guild_id").notNull().references(() => guilds.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // leader, member
  joinedAt: integer("joined_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
