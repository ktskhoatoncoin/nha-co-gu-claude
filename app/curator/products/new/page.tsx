import CuratorProductForm from "@/components/curator/CuratorProductForm";

export const metadata = { title: "Thêm sản phẩm — Curator" };

export default function NewCuratorProductPage() {
  return (
    <div>
      <header className="mb-10">
        <p className="ncg-eyebrow text-[11px]">Add Product</p>
        <h1 className="ncg-h1 mt-2 text-3xl text-wood">Thêm sản phẩm vào Product Database</h1>
      </header>
      <CuratorProductForm />
    </div>
  );
}
