//Various ways to import and export
const gfname = "Mrs X";
const gfname2 = "Mrs Y";
const gfname3 = "Mrs Z";
const calculateLovePercentage = () => {
  return `${Math.random() * 100}%`;
};
export default gfname;
export { gfname2, gfname3, calculateLovePercentage };
