"use client";

import { createContext, FormEvent, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { initialActivity, initialAdmins, initialCountries, initialProfile, initialSettings, initialTopupSystems } from "@/data/initial-data";
import { countryOptions } from "@/data/country-options";
import type { Activity, Admin, Country, Profile, TopupSystem, WorkspaceSettings } from "@/types/admin";

type WorkspaceContextValue = {
  admins: Admin[];
  topupSystems: TopupSystem[];
  countries: Country[];
  activity: Activity[];
  profile: Profile;
  settings: WorkspaceSettings;
  search: string;
  notice: string;
  modal: "admin" | "country" | null;
  countriesWithAdminCounts: Country[];
  setSearch: (value: string) => void;
  clearSearch: () => void;
  updateProfile: (profile: Profile) => void;
  updateSettings: (settings: WorkspaceSettings) => void;
  openModal: (modal: "admin" | "country" | null) => void;
  dismissNotice: () => void;
  flash: (message: string) => void;
  addAdmin: (event: FormEvent<HTMLFormElement>) => void;
  addTopupAdmin: (event: FormEvent<HTMLFormElement>) => void;
  addCountry: (event: FormEvent<HTMLFormElement>) => void;
  removeAdmins: (ids: number[]) => void;
  setAdminStatus: (admin: Admin, status: Admin["status"]) => void;
  resendInvite: (admin: Admin) => void;
  removeCountry: (country: Country) => void;
  toggleCountryStatus: (country: Country) => void;
  setTopupSystemStatus: (systemId: string, status: TopupSystem["status"]) => void;
  saveSettings: (profile: Profile, settings: WorkspaceSettings) => void;
  record: (action: string, target: string, category: Activity["category"]) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [topupSystems, setTopupSystems] = useState(initialTopupSystems);
  const [countries, setCountries] = useState(initialCountries);
  const [activity, setActivity] = useState(initialActivity);
  const [profile, setProfile] = useState(initialProfile);
  const [settings, setSettings] = useState(initialSettings);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"admin" | "country" | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const storedAdmins = localStorage.getItem("country-admin-list");
        const storedTopupSystems = localStorage.getItem("country-admin-topup-systems");
        const storedCountries = localStorage.getItem("country-admin-countries");
        const storedActivity = localStorage.getItem("country-admin-activity");
        const storedProfile = localStorage.getItem("country-admin-profile");
        const storedSettings = localStorage.getItem("country-admin-settings");
        if (storedAdmins) setAdmins(JSON.parse(storedAdmins));
        if (storedTopupSystems) {
          const savedSystems = (JSON.parse(storedTopupSystems) as Array<TopupSystem & { status: string }>).map((system) => ({ ...system, status: system.status === "Active" ? "Active" as const : "Inactive" as const }));
          const savedById = new Map(savedSystems.map((system) => [system.id, system]));
          const seededIds = new Set(initialTopupSystems.map((system) => system.id));
          const mergedSystems = [...initialTopupSystems.map((system) => savedById.get(system.id) ?? system), ...savedSystems.filter((system) => !seededIds.has(system.id))];
          setTopupSystems(mergedSystems);
          localStorage.setItem("country-admin-topup-systems", JSON.stringify(mergedSystems));
        }
        if (storedCountries) {
          const savedCountries = JSON.parse(storedCountries) as Array<Country & { status: string }>;
          const normalizedCountries = savedCountries.map((country) => ({ ...country, status: country.status === "Active" ? "Active" as const : "Inactive" as const }));
          setCountries(normalizedCountries);
          localStorage.setItem("country-admin-countries", JSON.stringify(normalizedCountries));
        }
        if (storedActivity) {
          const savedEvents = JSON.parse(storedActivity) as Activity[];
          const savedEventIds = new Set(savedEvents.map((item) => item.id));
          setActivity([...initialActivity.filter((item) => !savedEventIds.has(item.id)), ...savedEvents]);
        }
        if (storedProfile) setProfile(JSON.parse(storedProfile));
        if (storedSettings) setSettings(JSON.parse(storedSettings));
      } catch { /* Keep the starter data if saved browser data is unavailable. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }
  function record(action: string, target: string, category: Activity["category"]) {
    const next: Activity[] = [{ id: Date.now(), name: profile.name, initials: initialsFor(profile.name), color: "#8b6de8", action, target, time: "Just now", category }, ...activity];
    setActivity(next);
    localStorage.setItem("country-admin-activity", JSON.stringify(next));
  }
  function addAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const country = String(data.get("country"));
    const next: Admin[] = [{ id: Date.now(), name, email: String(data.get("email")).trim(), role: String(data.get("role")), country, status: "Pending", joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), initials: initialsFor(name), color: "#6f82d9" }, ...admins];
    saveAdmins(next);
    record("invited a new admin to", country, "Admin");
    setModal(null);
    flash(`${name} has been added and invited.`);
    event.currentTarget.reset();
  }
  function addTopupAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name")).trim();
    const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "topup-admin";
    const id = topupSystems.some((system) => system.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
    const contactName = String(data.get("contactName")).trim();
    const next: TopupSystem[] = [{
      id, name, country: String(data.get("country")), status: "Inactive", contactName,
      contactEmail: String(data.get("email")).trim(), contactPhone: String(data.get("phone")).trim(), contactDialCode: `+${String(data.get("dialCode")).trim()}`, created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      accent: "#7762c8",
    }, ...topupSystems];
    setTopupSystems(next);
    localStorage.setItem("country-admin-topup-systems", JSON.stringify(next));
    record("added a top-up admin", name, "Admin");
    flash(`${name} has been added as a top-up admin.`);
    event.currentTarget.reset();
  }
  function addCountry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = String(data.get("code")).trim().toUpperCase();
    const selectedCountry = countryOptions.find((country) => country.code === code);
    if (!selectedCountry) {
      flash("Choose a country from the list.");
      return;
    }
    if (countries.some(country => country.code.toLowerCase() === code.toLowerCase())) {
      flash(`A country with code ${code} already exists.`);
      return;
    }
    const next: Country[] = [{ id: Date.now(), name: selectedCountry.name, code: selectedCountry.code, region: selectedCountry.region, status: "Active", admins: 0, flag: "🌐" }, ...countries];
    saveCountries(next);
    record("added a country to", selectedCountry.name, "Country");
    setModal(null);
    flash(`${selectedCountry.name} has been added.`);
    event.currentTarget.reset();
  }
  function saveAdmins(next: Admin[]) {
    setAdmins(next);
    localStorage.setItem("country-admin-list", JSON.stringify(next));
  }
  function saveCountries(next: Country[]) {
    setCountries(next);
    localStorage.setItem("country-admin-countries", JSON.stringify(next));
  }
  function removeAdmins(ids: number[]) {
    if (!ids.length) return;
    saveAdmins(admins.filter(admin => !ids.includes(admin.id)));
    flash("Selected admins removed.");
  }
  function setAdminStatus(admin: Admin, status: Admin["status"]) {
    saveAdmins(admins.map(item => item.id === admin.id ? { ...item, status } : item));
    record(`changed admin status to ${status.toLowerCase()} for`, admin.name, "Admin");
    flash(`${admin.name} marked as ${status.toLowerCase()}.`);
  }
  function resendInvite(admin: Admin) {
    flash(`Invite resent to ${admin.email}.`);
  }
  function removeCountry(country: Country) {
    if (country.admins > 0) {
      flash(`${country.name} still has ${country.admins} assigned admins.`);
      return;
    }
    saveCountries(countries.filter(item => item.id !== country.id));
    record("removed a country from", country.name, "Country");
    flash(`${country.name} removed.`);
  }
  function toggleCountryStatus(country: Country) {
    const status = country.status === "Active" ? "Inactive" : "Active";
    saveCountries(countries.map(item => item.id === country.id ? { ...item, status } : item));
    record(`changed country status to ${status.toLowerCase()} for`, country.name, "Country");
    flash(`${country.name} status updated.`);
  }
  function setTopupSystemStatus(systemId: string, status: TopupSystem["status"]) {
    const system = topupSystems.find((item) => item.id === systemId);
    if (!system || system.status === status) return;
    const next = topupSystems.map((item) => item.id === systemId ? { ...item, status } : item);
    setTopupSystems(next);
    localStorage.setItem("country-admin-topup-systems", JSON.stringify(next));
    record(`changed admin status to ${status.toLowerCase()} for`, system.name, "Admin");
    flash(`${system.name} status changed to ${status.toLowerCase()}.`);
  }
  function saveSettings(nextProfile: Profile, nextSettings: WorkspaceSettings) {
    setProfile(nextProfile);
    setSettings(nextSettings);
    localStorage.setItem("country-admin-profile", JSON.stringify(nextProfile));
    localStorage.setItem("country-admin-settings", JSON.stringify(nextSettings));
    record("updated workspace preferences", "Settings", "Settings");
    flash("Your settings have been saved.");
  }

  const countriesWithAdminCounts = useMemo(() => countries.map(country => ({
    ...country,
    admins: country.admins + admins.filter(admin => admin.country === country.name).length - initialAdmins.filter(admin => admin.country === country.name).length,
  })), [admins, countries]);

  const value: WorkspaceContextValue = {
    admins, topupSystems, countries, activity, profile, settings, search, notice, modal, countriesWithAdminCounts,
    setSearch, clearSearch: () => setSearch(""), updateProfile: setProfile, updateSettings: setSettings, openModal: setModal, dismissNotice: () => setNotice(""), flash,
    addAdmin, addTopupAdmin, addCountry, removeAdmins, setAdminStatus, resendInvite, removeCountry, toggleCountryStatus, setTopupSystemStatus, saveSettings, record,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider.");
  return context;
}

function initialsFor(name: string) {
  return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
}
