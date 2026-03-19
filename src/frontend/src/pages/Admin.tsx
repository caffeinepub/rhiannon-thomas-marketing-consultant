import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActorWithConfig, loadConfig } from "../config";
import { useSiteContent } from "../hooks/useSiteContent";
import type {
  PortfolioItem,
  ResourceItem,
  SiteContent,
} from "../types/content";
import { StorageClient } from "../utils/StorageClient";

export default function Admin() {
  const [claimed, setClaimed] = useState<boolean | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const { content, updateContent } = useSiteContent();

  useEffect(() => {
    createActorWithConfig().then((actor) => {
      actor.isAdminClaimed().then((c) => setClaimed(c));
    });
  }, []);

  if (claimed === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black text-sm" style={{ opacity: 0.4 }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!claimed) {
    return (
      <ClaimScreen
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onClaim={async () => {
          if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
          }
          if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          try {
            const actor = await createActorWithConfig();
            const success = await actor.claimAdmin(password);
            if (success) {
              setClaimed(true);
              setLoggedIn(true);
              toast.success("Admin access claimed");
            } else {
              toast.error("Admin already claimed");
              setClaimed(true);
            }
          } catch {
            toast.error("Failed to claim admin");
          }
        }}
      />
    );
  }

  if (!loggedIn) {
    return (
      <LoginScreen
        loginInput={loginInput}
        setLoginInput={setLoginInput}
        loginError={loginError}
        onLogin={async () => {
          try {
            const actor = await createActorWithConfig();
            const ok = await actor.verifyPassword(loginInput);
            if (ok) {
              setLoggedIn(true);
              setLoginError("");
            } else {
              setLoginError("Incorrect password");
            }
          } catch {
            setLoginError("Login failed. Please try again.");
          }
        }}
      />
    );
  }

  return <Dashboard content={content} updateContent={updateContent} />;
}

function ClaimScreen({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onClaim,
}: {
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  onClaim: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1
          className="text-black mb-2"
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Claim admin
        </h1>
        <p className="text-black text-sm mb-10" style={{ opacity: 0.5 }}>
          Set a password to become the permanent admin of this site.
        </p>
        <FieldGroup label="Password">
          <Input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            data-ocid="admin.input"
          />
        </FieldGroup>
        <FieldGroup label="Confirm password">
          <Input
            className={inputClass}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            data-ocid="admin.input"
          />
        </FieldGroup>
        <button
          type="button"
          className="btn-black w-full"
          onClick={onClaim}
          data-ocid="admin.submit_button"
        >
          Claim access
        </button>
      </div>
    </div>
  );
}

