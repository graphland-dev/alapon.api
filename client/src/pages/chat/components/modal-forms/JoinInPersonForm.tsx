interface Props {
  onComplete?: () => void;
}
const JoinInPersonForm: React.FC<Props> = ({ onComplete }) => {
  console.log(onComplete);
  return <div>JoinInPersonForm</div>;
};

export default JoinInPersonForm;
