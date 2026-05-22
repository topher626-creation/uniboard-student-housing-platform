import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const TrustBanner: React.FC = () => {
  return (
    <motion.section
      className="py-5 bg-light"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="fw-bold mb-4">Safety & Trust First</h2>
            <ul className="list-unstyled">
              <li className="mb-3">
                <CheckCircle className="text-success me-2" size={20} />
                <strong>Verified Providers</strong> - Every landlord is verified
              </li>
              <li className="mb-3">
                <CheckCircle className="text-success me-2" size={20} />
                <strong>Verified Listings</strong> - All properties are reviewed
              </li>
              <li className="mb-3">
                <CheckCircle className="text-success me-2" size={20} />
                <strong>Student Reviews</strong> - Real feedback from students
              </li>
              <li className="mb-3">
                <CheckCircle className="text-success me-2" size={20} />
                <strong>Secure Payments</strong> - Protected transactions
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <div className="bg-primary text-white p-5 rounded-3">
              <h4 className="mb-3">Why UniBoard?</h4>
              <p className="mb-3">
                We prioritize student safety and landlord trustworthiness. Every provider
                goes through a verification process before listing bedspaces.
              </p>
              <p>
                <strong>Trust is everything.</strong> That's why we've built UniBoard to be
                the safest platform for finding and listing student accommodation in Zambia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TrustBanner;
