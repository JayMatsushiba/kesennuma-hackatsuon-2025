/**
 * Database types for Supabase
 * These types match the Supabase schema created in migrations/001_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          description: string | null;
          description_en: string | null;
          latitude: number;
          longitude: number;
          altitude: number | null;
          address: string | null;
          address_en: string | null;
          location_type: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_en?: string | null;
          description?: string | null;
          description_en?: string | null;
          latitude: number;
          longitude: number;
          altitude?: number | null;
          address?: string | null;
          address_en?: string | null;
          location_type?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_en?: string | null;
          description?: string | null;
          description_en?: string | null;
          latitude?: number;
          longitude?: number;
          altitude?: number | null;
          address?: string | null;
          address_en?: string | null;
          location_type?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      stories: {
        Row: {
          id: number;
          title: string;
          title_en: string | null;
          slug: string;
          excerpt: string | null;
          excerpt_en: string | null;
          cover_image_url: string | null;
          author_id: string | null;
          location_id: string | null;
          status: string;
          featured: boolean;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          title_en?: string | null;
          slug: string;
          excerpt?: string | null;
          excerpt_en?: string | null;
          cover_image_url?: string | null;
          author_id?: string | null;
          location_id?: string | null;
          status?: string;
          featured?: boolean;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          title_en?: string | null;
          slug?: string;
          excerpt?: string | null;
          excerpt_en?: string | null;
          cover_image_url?: string | null;
          author_id?: string | null;
          location_id?: string | null;
          status?: string;
          featured?: boolean;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: number;
          name: string;
          name_en: string | null;
          slug: string;
          color: string;
          icon: string | null;
          story_count: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          name_en?: string | null;
          slug: string;
          color?: string;
          icon?: string | null;
          story_count?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          name_en?: string | null;
          slug?: string;
          color?: string;
          icon?: string | null;
          story_count?: number;
          created_at?: string;
        };
      };
      camera_keyframes: {
        Row: {
          id: string;
          story_id: number | null;
          latitude: number;
          longitude: number;
          altitude: number;
          heading: number;
          pitch: number;
          roll: number;
          description: string | null;
          description_en: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id?: number | null;
          latitude: number;
          longitude: number;
          altitude?: number;
          heading?: number;
          pitch?: number;
          roll?: number;
          description?: string | null;
          description_en?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: number | null;
          latitude?: number;
          longitude?: number;
          altitude?: number;
          heading?: number;
          pitch?: number;
          roll?: number;
          description?: string | null;
          description_en?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      nearby_locations: {
        Args: {
          lat: number;
          lng: number;
          radius_meters?: number;
          max_results?: number;
        };
        Returns: Array<{
          id: string;
          name: string;
          latitude: number;
          longitude: number;
          distance_meters: number;
        }>;
      };
      locations_in_bounds: {
        Args: {
          bottom_left_lat: number;
          bottom_left_lng: number;
          top_right_lat: number;
          top_right_lng: number;
        };
        Returns: Array<{
          id: string;
          name: string;
          latitude: number;
          longitude: number;
        }>;
      };
      get_stories_geojson: {
        Args: {
          status_filter?: string;
        };
        Returns: Array<{
          id: number;
          title: string;
          slug: string;
          excerpt: string;
          latitude: number;
          longitude: number;
          location_name: string;
          cover_image_url: string | null;
          published_at: string | null;
          tags: Array<{
            id: number;
            name: string;
            color: string;
          }>;
        }>;
      };
    };
  };
}

// Helper types for working with stories
export type StoryWithLocation = {
  id: number;
  title: string;
  title_en: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_en: string | null;
  latitude: number;
  longitude: number;
  location_name: string;
  cover_image_url: string | null;
  published_at: string | null;
  tags: Array<{
    id: number;
    name: string;
    color: string;
  }>;
};
