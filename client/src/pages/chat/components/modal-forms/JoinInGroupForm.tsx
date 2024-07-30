interface Props {
  onComplete?: () => void;
}
const JoinInGroupForm: React.FC<Props> = ({ onComplete }) => {
  console.log(onComplete);
  return <div>JoinInGroupForm</div>;
};

export default JoinInGroupForm;
