interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon,
  iconBg,
}) => (
  <div
    key={title}
    className={`rounded-2xl p-6 shadow-sm flex items-center border border-gray-200 gap-4 bg-white`}>
    <div
      className={`border ${iconBg ? iconBg : "bg-brand"} border-gray-200  rounded-xl p-4`}>
      {icon}
    </div>
    <div>
      <p className="font-outfit text-gray-600 text-sm font-semibold">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  </div>
);
