import EditProfileModal from "@/Components/modal/submission-form/edit-profile-modal"
import { change, getProfilePic, showOutputModal, showWarningModal, splitStr } from "@/others/function";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import Reload from "@/Components/reload/reload";
import { APIRequest } from "@/others/classes/api-req";
import AuthLayout from "@/Layouts/auth-layout";

const StudentEditProfileForm = (props) => {

    const address = (address, t) => {
        if (address != null) {
            switch (t) {
                case "place":
                    return (address[0] != 'place') ? address[0] : '';
                case "city":
                    return (address[1] != 'city') ? address[1] : '';
                case "province":
                    return (address[2] != 'province') ? address[2] : '';
                case "zipcode":
                    return (address[3] != 'zipcode') ? address[3] : '';
                default:
                    return address;
            }
        }
        return null;
    };

    const otherProfile = props.otherUserProfile.profile ?? {};
    const currentAddrss = splitStr(
                        otherProfile.current_address
                );

    const permanentAddrss = splitStr(
                        otherProfile.permanent_address
                );

    const uniqueAttByRole = {
        student: { program: props.otherUserProfile.program, enrollments: props.otherUserProfile.enrollments },
        teaching_staff: props.otherUserProfile.teaching_staff,
        parent: props.otherUserProfile.parent,
    };

    const profileData = {
        user_id: props.otherUserProfile.id,
        new_user_id: props.otherUserProfile.id,
        first_name: otherProfile.first_name,
        middle_name: otherProfile.middle_name,
        last_name: otherProfile.last_name,

        username: props.otherUserProfile.username,
        user_type: props.otherUserProfile.role,
        sex: otherProfile.sex,
        date_of_birth: otherProfile.date_of_birth,
        profile_picture: otherProfile.profile_picture,
        civil_status: otherProfile.civil_status,
        religion: otherProfile.religion,
        citizenship: otherProfile.citizenship,
        unique_att: uniqueAttByRole[props.otherUserProfile.role] ?? null,

        current_address: otherProfile.current_address,
        current_place: address(currentAddrss, "place"),
        current_city: address(currentAddrss, "city"),
        current_province: address(currentAddrss, "province"),
        current_zipcode: address(currentAddrss, "zipcode"),

        permanent_address: otherProfile.permanent_address,
        permanent_place: address(permanentAddrss, "place"),
        permanent_city: address(permanentAddrss, "city"),
        permanent_province: address(permanentAddrss, "province"),
        permanent_zipcode: address(permanentAddrss, "zipcode"),

        place_of_birth: otherProfile.place_of_birth,

        email: props.otherUserProfile.email,
        phone_number: otherProfile.contact_number,
        educationBackground: props.education_background,

        allow_complaint: props.otherUserProfile.permissions?.allow_complaint,
        allow_referral: props.otherUserProfile.permissions?.allow_referral,
        allow_absent_form: props.otherUserProfile.permissions?.allow_absent_form,
        allow_appointment: props.otherUserProfile.permissions?.allow_appointment,
        allow_gatepass: props.otherUserProfile.permissions?.allow_gatepass
    }

    const { data, setData, post, processing, errors } = useForm(profileData);
    
    const [reload, setReload] = useState(false),
          [reloadType, setReloadType] = useState(""),
          [reloadLabel, setReloadLabel] = useState(""),
          [clickedOk, setClickOk] = useState(false);

    const [updatedData, setUpdatedData] = useState({})

    const isReload = () => {
        return reload ? "opacity-1 z-50" : "opacity-0 z-[-1]";
    };
    const loadRegister = (r, t, l) => {
        setReload(r);
        setReloadType(t);
        setReloadLabel(l);
    };
    const handleChange = (e) => {
        change(e, setData);
    };
    const handleProfileChange = (e) => {
        setData((prev) => ({
            ...prev, profile_picture: e
        }))
    }
    const user = props.otherUserProfile,
          profilePic = getProfilePic(user.profile?.profile_picture, user.profile?.sex);

    const openAccessTokenModal = (data) => {
        updateProfile(data)
    }

    // Check if the logged-in user is editing someone else's profile
    const isEditingOtherUser = props.user.id != profileData.user_id;

    // Helper label for messages
    const nameLabel = isEditingOtherUser ? `${profileData.first_name} ${profileData.last_name}'s` : "Your";

    const updateProfile = (data) => {
        showWarningModal(
            `Are you sure you want to update ${nameLabel} profile information?`,
            "Update Profile",
            "Cancel",
            () => {
                loadRegister(
                    true,
                    "text-wait",
                    `${nameLabel} profile information is updating`
                );

                const api = new APIRequest(
                    `/profile/${profileData.username}/edit`, 
                    "post",
                    data,
                    () => {},
                    success,
                    error
                );

                api.sendPostData();
            }
        );
    };

    const success = () => {
        showOutputModal(
            `${nameLabel} profile updated successfully!`,
            "s",
            () => {
                loadRegister(false);
                window.location.href = `/profile/${profileData.username}`;
            }
        );
    };

    const error = () => {
        showOutputModal(
            `Failed to update ${nameLabel} profile. Please try again.`,
            "e",
            () => {
                loadRegister(false);
            }
        );
    };

    return (
        <>
        <Reload
            transition={isReload()}
            type={reloadType}
            label={reloadLabel}
        />
            <div className="py-5">
                <div className="bg-white py-5 px-10 shadow-md rounded-md">
                    <EditProfileModal.Body
                        user={props.user}
                        data={data}
                        profilePic={profilePic}
                        change={handleChange}
                        setData={setData}
                        username={user.username}
                        profileChange={handleProfileChange}
                        reload={loadRegister}
                        setUpdate={setUpdatedData}
                        openAccessTokenModal={openAccessTokenModal}
                        program={props.program}
                    />
                </div>
            </div>
        </>
    )
}

StudentEditProfileForm.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default StudentEditProfileForm