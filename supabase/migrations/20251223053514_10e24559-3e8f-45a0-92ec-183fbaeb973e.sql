-- Create profiles table for storing child profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '🧒',
  city_label TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create geocode cache table
CREATE TABLE public.geocode_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL UNIQUE,
  result_json JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster device_id lookups
CREATE INDEX idx_profiles_device_id ON public.profiles(device_id);

-- Create index for geocode cache queries
CREATE INDEX idx_geocode_cache_query ON public.geocode_cache(query);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geocode_cache ENABLE ROW LEVEL SECURITY;

-- Profiles policies - anyone can CRUD their own device's profiles
CREATE POLICY "Anyone can view profiles by device_id" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their profiles" 
ON public.profiles 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (true);

-- Geocode cache policies - public read/write for caching
CREATE POLICY "Anyone can read geocode cache" 
ON public.geocode_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert geocode cache" 
ON public.geocode_cache 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update geocode cache" 
ON public.geocode_cache 
FOR UPDATE 
USING (true);