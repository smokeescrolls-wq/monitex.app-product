import InstagramDialogContent from "@/features/services/instagram/instagram-dialog-content";
import WhatsappDialogContent from "@/features/services/whatsapp/whatsapp-dialog-content";
import FacebookDialogContent from "@/features/services/facebook/facebook-dialog-content";
import LocationDialogContent from "@/features/services/location/location-dialog-content";
import SmsDialogContent from "@/features/services/sms/sms-dialog-content";
import CameraDialogContent from "@/features/services/camera/camera-dialog-content";
import CallsDialogContent from "@/features/services/calls/calls-dialog-content";

export const serviceDialogModules = {
  instagram: InstagramDialogContent,
  whatsapp: WhatsappDialogContent,
  facebook: FacebookDialogContent,
  location: LocationDialogContent,
  sms: SmsDialogContent,
  calls: CallsDialogContent,
  camera: CameraDialogContent,
  others: PlaceholderDialogContent,
} as const;

export type ServiceKey = keyof typeof serviceDialogModules;

function PlaceholderDialogContent({ serviceKey }: { serviceKey: ServiceKey }) {
  return (
    <div className="p-6">
      <p className="text-sm font-semibold text-white/90">Em breve</p>
      <p className="mt-2 text-xs text-white/60">
        Service flow for <span className="text-white/80">{serviceKey}</span> has
        not been implemented yet.
      </p>
    </div>
  );
}
