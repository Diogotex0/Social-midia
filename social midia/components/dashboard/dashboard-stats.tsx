import { Users, FileText, AlertTriangle, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Props {
  totalClients: number;
  activeClients: number;
  postsThisMonth: number;
  delayedPosts: number;
  monthlyRevenue: number;
  pendingRevenue: number;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}) => (
  <Card className="hover:border-border/80 transition-colors">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export function DashboardStats({ totalClients, activeClients, postsThisMonth, delayedPosts, monthlyRevenue, pendingRevenue }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total Clientes"
        value={totalClients}
        subtitle={`${activeClients} ativos`}
        icon={Users}
        color="bg-blue-500/15 text-blue-400"
      />
      <StatCard
        title="Posts do Mês"
        value={postsThisMonth}
        subtitle="planejados"
        icon={FileText}
        color="bg-violet-500/15 text-violet-400"
      />
      <StatCard
        title="Atrasados"
        value={delayedPosts}
        subtitle={delayedPosts > 0 ? "requer atenção" : "tudo em dia"}
        icon={AlertTriangle}
        color={delayedPosts > 0 ? "bg-red-500/15 text-red-400" : "bg-green-500/15 text-green-400"}
      />
      <StatCard
        title="Receita do Mês"
        value={formatCurrency(monthlyRevenue)}
        subtitle="recebido"
        icon={DollarSign}
        color="bg-green-500/15 text-green-400"
      />
      <StatCard
        title="A Receber"
        value={formatCurrency(pendingRevenue)}
        subtitle="pendente"
        icon={TrendingUp}
        color="bg-yellow-500/15 text-yellow-400"
      />
      <StatCard
        title="Clientes Ativos"
        value={activeClients}
        subtitle={`de ${totalClients} total`}
        icon={Clock}
        color="bg-purple-500/15 text-purple-400"
      />
    </div>
  );
}
