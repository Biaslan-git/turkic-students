import { moderateIdea } from "@/app/admin/actions";
import { OPINION_CATEGORIES } from "@/lib/constants";
import { countryFlag } from "@/lib/country";
import { listAllIdeas } from "@/lib/ideas";

const categoryLabels = new Map<string, string>(OPINION_CATEGORIES.map((c) => [c.value, c.label]));

function ModerationButtons({ kind, id, hidden }: { kind: "idea" | "comment"; id: string; hidden?: boolean }) {
  return (
    <div className="flex gap-3 text-xs">
      <form action={moderateIdea}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="action" value={hidden ? "show" : "hide"} />
        <button type="submit" className="underline underline-offset-2">
          {hidden ? "Показать" : "Скрыть"}
        </button>
      </form>
      <form action={moderateIdea}>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="action" value="delete" />
        <button type="submit" className="text-red-600 underline underline-offset-2">
          Удалить
        </button>
      </form>
    </div>
  );
}

export default async function AdminIdeasPage() {
  const ideas = await listAllIdeas();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Стена идей</h1>
          <p className="text-sm text-muted">
            Новые идеи и ответы сразу видны на сайте — скрывайте лишнее. Всего идей: {ideas.length}.
          </p>
        </div>
      </div>

      {ideas.length === 0 && <p className="text-muted">Пока нет ни одной идеи.</p>}

      {ideas.map((idea) => (
        <article
          key={idea.id}
          className={`flex flex-col gap-3 rounded-2xl border border-border p-4 ${idea.isHidden ? "opacity-50" : ""}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span>
              {categoryLabels.get(idea.category) ?? idea.category} · {new Date(idea.createdAt).toLocaleString("ru-RU")}
              {idea.isHidden ? " · скрыта" : ""}
            </span>
            <ModerationButtons kind="idea" id={idea.id} hidden={idea.isHidden} />
          </div>
          <p className="whitespace-pre-line text-sm">{idea.text}</p>
          <p className="text-xs text-muted">
            {idea.authorName || "Аноним"} · {countryFlag(idea.country)} {idea.country}
            {idea.universityName ? ` · ${idea.universityName}` : ""}
          </p>

          {idea.comments.length > 0 && (
            <ul className="flex flex-col gap-3 border-l-2 border-border pl-4">
              {idea.comments.map((c) => (
                <li key={c.id} className={`flex flex-col gap-1 ${c.isHidden ? "opacity-50" : ""}`}>
                  <p className="whitespace-pre-line text-sm">{c.text}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span>
                      {c.authorName || "Аноним"} · {countryFlag(c.country)} {c.country} ·{" "}
                      {new Date(c.createdAt).toLocaleString("ru-RU")}
                      {c.isHidden ? " · скрыт" : ""}
                    </span>
                    <ModerationButtons kind="comment" id={c.id} hidden={c.isHidden} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
