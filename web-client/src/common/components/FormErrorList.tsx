const FormErrorList = ({ errors }: { errors: any }) => {
  if (!Object.keys(errors).length) return null;

  return (
    <div
      className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500"
      role="alert"
    >
      <p className="font-bold">There are some errors</p>
      {Object.keys(errors).map((fieldName) => (
        <p className="text-sm text-red-500" key={fieldName}>
          {errors[fieldName].message}
        </p>
      ))}
    </div>
  );
};

export default FormErrorList;
