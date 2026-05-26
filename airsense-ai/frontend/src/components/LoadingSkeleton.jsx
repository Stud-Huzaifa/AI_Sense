export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-grid" aria-label="Analyzing air quality">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="skeleton-card" />
      ))}
    </div>
  );
}
