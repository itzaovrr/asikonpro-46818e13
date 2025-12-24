import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating" | "popular";

interface UseProductsOptions {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { categoryId, featured, limit = 20, search, minPrice, maxPrice, sortBy = "newest" } = options;

  return useQuery({
    queryKey: ["products", { categoryId, featured, limit, search, minPrice, maxPrice, sortBy }],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured);
      }

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (minPrice !== undefined) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice);
      }

      // Apply sorting
      switch (sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        case "popular":
          query = query.order("review_count", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useProducts({ featured: true, limit });
}

export function useProductsByCategory(categoryId: string, limit = 20) {
  return useProducts({ categoryId, limit });
}
