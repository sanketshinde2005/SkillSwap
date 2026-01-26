type Props = {
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export default function StatusPill({ status }: Props) {
  const styles = {
    PENDING: { bg: "#FEF3C7", color: "#92400E" },
    APPROVED: { bg: "#DCFCE7", color: "#166534" },
    REJECTED: { bg: "#FEE2E2", color: "#991B1B" },
  }[status];

  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
      }}
    >
      {status}
    </span>
  );
}
