import { useState } from "react";
import AuthLayout from "@/Layouts/auth-layout";
import RequestGatePassModal from "@/Components/modal/submission-form/request-gatepass-modal";
import { useReload } from "@/context-provider/reload-provider";
import { readableDate, readableTime, toTitleCase } from "@/others/function";
import { Head, Link } from "@inertiajs/react";
import Btn from "@/Components/button/normal-btn";

const GatePass = (props) => {
  const [requestGatePass, openRequestGatePass] = useState(false);

  const { loadRegister } = useReload();

  const gatepass = props.user_gatepass.gatepass[0];

  return (
    <>
      <Head title="Gate Pass" />
      <RequestGatePassModal
        close={requestGatePass}
        closeModal={openRequestGatePass}
        pd={["px-5", "py-7"]}
        isEnableOuterClose={true}
        user_id={props.user.id}
        reload={loadRegister}
      />
      <div className="w-full py-10">
        <div className="w-full grid gap-10 relative">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-[1.4em] font-bold">Gate Pass</h1>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              {gatepass === undefined && props.user.allow_gatepass && (
                <Btn onclick={() => openRequestGatePass(true)}>
                  Request Gate Pass
                </Btn>
              )}
              {props.user.user_type === "staff" &&
                props.user.staff.work_type === "guard" && (
                  <Link href="/gatepass-validation" className="text-blue-700">
                    <u>Open Gate Pass Verification</u>
                  </Link>
                )}
            </div>
          </div>

          {/* Card Section */}
          <div className="w-full">
            <div className="w-full px-5 py-3 bg-white rounded-md shadow-black/20 shadow-sm">
              <div className="flex justify-center">
                <div className="w-full max-w-[25rem] flex-shrink-0">
                  <div className="w-full h-auto min-h-[20rem] grid place-items-center relative bg-white p-3">
                    {gatepass ? (
                      gatepass.confirmed_at === null ? (
                        <div className="text-center grid gap-5 text-gray-700">
                          <i className="fa-solid fa-refresh text-yellow-600 text-[8em] sm:text-[10em]"></i>
                          <p className="text-[1.2em] sm:text-[1.4em] font-bold">
                            Your Gate Pass Is Now Pending
                          </p>
                          <p className="text-[1em] font-semibold">
                            Your Reason: {gatepass.reason}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center grid gap-5 text-gray-700">
                          <i className="fa-solid fa-circle-check text-green-600 text-[8em] sm:text-[10em]"></i>
                          <p className="text-[1.2em] sm:text-[1.4em] font-bold">
                            Gate Pass Has Been Approved
                          </p>
                          <p className="text-[1em] font-semibold">
                            Your Reason: {gatepass.reason}
                          </p>
                          <div>
                            <p className="text-[1em] font-semibold">
                              Permission to{" "}
                              {JSON.parse(gatepass.allow_to).length != 2
                              ?
                              JSON.parse(gatepass.allow_to)[0]
                              :
                              toTitleCase(JSON.parse(gatepass.allow_to)[0].replace('-', ' ') + ' and ' + JSON.parse(gatepass.allow_to)[1].replace('-', ' '))}
                              {" "}the Campus
                            </p>
                            <p className="text-[0.9em] text-gray-600">
                              Expires on{" "}
                              {`${readableDate(
                                gatepass.date_expiration
                              )} ${readableTime(gatepass.date_expiration)}`}
                            </p>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center grid gap-5 text-gray-400">
                        <i className="fa-solid fa-circle-exclamation text-[8em] sm:text-[10em]"></i>
                        <p className="text-[1.2em] sm:text-[1.4em] font-bold">
                          No Gate Pass Has Been Requested Yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

GatePass.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default GatePass;
