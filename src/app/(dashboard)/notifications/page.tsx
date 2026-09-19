import { PageHeader } from "@/components/ui";
import { mockNotifications } from "@/lib/mockData";

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="border-t border-line">
        {mockNotifications.map((n) => (
          <div key={n.id} className="flex gap-3.5 py-4 border-b border-line">
            <span className={`w-[7px] h-[7px] rounded-full mt-1.5 shrink-0 ${n.read ? "bg-line" : "bg-green"}`} />
            <div>
              <p className={n.read ? "" : "font-medium"}>{n.title}</p>
              <p className="text-[11.5px] text-muted mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
