import { listFestivalUniversitiesAdmin } from "@/lib/admin/festival";
import { AddUniversityForm } from "@/components/admin/add-university-form";
import { UniversitiesTable } from "@/components/admin/universities-table";

export default async function AdminUniversitiesPage() {
  const records = await listFestivalUniversitiesAdmin();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-bold">Университеты — «Твой голос — твой фестиваль»</h1>
      <AddUniversityForm />
      <UniversitiesTable records={records} />
    </div>
  );
}
