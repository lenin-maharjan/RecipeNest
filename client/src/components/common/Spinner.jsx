const Spinner = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500
                        rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-500
                      rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;