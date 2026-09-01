import AuthLayout from "@/Layouts/auth-layout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";

const GuidanceDashboard = (props) => {
  return (
    <>
      <Head title="Dashboard" />
        <motion.div
          className="w-full py-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-gray-500">No dashboard has been configured for this role yet.</p>
        </motion.div>
    </>
  );
};

GuidanceDashboard.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default GuidanceDashboard;
