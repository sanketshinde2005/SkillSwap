type Props = {
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export default function StatusPill({ status }: Props) {
  const styles = {
    PENDING: { bg: "var(--warning)", color: "var(--text-primary)" },
    APPROVED: { bg: "var(--success)", color: "var(--text-primary)" },
    REJECTED: { bg: "var(--error)", color: "var(--text-primary)" },
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
