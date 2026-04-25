const Spinner = ({size='sm'}) => (
  <span className={`inline-block border-2 border-current border-t-transparent
    rounded-full animate-spin ${size==='sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'}`} />
);

export { Spinner };
export default Spinner;