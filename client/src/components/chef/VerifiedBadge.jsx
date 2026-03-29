const VerifiedBadge = ({ size = 'sm' }) => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={`badge-verified ${sizes[size]}`}>
      ✓ Verified Chef
    </span>
  );
};

export default VerifiedBadge;