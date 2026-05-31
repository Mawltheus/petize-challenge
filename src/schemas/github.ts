import { z } from "zod";

export const UserSchema = z.object({
  login: z.string(),
  avatar_url: z.string().url(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  blog: z.string().nullable(),
  twitter_username: z.string().nullable(),
  followers: z.number(),
  following: z.number(),
  public_repos: z.number(),
  html_url: z.string().url(),
});

export const RepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  updated_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type Repository = z.infer<typeof RepositorySchema>;
