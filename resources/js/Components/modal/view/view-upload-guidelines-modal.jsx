import UpModal from "../up-modal";

const ViewUploadGuidelinesModal = (props) => {
  const userType = () => {
    const baseFields = [
      { field: "id", value: "School I.D", example: "c2210213" },
      { field: "first_name", value: "Given name of the user", example: "John" },
      { field: "middle_name", value: "Middle name of the user", example: "Alexander" },
      { field: "last_name", value: "Surname or family name", example: "Doe" },
      { field: "sex", value: "Sex", example: "m/f" },
      { field: "email", value: "Email", example: "email123@gmail.com" },
    ];

    switch (props.type) {
      case "student":
        return baseFields.concat([
          { field: "program", value: "Program enrolled (1=BSIT, 2=BLIS, 3=BEED, 4=BSBA, 5=BSHM, 6=BSN, 7=BSTM)", example: "7" },
          { field: "year_level", value: "Year level", example: "2" },
          { field: "school_year", value: "School Year", example: "2024-2025" },
        ]);
      case "faculty":
        return baseFields.concat([
          { field: "program", value: "Assigned program (1=BSIT, 2=BLIS, etc.)", example: "1" },
        ]);
      case "administrative":
        return baseFields.concat([
          { field: "type", value: "Role type (program_dean, college_dean)", example: "program_dean" },
          { field: "program (Optional)", value: "Optional program assignment", example: "3" },
        ]);
      case "staff":
        return baseFields.concat([
          { field: "work_type", value: "Type of work", example: "Clerical" },
        ]);
      default:
        return baseFields;
    }
  };

  const fileName = () => {
    if(props.type == 'student') return 'enrolled-pczc-students'
    if(props.type == 'faculty') return 'faculty-pczc'
    if(props.type == 'administrative') return 'administrative-program name(bachelor-of-science-in-information-technoology)'
    if(props.type == 'staff') return 'staff'
  }

  const data = userType();

  return (
    <UpModal
      close={props.close}
      closeModal={props.closeModal}
      isEnableOuterClose={props.isEnableOuterClose}
      pd={props.pd}
      bgColor="bg-white"
      w="w-[40rem]"
    >
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-xl font-bold capitalize text-center">
          Upload Guidelines for {props.type}
        </h1>

        {/* Notes */}
        <div className="text-sm text-gray-700">
          <ul className="list-disc pl-6">
            {(props.type == 'student' || props.type == 'faculty' || props.type == 'administrative' || props.type == 'staff') && 
            <li>Accepted file name: <b>{fileName()}.csv</b></li>}
            <li>Accepted file type: <b>.csv</b></li>
            <li>The first row must contain exact field names as shown below.</li>
            {(props.type == 'student' || props.type == 'faculty' || props.type == 'administrative') &&
            <li>
              <div>Program must be their corresponding ID</div>
              <ul>
                {props.program.map((e, i) => <li>{e.id} - {e.description}</li>)}
              </ul>
            </li>}
          </ul>
        </div>

        {/* Transposed Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                {data.map((item, idx) => (
                  <th key={idx} className="border px-3 py-2">
                    {item.field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/**
               <tr className="bg-white">
                {data.map((item, idx) => (
                  <td key={idx} className="border px-3 py-2">
                    {item.value}
                  </td>
                ))}
              </tr>
               */}
              <tr className="bg-gray-50">
                {data.map((item, idx) => (
                  <td key={idx} className="border px-3 py-2 font-mono text-blue-700">
                    {item.example}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
          <p>
            ⚠️ Ensure that column headers in your CSV match the field names above exactly (case-sensitive).
          </p>
        </div>
      </div>
    </UpModal>
  );
};

export default ViewUploadGuidelinesModal;
