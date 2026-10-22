"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Icon, { IconName } from "@/components/shared/Icon";
import { saveBrandLogo, useBrandLogo } from "@/components/shared/brand-logo";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const { profile, settings, updateProfile, updateSettings, saveSettings } = useWorkspace();
  const uploadedLogo = useBrandLogo();
  const fileInput = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [logoMessage, setLogoMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSettings(profile, settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  async function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoMessage("");
    if (!file.type.startsWith("image/")) {
      setLogoMessage("Choose an image file to use as your brand logo.");
      event.target.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setLogoMessage("Choose an image smaller than 8 MB.");
      event.target.value = "";
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      saveBrandLogo(canvas.toDataURL("image/png"));
      setLogoMessage("Brand logo updated across Country Admin.");
    } catch {
      setLogoMessage("This image could not be saved. Try another image.");
    }
    event.target.value = "";
  }

  function removeLogo() {
    saveBrandLogo(null);
    setLogoMessage("Default Country Admin mark restored.");
  }

  return <div className={`module-page settings-module ${styles.page}`}>
    <PageHeading eyebrow="PREFERENCES" title="Settings" description="Profile and notifications." />
    <form className={styles.layout} onSubmit={submit}>
      <section className={styles.profileCard} aria-labelledby="profile-title">
        <div className={styles.adminDetailsHeading}><span className={styles.sectionIcon}><Icon name="user" size={19}/></span><div><h2 id="profile-title">Profile information</h2></div></div>
        <div className={styles.brandPanel}>
          <div className={styles.brandPreview} aria-label="Country Admin logo preview">{uploadedLogo ? <Image src={uploadedLogo} alt="Country Admin logo" width={46} height={46} unoptimized/> : <span>C</span>}</div>
          <div className={styles.brandActions}><strong>Country Admin</strong><span>Workspace logo</span></div>
          <div className={styles.uploadActions}>
            <input ref={fileInput} className={styles.fileInput} type="file" accept="image/*" aria-label="Upload Country Admin logo" onChange={uploadLogo}/>
            <button className={styles.uploadButton} type="button" onClick={() => fileInput.current?.click()}><Icon name={uploadedLogo ? "sparkles" : "plus"} size={16}/>{uploadedLogo ? "Edit logo" : "Upload logo"}</button>
            {uploadedLogo && <button className={styles.removeButton} type="button" onClick={removeLogo} aria-label="Remove uploaded logo">Remove</button>}
          </div>
          {logoMessage && <span className={styles.logoMessage} role="status">{logoMessage}</span>}
        </div>
        <div className={styles.adminDetailsHeading}><span className={styles.sectionIcon}><Icon name="user" size={19}/></span><div><h2>Admin details</h2></div></div>
        <div className={styles.fields}>
          <label className={styles.field}><span>Full name</span><div className={styles.fieldControl}><Icon name="user" size={17}/><input value={profile.name} onChange={event => updateProfile({ ...profile, name: event.target.value })} placeholder="Your full name" autoComplete="name" required/></div></label>
          <label className={styles.field}><span>Email address</span><div className={styles.fieldControl}><Icon name="mail" size={17}/><input type="email" value={profile.email} onChange={event => updateProfile({ ...profile, email: event.target.value })} placeholder="name@company.com" autoComplete="email" required/></div></label>
        </div>
      </section>

      <section className={styles.notificationsCard} aria-labelledby="notifications-title">
        <div className={styles.cardTitle}><span className={`${styles.sectionIcon} ${styles.notificationIcon}`}><Icon name="bell" size={20}/></span><div><h2 id="notifications-title">Notifications</h2><p>Choose which updates to receive.</p></div></div>
        <div className={styles.notificationList}>
          <Toggle icon="mail" label="Admin invitations" description="Invitation status updates." checked={settings.email} onChange={email => updateSettings({ ...settings, email })}/>
          <Toggle icon="chart" label="Weekly summary" description="Country and admin activity." checked={settings.weekly} onChange={weekly => updateSettings({ ...settings, weekly })}/>
          <Toggle icon="shield" label="Security alerts" description="Sign-ins and account changes." checked={settings.security} onChange={security => updateSettings({ ...settings, security })}/>
        </div>
        <div className={styles.actions}><span className={styles.saveStatus} role="status">{saved && <><span className={styles.savedDot}/>Saved</>}</span><button className={styles.saveButton} type="submit">{saved ? <><Icon name="check" size={17}/> Saved</> : <>Save changes<Icon name="arrow-right" size={17}/></>}</button></div>
      </section>
    </form>
  </div>;
}

function Toggle({ icon, label, description, checked, onChange }: { icon: IconName; label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className={styles.preferenceRow}>
    <span className={styles.preferenceIcon}><Icon name={icon} size={18}/></span>
    <span className={styles.preferenceCopy}><strong>{label}</strong><small>{description}</small></span>
    <span className={styles.toggleControl}><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} aria-label={label}/><i/></span>
  </label>;
}

