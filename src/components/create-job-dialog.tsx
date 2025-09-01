import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createJob, HttpMethod } from "@/api/jobs";

interface CreateJobDialogProps {
  onCreated?: () => void;
}

export default function CreateJobDialog({ onCreated }: CreateJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    project: "",
    name: "",
    description: "",
    cron: "",
    url: "",
    method: HttpMethod.GET,
    xSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { ok, error } = await createJob({
      ...form,
      description: form.description || undefined,
      xSecret: form.xSecret || undefined,
    });
    setLoading(false);
    if (ok) {
      setOpen(false);
      setForm({ project: "", name: "", description: "", cron: "", url: "", method: HttpMethod.GET, xSecret: "" });
      onCreated?.();
    } else {
      setError(error || "생성에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ 새 Job 생성</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 Job 생성</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">프로젝트</label>
            <input name="project" value={form.project} onChange={handleChange} required className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">이름</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">설명</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Cron</label>
            <input name="cron" value={form.cron} onChange={handleChange} required className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">URL</label>
            <input name="url" value={form.url} onChange={handleChange} required className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">HTTP Method</label>
            <select name="method" value={form.method} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm">
              {Object.values(HttpMethod).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">X-Secret</label>
            <input name="xSecret" value={form.xSecret} onChange={handleChange} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">취소</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "생성 중..." : "생성"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
