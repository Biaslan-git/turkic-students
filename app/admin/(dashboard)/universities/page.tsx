import { listFestivalUniversitiesAdmin, listOtherUniversitySubmissions } from "@/lib/admin/festival";
import { AddUniversityForm } from "@/components/admin/add-university-form";
import { UniversitiesTable } from "@/components/admin/universities-table";
import { OtherUniversitySubmissionsTable } from "@/components/admin/other-university-submissions-table";

export default async function AdminUniversitiesPage() {
  const [records, otherSubmissions] = await Promise.all([
    listFestivalUniversitiesAdmin(),
    listOtherUniversitySubmissions(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-bold">Университеты — «Твой голос — твой фестиваль»</h1>
      <AddUniversityForm />
      <UniversitiesTable records={records} />
      <OtherUniversitySubmissionsTable records={otherSubmissions} />
    </div>
  );
}
