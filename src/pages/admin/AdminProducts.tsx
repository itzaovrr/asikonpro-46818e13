import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo, useDeferredValue } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Pencil, Star, Search, ImagePlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  price: string;
  original_price: string;
  image_url: string;
  category_id: string;
  is_featured: boolean;
  is_pod: boolean;
  stock: string;
};

const empty: ProductForm = {
  name: "", slug: "", description: "", price: "", original_price: "",
  image_url: "", category_id: "", is_featured: false, is_pod: false, stock: "0",
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(empty);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [catFilter, setCatFilter] = useState<string>("all");
  const [sort, setSort] = useState("newest");
  const [uploading, setUploading] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, image_url, price, original_price, stock, is_featured, is_pod, category_id, description, created_at, rating, review_count")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories-select"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name");
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (catFilter !== "all") list = list.filter((p: any) => p.category_id === catFilter);
    if (dq.trim()) {
      const n = dq.toLowerCase();
      list = list.filter((p: any) => p.name.toLowerCase().includes(n) || p.slug.toLowerCase().includes(n));
    }
    list = [...list];
    if (sort === "price-asc") list.sort((a: any, b: any) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a: any, b: any) => b.price - a.price);
    else if (sort === "stock") list.sort((a: any, b: any) => (a.stock ?? 0) - (b.stock ?? 0));
    return list;
  }, [products, dq, catFilter, sort]);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name ?? "",
      slug: p.slug ?? "",
      description: p.description ?? "",
      price: String(p.price ?? ""),
      original_price: p.original_price ? String(p.original_price) : "",
      image_url: p.image_url ?? "",
      category_id: p.category_id ?? "",
      is_featured: !!p.is_featured,
      is_pod: !!p.is_pod,
      stock: String(p.stock ?? 0),
    });
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.slug || !form.price) throw new Error("Name, slug, and price are required");
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        image_url: form.image_url || null,
        category_id: form.category_id || null,
        is_featured: form.is_featured,
        is_pod: form.is_pod,
        stock: Number(form.stock || 0),
      };
      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Product updated" : "Product created");
      setOpen(false);
      setEditing(null);
      setForm(empty);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("products").update({ is_featured: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Catalog"
        title="Products"
        subtitle="Add, feature, and curate the shop."
      />

      <Reveal className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px] sm:max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9 bg-background/60" />
        </div>
        <Button onClick={openNew} variant="premium" size="sm" className="h-9 sm:ml-auto sm:order-last">
          <Plus className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">New product</span>
          <span className="sm:hidden">New</span>
        </Button>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="flex-1 sm:w-44 sm:flex-none h-9 bg-background/60"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(categories ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="flex-1 sm:w-40 sm:flex-none h-9 bg-background/60"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price ↑</SelectItem>
            <SelectItem value="price-desc">Price ↓</SelectItem>
            <SelectItem value="stock">Low stock</SelectItem>
          </SelectContent>
        </Select>
      </Reveal>

      {/* Mobile: cards */}
      <Reveal className="md:hidden space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">No products match.</p>
        )}
        {filtered.map((p: any) => (
          <div key={p.id} className="glass rounded-2xl p-3">
            <div className="flex items-start gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt="" loading="lazy" className="h-14 w-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{p.slug}</div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="font-semibold">৳{Number(p.price).toFixed(0)}</span>
                  <Badge variant={p.stock === 0 ? "destructive" : p.stock < 5 ? "secondary" : "outline"} className="text-[10px]">
                    {p.stock ?? 0} in stock
                  </Badge>
                  {p.is_pod && <Badge variant="outline" className="text-[10px]">POD</Badge>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  onClick={() => toggleFeatured.mutate({ id: p.id, value: !p.is_featured })}
                  className="pressable p-1"
                  title="Toggle featured"
                >
                  <Star className={`h-4 w-4 ${p.is_featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                </button>
                <div className="flex gap-0.5">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => remove.mutate(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Reveal>

      {/* Desktop: table */}
      <Reveal className="hidden md:block">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Product</th>
                  <th className="text-left font-semibold px-4 py-3">Price</th>
                  <th className="text-left font-semibold px-4 py-3">Stock</th>
                  <th className="text-left font-semibold px-4 py-3">Flags</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No products match.</td></tr>
                )}
                {filtered.map((p: any) => (
                  <tr key={p.id} className="border-t border-border/40 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {p.image_url ? (
                          <img src={p.image_url} alt="" loading="lazy" decoding="async" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[280px]">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">৳{Number(p.price).toFixed(0)}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={p.stock === 0 ? "destructive" : p.stock < 5 ? "secondary" : "outline"} className="text-[10px]">
                        {p.stock ?? 0}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleFeatured.mutate({ id: p.id, value: !p.is_featured })}
                          className="pressable"
                          title="Toggle featured"
                        >
                          <Star className={`h-4 w-4 ${p.is_featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        </button>
                        {p.is_pod && <Badge variant="outline" className="text-[10px]">POD</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove.mutate(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit product" : "New product"}</SheetTitle>
            <SheetDescription>Fields marked with * are required.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/\s+/g, "-").toLowerCase() })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Price *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Original price</Label>
                <Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image</Label>
              {form.image_url && (
                <img src={form.image_url} alt="" className="h-28 w-full object-cover rounded-lg" />
              )}
              <div className="flex gap-2">
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="Paste URL or upload…"
                  className="flex-1"
                />
                <Button asChild variant="outline" disabled={uploading}>
                  <label className="cursor-pointer">
                    <ImagePlus className="h-4 w-4 mr-1.5" />
                    {uploading ? "Uploading…" : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                    />
                  </label>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.is_pod} onCheckedChange={(v) => setForm({ ...form, is_pod: v })} /> POD
              </label>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button variant="premium" className="w-full" onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : editing ? "Update product" : "Create product"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
