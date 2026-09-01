import {
  getProfilePic,
  getYearLevel,
  readableDate,
  readableTime,
  replaceUnderScoreToSpace,
  showWarningModal,
  toTitleCase,
} from "@/others/function";
import ProfilePic from "../other/profile-pic";
import ActionBtn from "../button/action-btn";

const ArchiveList = ({ list = [], viewDocument, deleteDocument, recoverDocument }) => {
  return (
    <div className="space-y-3 w-full">
      {list.length !== 0 ? (
        list.map((e, i) => (
          <ArchiveItem
            key={i}
            index={i}
            data={e}
            viewDocument={viewDocument}
            deleteDocument={deleteDocument}
            recoverDocument={recoverDocument}
          />
        ))
      ) : (
        <div className="flex justify-center items-center py-10 text-gray-600">
          <p className="text-sm sm:text-base">No Documents Yet</p>
        </div>
      )}
    </div>
  );
};

const ArchiveItem = ({ data, index, viewDocument, deleteDocument, recoverDocument }) => {
  const downloadDocument = (type, id) => {
    const link = document.createElement("a");
    let file = ''
    if(type == 'complaint') {
      file = `complaint-files-${data.complaint_number}.zip`
    }if(type == 'referral') {
      file = `referral-files-${data.referral_number}.zip`
    }if(type == 'absent form') {
      file = `absence-files-${data.form_number}.zip`
    }
    link.href = `/download/${type}/${id}`;
    
    link.setAttribute("download", file);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const t =
    data.type === "complaint"
      ? "c"
      : data.type === "referral"
      ? "r"
      : "a";

  const status = (s) => {
      if(s == 'rejected') return 'bg-red-500'
      if(s == 'pending') return 'bg-yellow-500'
      if(s == 'ongoing') return 'bg-orange-500'
      if(s == 'resolved') return 'bg-green-500'
  }

  return (
    <div className="bg-white border-b p-4 sm:p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-3 items-center">
            <p className="text-xs text-gray-500">{index + 1}.</p>
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">
              {toTitleCase(data.type)} Document No. {data.id}
            </h2>
          </div>
          {data.type == 'complaint' &&
          <div>
             <span className={`px-2 py-1 text-[0.8em] text-white rounded-xl ${status(data.complaint_status)}`}>{toTitleCase(data.complaint_status)}</span>
          </div>}
        </div>
      </div>

      {/* Student Info */}
      {data.type == 'complaint' || data.type == 'referral'
      ? 
      <div >
        <div className="grid gap-10 items-start lg:flex">
            <div className="grid gap-1">
              <div className="text-[0.9em]"><b>{data.type == 'complaint' ? 'Complainant' : 'Referrer'}</b></div>

              {data.usr ? (
                  // If system user exists
                  <div className="flex items-start sm:items-center gap-3">
                    <ProfilePic
                      size={2.2}
                      src={getProfilePic(data.usr.profile?.profile_picture, data.usr.profile?.sex)}
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="font-semibold text-sm truncate text-gray-800">
                        {toTitleCase(`${data.usr.profile?.first_name ?? ""} ${data.usr.profile?.middle_name ?? ""} ${data.usr.profile?.last_name ?? ""}`)}{" "}
                        <span className="text-gray-500 text-xs">
                          ({data.usr.id_number})
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {`${toTitleCase(replaceUnderScoreToSpace(data.usr.role))}`}
                      </p>
                    </div>
                  </div>
              ) : (
                  // If no system user, show complainant_name only
                  <div className="p-2 text-sm text-gray-700 bg-gray-50 rounded border border-gray-200">
                    {toTitleCase(data.complainant_name || "N/A")}
                  </div>
              )}
            </div>

            <div>
                <div className="text-[0.9em]"><b>{data.type == 'complaint' ? 'Subject' : 'Referred Student'}</b></div>
                <div className="grid gap-2">
                  {data.students.length != 0
                  ?
                  data.students.map((e, i) => {
                  const isStudent = e.user.role === "student"
                  const latestEnrollment = e.user.enrollments?.[e.user.enrollments.length - 1]
                  const programName = isStudent
                      ? e.user.program?.name
                      : e.user.teaching_staff?.program?.name
                  const roleDetail = isStudent
                      ? (latestEnrollment?.year_level ? getYearLevel(latestEnrollment.year_level) : null)
                      : (e.user.teaching_staff?.position === "program_head" ? "Program Head" : "Faculty")
                  return (
                  <div className="flex items-start sm:items-center gap-3" key={i}>
                      <ProfilePic
                          size={2.2}
                          src={getProfilePic(e.user.profile?.profile_picture, e.user.profile?.sex)}
                      />
                      <div className="flex flex-col min-w-0">
                          <p className="font-semibold text-sm truncate text-gray-800">
                              {toTitleCase(
                              `${e.user.profile?.first_name ?? ""} ${e.user.profile?.middle_name ?? ""} ${e.user.profile?.last_name ?? ""}`
                              )}{" "}
                              <span className="text-gray-500 text-xs">
                                  ({e.user.id_number})
                              </span>
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                              {[programName, roleDetail].filter(Boolean).join(" • ") || "-"}
                          </p>
                      </div>
                  </div>
                  )})
                  :
                  <div className="flex items-start sm:items-center gap-3">
                      <ProfilePic
                          size={2.2}
                          src={getProfilePic(data.student.profile?.profile_picture, data.student.profile?.sex)}
                      />
                      <div className="flex flex-col min-w-0">
                          <p className="font-semibold text-sm truncate text-gray-800">
                              {toTitleCase(
                              `${data.student.profile?.first_name ?? ""} ${data.student.profile?.middle_name ?? ""} ${data.student.profile?.last_name ?? ""}`
                              )}{" "}
                              <span className="text-gray-500 text-xs">
                                  ({data.student.id_number})
                              </span>
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                              {data.student.role === "student"
                                ? `${data.student.program?.name ?? ""} • ${getYearLevel(data.student.enrollments?.[data.student.enrollments.length - 1]?.year_level)}`
                                : [data.student.teaching_staff?.program?.name, data.student.teaching_staff?.position === "program_head" ? "Program Head" : "Faculty"].filter(Boolean).join(" • ")}
                          </p>
                      </div>
                  </div>}
                </div>
            </div>
        </div>
      </div>
      :
      <div className="flex items-start sm:items-center gap-3">
        <ProfilePic
          size={2.2}
          src={getProfilePic(data.student.profile?.profile_picture, data.student.profile?.sex)}
        />
        <div className="flex flex-col min-w-0">
          <p className="font-semibold text-sm truncate text-gray-800">
            {toTitleCase(
              `${data.student.profile?.first_name ?? ""} ${data.student.profile?.last_name ?? ""}`
            )}{" "}
            <span className="text-gray-500 text-xs">
              ({data.student.id_number})
            </span>
          </p>
          <p className="text-xs text-gray-600 truncate">
            {`${data.student.program?.name ?? ""}`}
          </p>
        </div>
      </div>}

      {/* Dates Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs text-gray-700">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold text-gray-800 text-[0.8em]">
            Reported Since:
          </p>
          <p>{readableDate(data.created_at)}</p>
          <p className="text-gray-500">{readableTime(data.created_at)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold text-gray-800 text-[0.8em]">
            Date to be Deleted:
          </p>
          <p>{readableDate(data.archived_at)}</p>
          <p className="text-gray-500">{readableTime(data.archived_at)}</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex gap-2 mt-3 text-[0.8em]">
        <ActionBtn
          className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => viewDocument(data.id, t)}
        >
          View
        </ActionBtn>

        {data.type === "complaint" && data.complaint_status === "rejected" && (
          <ActionBtn
            className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
            onClick={() => recoverDocument(data.id, data.type, data.usr)}
          >
            Unarchive
          </ActionBtn>
        )}
        {data.type === "absent form" && data.confirmed_at === null && (
          <ActionBtn
            className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
            onClick={() => recoverDocument(data.id, data.type, data.usr)}
          >
            Approve
          </ActionBtn>
        )}
        {((data.type === 'complaint' && data.complaint_status === 'resolved') || (data.type === 'absent form' && data.confirmed_at != null)) &&
        <ActionBtn
          className="bg-orange-600 text-white hover:bg-orange-700 w-full sm:w-auto"
          onClick={() => downloadDocument(data.type, data.id)}
        >
          Download
        </ActionBtn>}
        {(data.type === 'referral') &&
        <ActionBtn
          className="bg-orange-600 text-white hover:bg-orange-700 w-full sm:w-auto"
          onClick={() => downloadDocument(data.type, data.id)}
        >
          Download
        </ActionBtn>}

        <DeleteDocumentButton data={data} deleteDocument={deleteDocument} />
      </div>
    </div>
  );
};

const DeleteDocumentButton = ({ data, deleteDocument }) => {
  const archivedAt = new Date(data.archived_at);
  const now = new Date();
  const canDelete = true;//now >= archivedAt

  return (
    <ActionBtn
      className={`${
        canDelete
          ? "bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto"
          : "bg-gray-400 text-gray-200 cursor-not-allowed w-full sm:w-auto"
      }`}
      onClick={() => canDelete && deleteDocument(data.type, data.id)}
      disabled={!canDelete}
      title={
        canDelete
          ? "Delete document"
          : `You can delete this after ${archivedAt.toLocaleDateString()}`
      }
    >
      Delete
    </ActionBtn>
  );
};

export default ArchiveList;
