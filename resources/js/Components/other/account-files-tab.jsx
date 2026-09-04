import { useState } from "react";
import { AccountService } from "@/others/services/account-service";
import UserAccountFileList from "@/Components/list/user-account-file-list";

/**
 * Lists the generated default-account CSV/ZIP files (id + default password
 * per user). Scoped server-side: super_admin/sub_admin see every file,
 * program heads see only their own program's student/faculty files.
 *
 * `files` comes down as an Inertia prop from the page itself (same as the
 * Users tab's account list) — this component never fetches the listing on
 * its own.
 */
const AccountFilesTab = ({ files = [], canDelete = false }) => {
    const [data, setData] = useState(files);

    const deleteFile = (f) => {
        AccountService.deleteAccountFile(f, setData);
    };

    return <UserAccountFileList list={data} deleteFile={canDelete ? deleteFile : undefined} />;
};

export default AccountFilesTab;
