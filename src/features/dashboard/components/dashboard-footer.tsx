"use client";

import { LegalDialog } from "@/features/legal/legal-dialog";

export function DashboardFooter() {
  return (
    <div className="grid gap-8 px-6 py-8 sm:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-white/85">Services</p>
        <ul className="mt-3 space-y-2 text-xs text-white/55">
          <li>• Instagram Analytics</li>
          <li>• WhatsApp Analytics</li>
          <li>• Facebook Analytics</li>
          <li>• Location</li>
          <li>• Remote Camera</li>
          <li>• Private Investigator</li>
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-white/85">Information</p>
        <ul className="mt-3 space-y-2 text-xs text-white/55">
          <li>• Help Center</li>
          <li className="flex items-center gap-2">
            • <LegalDialog kind="terms" triggerLabel="Terms of Use" />
          </li>
          <li className="flex items-center gap-2">
            •{" "}
            <LegalDialog
              kind="privacy"
              triggerLabel="Privacy and Cookies Policy"
            />
          </li>
          <li>• LGPD</li>
        </ul>
      </div>
    </div>
  );
}
