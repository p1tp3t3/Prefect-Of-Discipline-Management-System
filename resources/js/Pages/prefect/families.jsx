import AuthLayout from "@/Layouts/auth-layout";
import { useState } from "react";
import FamilyList from "@/Components/list/family-list";
import EditFamilyModal from "@/Components/modal/submission-form/edit-family-modal";
import Btn from "@/Components/button/normal-btn";
import { APIRequest } from "@/others/classes/api-req";
import Reload from "@/Components/reload/reload";
import SearchUserBar from "@/Components/input/search-user-bar";

const Families = (props) => {
    const [openFamilyModal, setOpenFamilyModal] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState(null);

    const [reload, setReload] = useState(false);
    const [reloadType, setReloadType] = useState("");
    const [reloadLabel, setReloadLabel] = useState("");
    const [clickedOk, setClickOk] = useState(false);

    const [search, setSearch] = useState('');
    const [isSearchFocus, focusSearch] = useState(false);

    const openEditModal = (family) => {
        setSelectedFamily(family);
        setOpenFamilyModal(true);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };

    const isReload = () => {
        return reload ? "opacity-1 z-[100]" : "opacity-0 z-[-1]";
    };

    return (
        <>
            {/* LOADING / SUCCESS / ERROR SCREEN */}
            <Reload
                transition={isReload()}
                type={reloadType}
                label={reloadLabel}
                onClose={(e) => {
                    setReload(e);
                    if (clickedOk) window.location.reload();
                }}
            />

            {/* FAMILY EDIT MODAL */}
            <EditFamilyModal
                close={openFamilyModal}
                closeModal={setOpenFamilyModal}
                data={selectedFamily}      // ⬅ FIXED
                reload={loadRegister}
                pd={["px-5", "py-7"]}
                isEnableOuterClose={true}
            />

            {/* MAIN PAGE */}
                <div className="w-full py-10">
                    <div className="grid gap-10">
                        
                        <div className="w-full flex justify-between">
                            <h1 className="text-[1.3em] font-bold">Family List</h1>
                        </div>

                        {/* SEARCH BAR */}
                        <div>
                            <div className="w-[18rem] relative">
                                <SearchUserBar
                                    setSearch={setSearch}
                                    name="search"
                                    search={search}
                                    plc="Search Family"
                                    isFocus={isSearchFocus}
                                    focus={focusSearch}
                                    handleSearch={handleSearch}
                                    lim={5}
                                    def="Family Not Found"
                                    withLink={true}
                                    profile={false}
                                    label="family_name"
                                    link="/super-admin/family"
                                    param={true}
                                    apiLink="/api/all-users/family"
                                />
                            </div>
                        </div>

                        {/* FAMILY LIST */}
                        <div>
                            <FamilyList 
                                list={props.family_list} 
                                setId={openEditModal}    // ⬅ FIXED
                            />
                        </div>
                    </div>
                </div>
        </>
    );
};

Families.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default Families;
