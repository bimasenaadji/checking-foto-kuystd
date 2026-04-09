import type { Report } from "@/lib/types";

interface ModalProps {
  report: Report;
  onClose: () => void;
}

export function ReportDetailModal({ report, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="font-bold text-lg mb-4">
          Detail Laporan: {report.reporterName}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Lokasi: {report.location}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium"
        >
          Tutup Modal
        </button>
      </div>
    </div>
  );
}
