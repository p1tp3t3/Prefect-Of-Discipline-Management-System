import UpModal from "../up-modal";
import FormButton from "@/Components/button/button";
import ProfilePic from "@/Components/other/profile-pic";
import CircleReload from "@/Components/reload/circle-reload";
import { useEffect, useState } from "react";
import { FamilyService } from "@/others/services/family-service";
import {
  showWarningModal,
  showOutputModal,
  getProfilePic,
  toTitleCase,
} from "@/others/function";
import ActionBtn from "@/Components/button/action-btn";
import { motion } from "framer-motion";

const EditFamilyModal = (props) => {
  const [members, setMembers] = useState([]);
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [swapMode, setSwapMode] = useState(null); // { memberIndex, targetFamilyId }
  const [targetFamilyMembers, setTargetFamilyMembers] = useState([]);
  const [selectedTargetMember, setSelectedTargetMember] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // JOIN SEARCH
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);

  // ---------------------------------------------------------
  // LOAD MEMBERS + FAMILY LIST WHEN MODAL OPENS
  // ---------------------------------------------------------
  useEffect(() => {
    if (!props.close) return;

    setIsLoading(true);

    if (props.data?.members) {
      setMembers([...props.data.members]);
    }

    FamilyService.getFamilyList((res) => {
      setAvailableFamilies(res || []);
      setTimeout(() => setIsLoading(false), 300);
    });
  }, [props.close]);

  // ---------------------------------------------------------
  // LOAD TARGET FAMILY MEMBERS (FOR SWAP)
  // ---------------------------------------------------------
  const loadTargetFamilyMembers = (familyId) => {
    FamilyService.getFamilyMembers(familyId, (res) => setTargetFamilyMembers(res || []));
  };

  // ---------------------------------------------------------
  // MOVE MEMBER
  // ---------------------------------------------------------
  const moveMember = (i, targetFamilyId) => {
    if (!targetFamilyId) return;

    showWarningModal(
      "Move this member to another family?",
      "Move Member",
      "Cancel",
      () => {
        props.reload(true, "text-wait", "Moving member...");
        FamilyService.familyAction(
          {
            type: 'move',
            user_id: members[i].user_id,
            to_family_id: targetFamilyId,
          },
          () => {
            props.reload(true, "");
            showOutputModal("Member moved successfully", "s", () => {
              props.reload(false);
              props.closeModal(false);
              window.location.reload()
            });
          },
          (e) => {
            showOutputModal(e.response.data.message, "e", () => {
              props.reload(false);
            });
          }
        );
      }
    );
  };

  // ---------------------------------------------------------
  // CONFIRM SWAP
  // ---------------------------------------------------------
  const confirmSwap = () => {
    if (!swapMode || !selectedTargetMember) return;

    props.reload(true, "text-wait", "Swapping members...");
    FamilyService.familyAction(
      {
        type: 'swap',
        memberA: members[swapMode.memberIndex].user_id,
        memberB: selectedTargetMember,
      },
      () => {
        props.reload(true, "");
        showOutputModal("Members swapped successfully", "s", () => {
          props.reload(false);
          props.closeModal(false);
          setSwapMode(null);
          setSelectedTargetMember(null);
          window.location.reload()
        });
      },
      (e) => {
        props.reload(true, "");
        showOutputModal(e.response.data.message, "e", () => {
            props.reload(false);
        });
      }
    );
  };

  // ---------------------------------------------------------
  // CANCEL SWAP
  // ---------------------------------------------------------
  const cancelSwap = () => {
    setSwapMode(null);
    setSelectedTargetMember(null);
    setTargetFamilyMembers([]);
  };

  // ---------------------------------------------------------
  // SEARCH EXISTING USER FOR JOIN (with debounce)
  // ---------------------------------------------------------
  const searchUser = (txt) => {
    setSearchText(txt);

    if (typingTimer) clearTimeout(typingTimer);

    if (txt.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const newTimer = setTimeout(() => {
      setIsSearching(true);

      FamilyService.searchFamilyStudent(txt, (res) => {
        setSearchResults(res || []);
        setIsSearching(false);
      });
    }, 500);

    setTypingTimer(newTimer);
  };

  // ---------------------------------------------------------
  // JOIN USER TO FAMILY
  // ---------------------------------------------------------
  const joinUser = (user) => {
    showWarningModal(
      "Add this user to the family?",
      "Join Family",
      "Cancel",
      () => {
        props.reload(true, "text-wait", "Adding member...");
        FamilyService.familyAction(
          {
            type: 'join',
            family_id: props.data.id,
            user_id: user.id,
          },
          () => {
            props.reload(true, "");
            showOutputModal("User successfully added!", "s", () => {
              props.reload(false);
              props.closeModal(false);
              window.location.reload()
            });
          },
          (e) => {
            props.reload(true, "");
            showOutputModal(e.response.data.message, "e", () => {
              props.reload(false);
            });
          }
        );
      }
    );
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <UpModal
      close={props.close}
      closeModal={props.closeModal}
      isEnableOuterClose={props.isEnableOuterClose}
      pd={props.pd}
      bgColor="bg-white"
      w="w-[32rem]"
    >
      <div className="w-full">
        {/* LOADER */}
        {isLoading && (
          <div className="w-full py-20 flex flex-col items-center justify-center">
            <CircleReload size={3} />
            <p className="text-gray-600 text-sm mt-3">Loading family...</p>
          </div>
        )}

        {!isLoading && (
          <>
            <h1 className="text-[1.2em] font-bold mb-4">
              Edit Family Code {props.data?.family_code}
            </h1>

            {/* JOIN EXISTING USER */}
            <div className="border rounded p-3 mb-4">
              <h3 className="font-semibold text-sm mb-2">Join Existing Student</h3>

              <input
                type="text"
                className="border p-2 rounded w-full text-sm"
                placeholder="Search student..."
                value={searchText}
                onChange={(e) => searchUser(e.target.value)}
              />

              {isSearching && <p className="text-xs mt-2">Searching...</p>}

              {!isSearching && searchResults.length > 0 && (
                <div className="mt-2 border rounded p-2 max-h-40 overflow-y-auto">
                  {searchResults.map((u, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b py-1 hover:bg-gray-100 px-1"
                    >
                      <div className="text-sm">
                        {u.profile?.first_name} {u.profile?.middle_name} {u.profile?.last_name}
                        <div className="text-xs text-gray-500">
                          ({toTitleCase(u.role)})
                        </div>
                      </div>

                      <button
                        className="text-blue-600 text-xs underline"
                        onClick={() => joinUser(u)}
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SWAP MODE */}
            {swapMode && (
              <div className="border rounded p-4 bg-gray-50 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Swap Member With</h3>

                  <button
                    className="text-red-500 text-xs underline"
                    onClick={cancelSwap}
                  >
                    Cancel Swap
                  </button>
                </div>

                <select
                  className="border p-2 rounded w-full mb-3 text-sm"
                  onChange={(e) => {
                    setSwapMode({ ...swapMode, targetFamilyId: e.target.value });
                    loadTargetFamilyMembers(e.target.value);
                  }}
                >
                  <option value="">Select Family</option>
                  {availableFamilies.map((f) => (
                    <option value={f.family_id}>{f.family_code}</option>
                  ))}
                </select>

                {targetFamilyMembers.length > 0 && (
                  <>
                    <p className="text-xs mb-2">Select member:</p>

                    {targetFamilyMembers.map((tm) => (
                      <div
                        key={tm.user_id}
                        className={`p-2 border rounded cursor-pointer mb-1 flex gap-2 ${
                          selectedTargetMember === tm.user_id
                            ? "bg-blue-100 border-blue-500"
                            : ""
                        }`}
                        onClick={() => setSelectedTargetMember(tm.user_id)}
                      >
                        <div>
                            <ProfilePic
                                size={2}
                                src={getProfilePic(tm.user.profile?.profile_picture, tm.user.profile?.sex)}
                            />
                        </div>
                        <div>
                            <div className="text-sm">
                                <b>{tm.user.profile?.first_name} {tm.user.profile?.last_name}</b>
                            </div>
                            <div className="text-xs">
                                {toTitleCase((tm.user.role == 'parent' ? tm.user.parent?.parent_role : tm.user.profile?.sex == 'm' ? 'son' : 'daughter'))}
                            </div>
                        </div>
                      </div>
                    ))}

                    <ActionBtn
                      className="bg-blue-700 hover:bg-blue-800"
                      onClick={confirmSwap}
                    >
                        Confirm Swap
                    </ActionBtn>
                  </>
                )}
              </div>
            )}

            {/* MEMBERS LIST */}
            <div className="grid gap-3">
              <h3 className="font-semibold">Family Members</h3>

              {members.map((m, i) => {
                const u = m.user;
                const isSelected = swapMode?.memberIndex === i;

                return (
                  <motion.div
                    key={i}
                    animate={{
                      backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                      borderColor: isSelected ? "#3b82f6" : "#d1d5db",
                      scale: isSelected ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`border rounded p-3 ${
                      isSelected ? "shadow-md" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ProfilePic
                        size={2}
                        src={getProfilePic(u?.profile?.profile_picture, u?.profile?.sex)}
                      />

                      <div>
                        <div className="font-semibold text-sm">
                          {u.profile?.first_name} {u.profile?.middle_name} {u.profile?.last_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          ({toTitleCase((u.role == 'parent' ? u.parent?.parent_role : u.profile?.sex == 'm' ? 'son' : 'daughter'))})
                        </div>
                      </div>
                    </div>

                    {/* SWAP */}
                    <button
                      type="button"
                      className={`text-xs underline mr-4 ${
                        isSelected ? "text-blue-700 font-semibold" : "text-blue-500"
                      }`}
                      onClick={() => setSwapMode({ memberIndex: i })}
                    >
                      {isSelected ? "Swapping..." : "Swap Member"}
                    </button>

                    {/* MOVE */}
                    <select
                      className="border p-1 text-xs rounded"
                      onChange={(e) => moveMember(i, e.target.value)}
                    >
                      <option value="">Move to family...</option>
                      {availableFamilies.map((f) => (
                        <option value={f.id}>{f.family_code}</option>
                      ))}
                    </select>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </UpModal>
  );
};

export default EditFamilyModal;
