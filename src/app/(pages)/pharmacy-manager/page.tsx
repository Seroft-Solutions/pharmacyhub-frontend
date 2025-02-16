"use client";
import PharmacyManagerList from "@/features/roles/components/PharmacyManagerList";
import { pharmacyManagerService } from "@/services/pharmacy-manager";
import { useAuthStore } from "@/store/authStore";

export default function PharmacyManager() {
  const { user } = useAuthStore();

  return (
    <>
      <h1>Manager Page</h1>
      {user && <PharmacyManagerList userId={user.id} pharmacyManagerService={pharmacyManagerService} />}
    </>
  )
}