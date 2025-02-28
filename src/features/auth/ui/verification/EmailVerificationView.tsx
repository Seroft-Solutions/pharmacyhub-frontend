"use client";

import { FC } from 'react';

interface EmailVerificationViewProps {
  token: string;
}

export const EmailVerificationView: FC<EmailVerificationViewProps> = ({ token }) => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
      <p>Verifying email with token: {token}</p>
    </div>
  );
};

export default EmailVerificationView;