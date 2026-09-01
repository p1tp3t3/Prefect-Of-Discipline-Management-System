import AuthLayout from "@/Layouts/auth-layout";
import "../style.css";
import { useState, useRef, useEffect } from "react";
import Reload from "@/Components/reload/reload";
import logo from '../../images/pilar.png'
import RegistrationForm from "./register/main-form";
import NormalValidationModal from "@/Components/modal/validation/normal-validation-modal";
import { APIRequest } from "@/others/classes/api-req";
import { showOutputModal, showWarningModal, toTitleCase } from "@/others/function";
import ViewUploadGuidelinesModal from "@/Components/modal/view/view-upload-guidelines-modal";
import Btn from "@/Components/button/normal-btn";
import CsvStudentPreviewModal from "@/Components/modal/submission-form/csv-student-preview-modal";
import CsvStudentProgressModal from "@/Components/modal/view/csv-student-progress-modal";

const Register = (props) => {
    const [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState(""),
          [userListCSV, openUserListCSV] = useState(false),
          [csvFile, setCSVFile] = useState(null),
          [csvRowCount, setCSVRowCount] = useState(0),
          [errorFileText, setErrorFileText] = useState(''),
          [validationLabel, setValidationLabel] = useState(''),
          
          [type, setUserType] = useState(''),
          [validationError, setValidationError] = useState({
               file: '',
               first_name: '',
               middle_name: '',
               last_name: '',
               user_id: '',
               username: '',
               password: '',
               confirm_password: ''
          }),
          [guidelines, openGuidelines] = useState(false),
          [csvColumn, setCSVColumn] = useState(''),

          [csvPreview, openCsvPreview] = useState(false),
          [csvPreviewRows, setCsvPreviewRows] = useState([]),
          [csvProgress, openCsvProgress] = useState(false),
          [csvBatchId, setCsvBatchId] = useState(null),
          [csvBatchTotal, setCsvBatchTotal] = useState(0);

    const [activate, activateAccount] = useState(false);

    useEffect(() => {
        const staged = sessionStorage.getItem('student-csv-preview');
        if (staged) {
            try {
                setCsvPreviewRows(JSON.parse(staged));
                openCsvPreview(true);
            } catch (e) {
                sessionStorage.removeItem('student-csv-preview');
            }
        }
    }, []);

    const originalData = {
        first_name: "",
        middle_name: "",
        last_name: "",
        user_id: "",
        sex: "m",
        user_type: "",
        username: "",
        password: "",
        confirm_password: "",
    }

    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };
    const isReload = () => {
        return reload ? "opacity-1 z-[100]" : "opacity-0 z-[-1]";
    };

    const sex = [
        { val: 'm', label: 'Male' },
        { val: 'f', label: 'Female' },
    ]
    const userType = [
        { val: "student", label: "Student" },
        { val: "itrc", label: "System Admin" },
        { val: "prefect", label: "Prefect of Discipline" },
        { val: "faculty", label: "Faculty" },
        { val: "program_head", label: "Program Head" },
        { val: "staff", label: "Non-Teaching Staff" },
        { val: "parent", label: "Parent" },
    ]
    const yearLevel = [
        { val: 1, label: "1st Year" },
        { val: 2, label: "2nd Year" },
        { val: 3, label: "3rd Year" },
        { val: 4, label: "4th Year" },    
    ]
    const handleFileChange = (e, t) => {
        const file = e.target.files[0];
        if(file) {
            setUserType(t)
            validateCSV(file, t)
            .then((param) => {
                if(param[0] && param[1]) {
                    if (t === 'student') {
                        previewStudentCsvFile(file)
                    } else {
                        showWarningModal(
                            `Are You Sure You Want To Upload The CSV File to Generate ${toTitleCase(type)} Accounts?`,
                            'Upload File',
                            'Cancel',
                            () => handleSubmit(file),
                            () =>  {
                                setCSVFile(null);
                            }
                        )
                    }
                }else {
                    if(!param[0]) {
                        param[2]()
                    }if(!param[1]) {
                        param[3]()
                    }
                }
            })
        }else {
            setCSVFile(null)
            openUserListCSV(false)
        }
    }
    const handleToggle = (e) => {
        activateAccount(e.target.checked)
    }
    const roleMap = {
        student: 'student',
        faculty: 'teaching_staff',
        staff: 'non_teaching_staff',
    }
    const handleSubmit = (f) => {
        const data = {
            file: f,
            role: roleMap[type] ?? type,
            ...(type === 'faculty' ? { position: 'faculty' } : {}),
            activate: activate
        }
        openUserListCSV(false)
        loadRegister(true, 'text-wait', `Uploading ${toTitleCase(type)} CSV File. Please Wait`)

        const api = new APIRequest(
            '/super-admin/register/upload-user', 'post', data, () => {}, success, error
        )
        api.sendPostData()
    }
    const success = () => {
        loadRegister(true, '')
        showOutputModal(
            `${toTitleCase(type)} CSV File Uploaded Successfully. We Will Notify You Once All Accounts Are Completely Generated.`,
            's',
            () => {
                loadRegister(false)
            }
        )
    }
    const previewStudentCsvFile = (file) => {
        loadRegister(true, 'text-wait', 'Parsing Student CSV File. Please Wait')
        const data = new FormData()
        data.append('file', file)
        const api = new APIRequest(
            '/super-admin/register/preview-student-csv', 'post', data,
            (res) => {
                setCsvPreviewRows(res.rows)
                sessionStorage.setItem('student-csv-preview', JSON.stringify(res.rows))
            },
            () => {
                loadRegister(false)
                openUserListCSV(false)
                openCsvPreview(true)
            },
            (e) => {
                setCSVFile(null)
                loadRegister(true, '')
                showOutputModal(
                    `Error Parsing CSV File. ${e.response?.data?.message ?? ''}`,
                    'e',
                    () => loadRegister(false)
                )
            }
        )
        api.fetchData()
    }
    const cancelCsvPreview = () => {
        setCsvPreviewRows([])
        sessionStorage.removeItem('student-csv-preview')
        openCsvPreview(false)
        setCSVFile(null)
    }
    const finalizeStudentCsv = () => {
        setCsvBatchTotal(csvPreviewRows.length)
        openCsvPreview(false)
        loadRegister(true, 'text-wait', 'Starting Student Account Generation')
        const api = new APIRequest(
            '/super-admin/register/commit-student-csv', 'post',
            { rows: csvPreviewRows.map((r) => r.data), activate },
            (res) => {
                setCsvBatchId(res.batch_id)
            },
            () => {
                loadRegister(false)
                sessionStorage.removeItem('student-csv-preview')
                openCsvProgress(true)
            },
            (e) => {
                loadRegister(true, '')
                showOutputModal(
                    `Error Starting Account Generation. ${e.response?.data?.message ?? ''}`,
                    'e',
                    () => loadRegister(false)
                )
            }
        )
        api.setHeaders({ 'Content-Type': 'application/json' })
        api.fetchData()
    }
    const closeCsvProgress = () => {
        openCsvProgress(false)
        setCsvPreviewRows([])
        setCsvBatchId(null)
        setCsvBatchTotal(0)
        setCSVFile(null)
    }
    const error = (e) => {
        const err = e.response.data.message
        loadRegister(true, '')
        showOutputModal(
            `Error in Uploading ${toTitleCase(type)} CSV File. ${err}`,
            'e',
            () => {
                loadRegister(false)
            }
        )
    }
    const handleDownloadErrorClick = (txt) => {
        setTimeout(() => {
            const blob = new Blob([txt], { type: 'text/plain' }),
                  url = URL.createObjectURL(blob)

            const a = document.createElement('a')

            a.href = url
            a.download = 'error-account-generation.txt'
            a.click()

            URL.revokeObjectURL(url)
        }, 0)
    }
    const validateCSV = (file, t) => {
        return new Promise((resolve, reject) => {
            const validMimeTypes = [
                "text/csv",
                "application/vnd.ms-excel", // some browsers use this MIME
            ];

            const isCSV =
                validMimeTypes.includes(file.type) ||
                file.name.toLowerCase().endsWith(".csv");

            // 1️⃣ Check file type
            if (!isCSV) {
                setValidationError((prev) => ({
                    ...prev,
                    file: "Invalid file type. Please upload a CSV file.",
                }));
                reject("Invalid file type");
                return;
            }

            // 2️⃣ Validate file name format (student-program-name(...).csv)
            const fileName = file.name.toLowerCase().replace('.csv', '');
            const validFileNamePattern =
                /^(enrolled-pczc-students|faculty-pczc|staff)$/;
            const f = (type == 'student' ? 'enrolled-pczc-students' : (type == 'faculty' ? 'faculty-pczc' : 'staff'));
            if (!validFileNamePattern.test(fileName)) {
                setValidationError((prev) => ({
                    ...prev,
                    file:
                        `Invalid file name format. Expected pattern: ${f}.csv`,
                }));
                reject("Invalid file name");
                return;
            }

            // 3️⃣ Define required columns
            const commonCol = ["id", "first_name", "middle_name", "last_name", "sex", "email"];
            const col = {
                student: commonCol.concat(["program", "year_level", "school_year"]),
                faculty: commonCol.concat(["program"]),
                administrative: commonCol.concat(["program"]),
                staff: commonCol.concat(["work_type"]),
            };

            const requiredCols = col[t].map((h) => h.toLowerCase().trim());

            const reader = new FileReader();

            reader.onload = function (e) {
                const text = e.target.result.trim();
                const rows = text.split("\n").map((row) => row.split(","));
                const headers = rows[0].map((h) => h.toLowerCase().trim());

                // 4️⃣ Check column order & match
                const hasExactOrder =
                    headers.length === requiredCols.length &&
                    headers.every((h, i) => h === requiredCols[i]);

                // 5️⃣ Check row count
                const rowCount = rows.length - 1;
                const hasRows = rowCount >= 1;

                // 6️⃣ Validate program IDs (only if "program" column exists)
                let invalidPrograms = [];
                const programIndex = headers.indexOf("program");
                if (programIndex !== -1) {
                    const validProgramIDs = ["1", "2", "3", "4", "5", "6", "7"];
                    for (let i = 1; i < rows.length; i++) {
                        const programVal = rows[i][programIndex]?.trim();
                        if (programVal && !validProgramIDs.includes(programVal)) {
                            invalidPrograms.push({ row: i + 1, value: programVal });
                        }
                    }
                }

                // 🧠 Error messages
                const errCol = () =>
                    setValidationError((prev) => ({
                        ...prev,
                        file: `Invalid column order. Expected: [${requiredCols.join(", ")}]. Found: [${headers.join(", ")}]`,
                    }));

                const errRowMin = () =>
                    setValidationError((prev) => ({
                        ...prev,
                        file: "CSV must contain at least 1 data row.",
                    }));

                const errProgram = () =>
                    setValidationError((prev) => ({
                        ...prev,
                        file:
                            `Invalid program IDs found at rows: ${invalidPrograms
                                .map((r) => `${r.row} (${r.value})`)
                                .join(", ")}. ` +
                            "Allowed IDs:\n" +
                            "1 - Bachelor of Science in Information Technology\n" +
                            "2 - Bachelor of Library and Information Science\n" +
                            "3 - Bachelor of Elementary Education\n" +
                            "4 - Bachelor of Science in Nursing\n" +
                            "5 - Bachelor of Science in Hospitality Management\n" +
                            "6 - Bachelor of Science in Business Administration\n" +
                            "7 - Bachelor of Science in Tourism Management",
                    }));

                // Final validation results
                const isValid =
                    hasExactOrder && hasRows && invalidPrograms.length === 0;

                if (!hasExactOrder) errCol();
                else if (!hasRows) errRowMin();
                else if (invalidPrograms.length > 0) errProgram();

                resolve([isValid, hasExactOrder, hasRows, invalidPrograms]);
            };

            reader.onerror = () => reject("Error reading file");
            reader.readAsText(file);
        });
    };


    return (
        <>
        <Reload
            transition={isReload()}
            type={reloadType}
            label={reloadLabel}
        />
        <ViewUploadGuidelinesModal
            close={guidelines} 
            closeModal={openGuidelines} 
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true}
            type={type} 
            program={props.program}
        />
        <CsvStudentPreviewModal
            close={csvPreview}
            closeModal={openCsvPreview}
            rows={csvPreviewRows}
            onCancel={cancelCsvPreview}
            onFinalize={finalizeStudentCsv}
        />
        <CsvStudentProgressModal
            close={csvProgress}
            closeModal={openCsvProgress}
            batchId={csvBatchId}
            total={csvBatchTotal}
            userId={props.user?.id}
            onDone={closeCsvProgress}
        />
        <NormalValidationModal
            close={userListCSV}
            closeModal={openUserListCSV} 
            pd={['px-5', 'py-7']}
            isEnableOuterClose={true} 
            icon='fa-user-plus'
            label={validationLabel}
            btn={[
                { 
                    label: 'Cancel', 
                    click: () => {
                        setCSVFile(null); 
                        openUserListCSV(false);
                    }, 
                    satisfied: false 
                },
                { 
                    label: 'Create Account', 
                    click: handleSubmit, 
                    satisfied: true 
                },
            ]}
        />
        <div className="w-full py-4 grid gap-4">
            <div className="w-full grid gap-5 relative">
                <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                    <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">USER REGISTRATION</h1>
                </div>
            </div>
            <div className="grid gap-5">
                <div className="flex shadow-gray-400 shadow-md rounded-md">
                    <div className="px-10 py-14 w-full bg-white">
                        <div className="flex gap-20 relative justify-center">
                            <div className="w-[25rem] h-full flex-shrink-0 object-cover absolute z-[0] opacity-20">
                                <img src={logo} alt="" />
                            </div>
                            <div className="z-[1] w-full">
                                <RegistrationForm
                                    baseData={originalData}
                                    selectionVal={[ sex, userType, props.program, yearLevel ]}
                                    validationErr={validationError}
                                    activate={activate}
                                    reload={loadRegister}
                                    setValidationError={setValidationError}
                                    handleFileChange={handleFileChange}
                                    setValidationLabel={setValidationLabel}
                                    setCSVColumn={setCSVColumn}
                                    handleToggle={handleToggle}
                                    openGuidelines={openGuidelines}
                                    setUserType={setUserType}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

Register.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default Register;