function LoginScreen({
  loginInput,
  setLoginInput,
  loginError,
  onLogin,
}: {
  loginInput: string;
  setLoginInput: (v: string) => void;
  loginError: string;
  onLogin: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1
          className="text-black mb-2"
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Admin login
        </h1>
        <p className="text-black text-sm mb-10" style={{ opacity: 0.5 }}>
          Enter your admin password to continue.
        </p>
        <FieldGroup label="Password">
          <Input
            className={inputClass}
            type="password"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin()}
            data-ocid="admin.input"
          />
        </FieldGroup>
        {loginError && (
          <p
            className="text-black text-sm mb-6"
            style={{ opacity: 0.7 }}
            data-ocid="admin.error_state"
          >
            {loginError}
          </p>
        )}
        <button
          type="button"
          className="btn-black w-full"
          onClick={onLogin}
          data-ocid="admin.submit_button"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

function Dashboard({
  content,
  updateContent,
}: {
  content: SiteContent;
  updateContent: (c: SiteContent) => Promise<void>;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-black sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <span className="text-black text-sm font-medium">Admin</span>
          <a
            href="/"
            className="text-black text-xs"
            style={{ opacity: 0.5, textDecoration: "none" }}
          >
            ← Back to site
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <h1
          className="text-black mb-12"
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Edit content
        </h1>

        <Tabs defaultValue="hero">
          <TabsList className="bg-white border border-black rounded-none mb-10 flex flex-wrap h-auto gap-0 p-0">
            {[
              "hero",
              "sprint",
              "services",
              "resources",
              "substack",
              "portfolio",
              "contact",
            ].map((tab, i) => (
              <TabsTrigger
                key={tab}
                value={tab}
                data-ocid={`admin.tab.${i + 1}`}
                className="rounded-none border-r border-black last:border-r-0 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-black data-[state=active]:bg-black data-[state=active]:text-white"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="hero">
            <HeroTab content={content} updateContent={updateContent} />
          </TabsContent>
          <TabsContent value="sprint">
            <SprintTab content={content} updateContent={updateContent} />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab content={content} updateContent={updateContent} />
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesTab content={content} updateContent={updateContent} />
          </TabsContent>
          <TabsContent value="substack">
            <SubstackTab content={content} updateContent={updateContent} />
          </TabsContent>
          <TabsContent value="portfolio">
            <PortfolioTab content={content} updateContent={updateContent} />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTab content={content} updateContent={updateContent} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <Label
        className="text-xs font-semibold uppercase tracking-widest text-black mb-2 block"
        style={{ opacity: 0.5 }}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

const inputClass =
  "rounded-none border-black focus-visible:ring-0 focus-visible:border-black bg-white text-black";

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="btn-black mt-2"
      onClick={onClick}
      data-ocid="admin.save_button"
    >
      Save changes
    </button>
  );
}

function HeroTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.hero);
  return (
    <div>
      <FieldGroup label="Headline">
        <Input
          className={inputClass}
          value={local.headline}
          onChange={(e) => setLocal({ ...local, headline: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Subheadline">
        <Textarea
          className={inputClass}
          value={local.subheadline}
          onChange={(e) => setLocal({ ...local, subheadline: e.target.value })}
          rows={3}
        />
      </FieldGroup>
      <FieldGroup label="Primary CTA Text">
        <Input
          className={inputClass}
          value={local.ctaText}
          onChange={(e) => setLocal({ ...local, ctaText: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Primary CTA Link">
        <Input
          className={inputClass}
          value={local.ctaLink}
          onChange={(e) => setLocal({ ...local, ctaLink: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Secondary CTA Text">
        <Input
          className={inputClass}
          value={local.secondaryText}
          onChange={(e) =>
            setLocal({ ...local, secondaryText: e.target.value })
          }
        />
      </FieldGroup>
      <FieldGroup label="Secondary CTA Link">
        <Input
          className={inputClass}
          value={local.secondaryLink}
          onChange={(e) =>
            setLocal({ ...local, secondaryLink: e.target.value })
          }
        />
      </FieldGroup>
      <SaveButton
        onClick={() => {
          updateContent({ ...content, hero: local });
          toast.success("Hero saved");
        }}
      />
    </div>
  );
}

function SprintTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.sprint);
  return (
    <div>
      <FieldGroup label="Heading">
        <Input
          className={inputClass}
          value={local.heading}
          onChange={(e) => setLocal({ ...local, heading: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Description">
        <Textarea
          className={inputClass}
          value={local.description}
          onChange={(e) => setLocal({ ...local, description: e.target.value })}
          rows={4}
        />
      </FieldGroup>
      <FieldGroup label="Bullets (one per line)">
        <Textarea
          className={inputClass}
          value={local.bullets.join("\n")}
          onChange={(e) =>
            setLocal({ ...local, bullets: e.target.value.split("\n") })
          }
          rows={4}
        />
      </FieldGroup>
      <FieldGroup label="CTA Button Text">
        <Input
          className={inputClass}
          value={local.ctaText}
          onChange={(e) => setLocal({ ...local, ctaText: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="CTA Link">
        <Input
          className={inputClass}
          value={local.ctaLink}
          onChange={(e) => setLocal({ ...local, ctaLink: e.target.value })}
        />
      </FieldGroup>
      <SaveButton
        onClick={() => {
          updateContent({ ...content, sprint: local });
          toast.success("Sprint saved");
        }}
      />
    </div>
  );
}

function ServicesTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.services);
  return (
    <div>
      <FieldGroup label="Heading">
        <Input
          className={inputClass}
          value={local.heading}
          onChange={(e) => setLocal({ ...local, heading: e.target.value })}
        />
      </FieldGroup>
      {local.items.map((item, i) => (
        <div key={item.title} className="border border-black p-5 mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-black mb-4"
            style={{ opacity: 0.4 }}
          >
            Service {i + 1}
          </p>
          <FieldGroup label="Title">
            <Input
              className={inputClass}
              value={item.title}
              onChange={(e) => {
                const items = [...local.items];
                items[i] = { ...items[i], title: e.target.value };
                setLocal({ ...local, items });
              }}
            />
          </FieldGroup>
          <FieldGroup label="Description">
            <Textarea
              className={inputClass}
              value={item.description}
              onChange={(e) => {
                const items = [...local.items];
                items[i] = { ...items[i], description: e.target.value };
                setLocal({ ...local, items });
              }}
              rows={3}
            />
          </FieldGroup>
        </div>
      ))}
      <SaveButton
        onClick={() => {
          updateContent({ ...content, services: local });
          toast.success("Services saved");
        }}
      />
    </div>
  );
}

function ResourcesTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.resources);
  const [newItem, setNewItem] = useState<ResourceItem>({
    id: "",
    title: "",
    description: "",
    isPaid: false,
    url: "",
  });

  return (
    <div>
      <FieldGroup label="Heading">
        <Input
          className={inputClass}
          value={local.heading}
          onChange={(e) => setLocal({ ...local, heading: e.target.value })}
        />
      </FieldGroup>

      {local.items.length > 0 && (
        <div className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-black mb-4"
            style={{ opacity: 0.4 }}
          >
            Existing items
          </p>
          {local.items.map((item, i) => (
            <div
              key={item.id}
              data-ocid={`resources.item.${i + 1}`}
              className="border border-black p-5 mb-4"
            >
              <div className="flex items-start justify-between mb-4">
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-black"
                  style={{ opacity: 0.4 }}
                >
                  {item.title || `Item ${i + 1}`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const items = local.items.filter((_, idx) => idx !== i);
                    const updated = { ...local, items };
                    setLocal(updated);
                    updateContent({ ...content, resources: updated });
                    toast.success("Item removed");
                  }}
                  className="text-xs text-black border border-black px-3 py-1"
                  style={{ opacity: 0.6 }}
                  data-ocid={`resources.delete_button.${i + 1}`}
                >
                  Remove
                </button>
              </div>
              <FieldGroup label="Title">
                <Input
                  className={inputClass}
                  value={item.title}
                  onChange={(e) => {
                    const items = [...local.items];
                    items[i] = { ...items[i], title: e.target.value };
                    setLocal({ ...local, items });
                  }}
                />
              </FieldGroup>
              <FieldGroup label="Description">
                <Textarea
                  className={inputClass}
                  value={item.description}
                  onChange={(e) => {
                    const items = [...local.items];
                    items[i] = { ...items[i], description: e.target.value };
                    setLocal({ ...local, items });
                  }}
                  rows={2}
                />
              </FieldGroup>
              <FieldGroup label="URL">
                <Input
                  className={inputClass}
                  value={item.url}
                  onChange={(e) => {
                    const items = [...local.items];
                    items[i] = { ...items[i], url: e.target.value };
                    setLocal({ ...local, items });
                  }}
                />
              </FieldGroup>
              <div className="flex items-center gap-3 mt-2">
                <Switch
                  checked={item.isPaid}
                  onCheckedChange={(v) => {
                    const items = [...local.items];
                    items[i] = { ...items[i], isPaid: v };
                    setLocal({ ...local, items });
                  }}
                  data-ocid={`resources.switch.${i + 1}`}
                />
                <Label className="text-xs text-black" style={{ opacity: 0.6 }}>
                  Paid resource
                </Label>
              </div>
            </div>
          ))}
          <SaveButton
            onClick={() => {
              updateContent({ ...content, resources: local });
              toast.success("Resources saved");
            }}
          />
        </div>
      )}

      <div className="border border-black p-5">
        <p
          className="text-xs font-semibold uppercase tracking-widest text-black mb-6"
          style={{ opacity: 0.4 }}
        >
          Add new resource
        </p>
        <FieldGroup label="Title">
          <Input
            className={inputClass}
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            data-ocid="resources.input"
          />
        </FieldGroup>
        <FieldGroup label="Description">
          <Textarea
            className={inputClass}
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            rows={2}
            data-ocid="resources.textarea"
          />
        </FieldGroup>
        <FieldGroup label="URL">
          <Input
            className={inputClass}
            value={newItem.url}
            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
          />
        </FieldGroup>
        <div className="flex items-center gap-3 mb-6">
          <Switch
            checked={newItem.isPaid}
            onCheckedChange={(v) => setNewItem({ ...newItem, isPaid: v })}
            data-ocid="resources.switch"
          />
          <Label className="text-xs text-black" style={{ opacity: 0.6 }}>
            Paid resource
          </Label>
        </div>
        <button
          type="button"
          className="btn-black"
          data-ocid="resources.primary_button"
          onClick={() => {
            if (!newItem.title.trim()) {
              toast.error("Title is required");
              return;
            }
            const item: ResourceItem = {
              ...newItem,
              id: Date.now().toString(),
            };
            const updated = {
              ...local,
              items: [...local.items, item],
            };
            setLocal(updated);
            updateContent({ ...content, resources: updated });
            setNewItem({
              id: "",
              title: "",
              description: "",
              isPaid: false,
              url: "",
            });
            toast.success("Resource added");
          }}
        >
          Add resource
        </button>
      </div>
    </div>
  );
}

function SubstackTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.substack);
  return (
    <div>
      <FieldGroup label="Heading">
        <Input
          className={inputClass}
          value={local.heading}
          onChange={(e) => setLocal({ ...local, heading: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Copy">
        <Textarea
          className={inputClass}
          value={local.copy}
          onChange={(e) => setLocal({ ...local, copy: e.target.value })}
          rows={4}
        />
      </FieldGroup>
      <FieldGroup label="CTA Button Text">
        <Input
          className={inputClass}
          value={local.ctaText}
          onChange={(e) => setLocal({ ...local, ctaText: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Substack URL">
        <Input
          className={inputClass}
          value={local.ctaLink}
          onChange={(e) => setLocal({ ...local, ctaLink: e.target.value })}
          placeholder="https://yourname.substack.com"
        />
      </FieldGroup>
      <SaveButton
        onClick={() => {
          updateContent({ ...content, substack: local });
          toast.success("Substack saved");
        }}
      />
    </div>
  );
}

async function createStorageClient(): Promise<StorageClient> {
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }
  return new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
}

function PortfolioTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.portfolio);
  const [uploading, setUploading] = useState<"thumbnail" | "pdf" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const item: PortfolioItem = local.item ?? {
    title: "",
    description: "",
    thumbnailUrl: "",
    pdfUrl: "",
  };

  const setItem = (patch: Partial<PortfolioItem>) => {
    setLocal((prev) => ({
      ...prev,
      item: {
        ...(prev.item ?? {
          title: "",
          description: "",
          thumbnailUrl: "",
          pdfUrl: "",
        }),
        ...patch,
      },
    }));
  };

  const handleUpload = async (file: File, kind: "thumbnail" | "pdf") => {
    setUploading(kind);
    setUploadProgress(0);
    try {
      const client = await createStorageClient();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) =>
        setUploadProgress(pct),
      );
      const url = await client.getDirectURL(hash);
      if (kind === "thumbnail") {
        setItem({ thumbnailUrl: url });
      } else {
        setItem({ pdfUrl: url });
      }
      toast.success(`${kind === "thumbnail" ? "Thumbnail" : "PDF"} uploaded`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to upload ${kind}`);
    } finally {
      setUploading(null);
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <FieldGroup label="Section Heading">
        <Input
          className={inputClass}
          value={local.heading}
          onChange={(e) => setLocal({ ...local, heading: e.target.value })}
        />
      </FieldGroup>

      <div className="border border-black p-5 mb-6">
        <p
          className="text-xs font-semibold uppercase tracking-widest text-black mb-6"
          style={{ opacity: 0.4 }}
        >
          Portfolio item
        </p>

        <FieldGroup label="Title">
          <Input
            className={inputClass}
            value={item.title}
            onChange={(e) => setItem({ title: e.target.value })}
            data-ocid="portfolio.input"
          />
        </FieldGroup>

        <FieldGroup label="Description">
          <Textarea
            className={inputClass}
            value={item.description}
            onChange={(e) => setItem({ description: e.target.value })}
            rows={3}
            data-ocid="portfolio.textarea"
          />
        </FieldGroup>

        <FieldGroup label="Thumbnail Image">
          {item.thumbnailUrl && (
            <div className="mb-3">
              <img
                src={item.thumbnailUrl}
                alt="Thumbnail preview"
                style={{
                  width: "160px",
                  height: "110px",
                  objectFit: "cover",
                  border: "1px solid #000",
                  display: "block",
                  marginBottom: "8px",
                }}
              />
            </div>
          )}
          <label
            className="btn-black inline-block cursor-pointer"
            data-ocid="portfolio.upload_button"
          >
            {uploading === "thumbnail"
              ? `Uploading… ${uploadProgress}%`
              : item.thumbnailUrl
                ? "Replace thumbnail"
                : "Upload thumbnail"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading !== null}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f, "thumbnail");
              }}
            />
          </label>
        </FieldGroup>

        <FieldGroup label="PDF File">
          {item.pdfUrl && (
            <p
              className="text-xs text-black mb-3"
              style={{ opacity: 0.6, wordBreak: "break-all" }}
            >
              Current:{" "}
              <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                View PDF
              </a>
            </p>
          )}
          <label
            className="btn-black inline-block cursor-pointer"
            data-ocid="portfolio.upload_button"
          >
            {uploading === "pdf"
              ? `Uploading… ${uploadProgress}%`
              : item.pdfUrl
                ? "Replace PDF"
                : "Upload PDF"}
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              disabled={uploading !== null}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f, "pdf");
              }}
            />
          </label>
        </FieldGroup>
      </div>

      <SaveButton
        onClick={() => {
          const hasContent =
            item.title.trim() ||
            item.description.trim() ||
            item.thumbnailUrl ||
            item.pdfUrl;
          const portfolioItem = hasContent ? item : null;
          const updated = { ...local, item: portfolioItem };
          setLocal(updated);
          updateContent({ ...content, portfolio: updated });
          toast.success("Portfolio saved");
        }}
      />
    </div>
  );
}

function ContactTab({
  content,
  updateContent,
}: { content: SiteContent; updateContent: (c: SiteContent) => Promise<void> }) {
  const [local, setLocal] = useState(content.contact);
  return (
    <div>
      <FieldGroup label="Heading">
        <Input
          className={inputClass}
          value={local.heading}
          onChange={(e) => setLocal({ ...local, heading: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Email">
        <Input
          className={inputClass}
          value={local.email}
          onChange={(e) => setLocal({ ...local, email: e.target.value })}
          placeholder="hello@example.com"
        />
      </FieldGroup>
      <FieldGroup label="Tagline">
        <Input
          className={inputClass}
          value={local.tagline}
          onChange={(e) => setLocal({ ...local, tagline: e.target.value })}
        />
      </FieldGroup>
      {local.socials.map((social, i) => (
        <div key={social.platform} className="border border-black p-5 mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-black mb-4"
            style={{ opacity: 0.4 }}
          >
            Social {i + 1}
          </p>
          <FieldGroup label="Platform Name">
            <Input
              className={inputClass}
              value={social.platform}
              onChange={(e) => {
                const socials = [...local.socials];
                socials[i] = { ...socials[i], platform: e.target.value };
                setLocal({ ...local, socials });
              }}
            />
          </FieldGroup>
          <FieldGroup label="URL">
            <Input
              className={inputClass}
              value={social.url}
              onChange={(e) => {
                const socials = [...local.socials];
                socials[i] = { ...socials[i], url: e.target.value };
                setLocal({ ...local, socials });
              }}
            />
          </FieldGroup>
        </div>
      ))}
      <SaveButton
        onClick={() => {
          updateContent({ ...content, contact: local });
          toast.success("Contact saved");
        }}
      />
    </div>
  );
}
