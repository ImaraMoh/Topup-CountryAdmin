"use client";

import { FormEvent, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";

export default function SettingsPage() {
  const { profile, settings, updateProfile, updateSettings, saveSettings } = useWorkspace();
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSettings(profile, settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }
  return <div className="module-page settings-module">
    <PageHeading eyebrow="YOUR PREFERENCES" title="Settings" description="Manage your profile and workspace notifications."/>
    <form className="settings-layout" onSubmit={submit}>
      <section className="settings-card"><div className="settings-heading"><h2>Profile information</h2><p>Update the name and email used for your admin profile.</p></div><div className="profile-editor"><span className="avatar profile-avatar">{initialsFor(profile.name)}</span><div><strong>{profile.name}</strong><small>Super Admin</small></div></div><label htmlFor="profile-name">Full name</label><input id="profile-name" value={profile.name} onChange={event => updateProfile({ ...profile, name: event.target.value })} required/><label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" value={profile.email} onChange={event => updateProfile({ ...profile, email: event.target.value })} required/></section>
      <section className="settings-card"><div className="settings-heading"><h2>Notifications</h2><p>Choose which workspace updates you want to receive.</p></div><Toggle label="Admin invitations" description="Get updates when someone accepts or declines an invite." checked={settings.email} onChange={email => updateSettings({ ...settings, email })}/><Toggle label="Weekly workspace summary" description="Receive a weekly overview of countries and admin activity." checked={settings.weekly} onChange={weekly => updateSettings({ ...settings, weekly })}/><Toggle label="Security alerts" description="Get notified about sign-ins and security changes." checked={settings.security} onChange={security => updateSettings({ ...settings, security })}/><div className="settings-actions"><span>{saved ? "Saved successfully" : "Your preferences stay on this device."}</span><button className="primary-button" type="submit">Save changes</button></div></section>
    </form>
  </div>;
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="toggle-row"><span><strong>{label}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><i/></label>;
}

function initialsFor(name: string) { return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase(); }
