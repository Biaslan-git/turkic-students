import { listFestivalOpinions } from "@/lib/admin/festival";
import { listGuestOpinions } from "@/lib/admin/guest-opinions";
import { OpinionsTable } from "@/components/admin/opinions-table";
import { GuestOpinionsTable } from "@/components/admin/guest-opinions-table";

export default async function AdminOpinionsPage() {
  const [records, guestRecords] = await Promise.all([listFestivalOpinions(), listGuestOpinions()]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-2xl font-bold">Мнения — «Твой голос — твой фестиваль»</h1>
        <OpinionsTable records={records} />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">Мнения без регистрации</h2>
          <p className="text-sm text-muted">
            Открытая форма (`/opinion`) — без email и без привязки к вузу, в аудиторию не
            засчитываются.
          </p>
        </div>
        <GuestOpinionsTable records={guestRecords} />
      </div>
    </div>
  );
}
