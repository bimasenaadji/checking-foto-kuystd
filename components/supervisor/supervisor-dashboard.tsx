"use client";

import { useState } from "react";
import {
  BarChart3,
  Clock,
  MapPin,
  SunMedium,
  Moon,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Filter,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Pastikan komponen ini sudah ada di folder yang sama atau sesuaikan path-nya
import { ReportDetailModal } from "./report-detail-modal";
import { PdfGenerator } from "./pdf-generator";
import type { Report, Role } from "@/lib/types";
import { ROLE_LABELS, ROLE_FLOOR_LABELS, CREW_ROLES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SupervisorDashboardProps {
  reports: Report[];
}

function formatRelative(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffM = Math.floor(diffMs / (1000 * 60));
  if (diffM < 1) return "Baru saja";
  if (diffM < 60) return `${diffM} mnt lalu`;
  if (diffH < 24) return `${diffH} jam lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function floorBadgeClass(role: Role) {
  switch (role) {
    case "cs":
      return "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30";
    case "operator_lt1":
      return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30";
    case "operator_lt2":
      return "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/30";
    case "operator_lt3":
      return "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

export function SupervisorDashboard({ reports }: SupervisorDashboardProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");

  // Computed stats
  const totalToday = reports.filter((r) => {
    const d = new Date(r.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const allChecked = reports.filter((r) =>
    r.checklist.every((c) => c.checked),
  ).length;
  const passRate = reports.length
    ? Math.round((allChecked / reports.length) * 100)
    : 0;

  const locationCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.location] = (acc[r.location] || 0) + 1;
    return acc;
  }, {});
  const topLocation =
    Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Filter logic
  const filteredReports = reports.filter((r) => {
    const matchRole = filterRole === "all" || r.reporterRole === filterRole;
    const matchDate = !filterDate || r.timestamp.startsWith(filterDate);
    return matchRole && matchDate;
  });

  const hasFilter = filterRole !== "all" || !!filterDate;

  const clearFilters = () => {
    setFilterRole("all");
    setFilterDate("");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total Laporan
              </p>
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {reports.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Semua waktu</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Hari Ini
              </p>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalToday}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Laporan dikirim
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Tingkat Lulus
              </p>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{passRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Semua checklist OK
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Lokasi Teratas
              </p>
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground leading-tight line-clamp-2">
              {topLocation.replace("Kuy Studio ", "")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {locationCounts[topLocation] ?? 0} laporan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. MAIN TABS */}
      <Tabs defaultValue="feed" className="flex flex-col gap-4">
        <TabsList className="bg-muted border border-border w-full grid grid-cols-2">
          <TabsTrigger
            value="feed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground text-sm font-medium gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Live Feed
          </TabsTrigger>
          <TabsTrigger
            value="pdf"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground text-sm font-medium gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF &amp; Storage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-0 flex flex-col gap-3">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-shrink-0 text-muted-foreground text-xs self-center">
              <Filter className="w-3.5 h-3.5" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex gap-2 flex-1 flex-wrap">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-input border-border text-foreground text-xs h-9 w-auto flex-1 min-w-[140px] focus-visible:ring-primary"
              />
              <Select
                value={filterRole}
                onValueChange={(v) => setFilterRole(v as Role | "all")}
              >
                <SelectTrigger className="h-9 text-xs bg-input border-border text-foreground flex-1 min-w-[130px] focus:ring-primary">
                  <SelectValue placeholder="Semua Peran" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  <SelectItem value="all" className="text-xs">
                    Semua Peran
                  </SelectItem>
                  {CREW_ROLES.map((role) => (
                    <SelectItem key={role} value={role} className="text-xs">
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 border-border text-muted-foreground hover:text-foreground text-xs gap-1.5"
                  onClick={clearFilters}
                >
                  <X className="w-3 h-3" /> Reset
                </Button>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground px-0.5">
            {filteredReports.length} laporan
            {hasFilter && ` (difilter dari ${reports.length})`} &mdash; klik
            untuk lihat detail
          </p>

          {filteredReports.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm">
                  Tidak ada laporan yang cocok dengan filter.
                </p>
              </CardContent>
            </Card>
          )}

          {/* List Laporan */}
          <div className="flex flex-col gap-2">
            {filteredReports.map((report) => {
              const allPass = report.checklist.every((c) => c.checked);
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="w-full text-left bg-card border border-border rounded-2xl px-4 py-4 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                        report.type === "opening"
                          ? "bg-primary/15"
                          : "bg-secondary",
                      )}
                    >
                      {report.type === "opening" ? (
                        <SunMedium className="w-4 h-4 text-primary" />
                      ) : (
                        <Moon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">
                            {report.type === "opening" ? "Opening" : "Closing"}{" "}
                            &mdash; {report.reporterName}
                          </p>
                          <Badge
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0 border",
                              floorBadgeClass(report.reporterRole),
                            )}
                            variant="outline"
                          >
                            {ROLE_FLOOR_LABELS[report.reporterRole]}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatRelative(report.timestamp)}
                          </span>
                          {allPass ? (
                            <Badge
                              className="bg-primary/15 text-primary border-primary/30 text-[10px] gap-1 px-1.5"
                              variant="outline"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5" /> Lulus
                            </Badge>
                          ) : (
                            <Badge
                              className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] gap-1 px-1.5"
                              variant="outline"
                            >
                              <XCircle className="w-2.5 h-2.5" /> Ada Masalah
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      {report.notes && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 italic">
                          &ldquo;{report.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="mt-0">
          <PdfGenerator />
        </TabsContent>
      </Tabs>

      {/* 3. DETAIL MODAL */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
