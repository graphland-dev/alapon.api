interface Props {
  onComplete?: () => void;
}
const CreateGroupForm: React.FC<Props> = ({ onComplete }) => {
  console.log(onComplete);
  return <div>CreateGroupForm</div>;
};

export default CreateGroupForm;
