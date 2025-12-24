import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseProductsOptions {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { categoryId, featured, limit = 20, search } = options;

  return useQuery({
    queryKey: ["products", { categoryId, featured, limit, search }],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured);
      }

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

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
        .single();

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
