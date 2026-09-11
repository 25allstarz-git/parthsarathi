import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { CheckCircle2, Clock, FileUp, Gavel, Loader2, Scale, Shield, User, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Logo, SecureNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { completeRegistration } from "@/lib/account.functions";
import {
  myLawyerApplication,
  submitLawyerApplication,
} from "@/lib/verification.functions";
import { formatPhoneNumber, isValidPhoneNumber, maskPhoneNumber } from "@/lib/phone";
import { ROLE_HOME, type AppRole } from "@/lib/nyaysetu";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/register")({
  component: RegisterPage,
});

const ROLES: Array<{ role: AppRole; icon: typeof User; title: string; blurb: string; credential?: string }> =
  [
    { role: "citizen", icon: User, title: "Citizen", blurb: "File a matter, track it, and find an advocate." },
    {
      role: "lawyer",
      icon: Scale,
      title: "Advocate",
      blurb: "Take up matters, manage your cause list and research.",
    },
    {
      role: "judge",
      icon: Gavel,
      title: "Judicial Officer",
      blurb: "Review the docket, cause lists and case records.",
      credential: "Judicial service identifier",
    },
    {
      role: "law_enforcement",
      icon: Shield,
      title: "Law Enforcement",
      blurb: "Look up case status and hearing information.",
      credential: "Departmental service number",
    },
  ];

function RegisterPage() {
  const { data: me } = useMe();
  const [role, setRole] = useState<AppRole>("citizen");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Logo />
      <h1 className="mt-8 font-display text-3xl">Set up your ParthSarathi access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your role determines the records and actions available to you. Citizens authenticate securely with their
        Google account; advocates are approved by a ParthSarathi administrator.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {ROLES.map((item) => (
          <button
            key={item.role}
            type="button"
            onClick={() => setRole(item.role)}
            className={cn(
              "elevate rounded-lg border p-4 text-left",
              role === item.role ? "border-gold bg-gold/5" : "border-border bg-card",
            )}
          >
            <item.icon className="size-5 text-gold" strokeWidth={1.6} />
            <p className="mt-3 font-display text-lg">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.blurb}</p>
          </button>
        ))}
      </div>

      {role === "citizen" && <CitizenFlow defaultName={me?.profile?.full_name ?? ""} />}
      {role === "lawyer" && <AdvocateFlow defaultName={me?.profile?.full_name ?? ""} email={me?.email ?? ""} />}
      {(role === "judge" || role === "law_enforcement") && (
        <OfficialFlow
          role={role}
          defaultName={me?.profile?.full_name ?? ""}
          credentialLabel={ROLES.find((r) => r.role === role)?.credential ?? "Service identifier"}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ citizen */

function CitizenFlow({ defaultName }: { defaultName: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const [fullName, setFullName] = useState(defaultName || me?.profile?.full_name || "");
  const [phone, setPhone] = useState(me?.phone ?? me?.profile?.phone ?? "");
  const [city, setCity] = useState(me?.profile?.city ?? "");

  const register = useServerFn(completeRegistration);
  const checkUnique = useServerFn(checkPhoneUnique);

  const finish = useMutation({
    mutationFn: async () => {
      const formattedPhone = phone ? formatPhoneNumber(phone) : null;
      if (formattedPhone && formattedPhone !== me?.phone && formattedPhone !== me?.profile?.phone) {
        const { isAvailable } = await checkUnique({ data: formattedPhone });
        if (!isAvailable) {
          throw new Error("This mobile number is already linked to another ParthSarathi account. Each number can only be used once — if you believe this is a mistake, contact support.");
        }
      }
      return register({
        data: {
          fullName: fullName.trim(),
          role: "citizen",
          ...(me?.email ? { email: me.email } : {}),
          ...(formattedPhone ? { phone: formattedPhone } : {}),
          ...(city.trim() ? { city: city.trim() } : {}),
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: ROLE_HOME["citizen"], replace: true });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Card className="mt-6">
      <CardContent className="space-y-5 pt-6">
        <div>
          <h2 className="font-display text-xl">Citizen Registration</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please confirm your details to set up your citizen account.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={fullName}
              maxLength={120}
              placeholder="e.g. Ramesh Kumar"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City (Optional)</Label>
            <Input
              id="city"
              value={city}
              maxLength={80}
              placeholder="e.g. New Delhi"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Mobile Number (Optional)</Label>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground font-mono">
                +91
              </span>
              <Input
                id="phone"
                inputMode="tel"
                placeholder="98765 43210"
                maxLength={10}
                value={phone.replace(/^\+91/, "").replace(/\D/g, "")}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
          </div>
        </div>

        <SecureNotice>
          Your information is securely stored. An optional mobile number helps with case notifications.
        </SecureNotice>

        <Button
          className="w-full"
          disabled={finish.isPending || fullName.trim().length < 2}
          onClick={() => finish.mutate()}
        >
          {finish.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Continue to my dashboard
        </Button>
      </CardContent>
    </Card>
  );
}

/* ----------------------------------------------------------------- advocate */

function AdvocateFlow({ defaultName, email }: { defaultName: string; email: string }) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const fetchApplication = useServerFn(myLawyerApplication);
  const submit = useServerFn(submitLawyerApplication);

  const { data: application, isLoading } = useQuery({
    queryKey: ["lawyer-application"],
    queryFn: () => fetchApplication({}),
  });

  const [fullName, setFullName] = useState(defaultName);
  const [barNumber, setBarNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Attach your Bar Council enrolment certificate.");
      setUploading(true);
      try {
        const { data: session } = await supabase.auth.getUser();
        const uid = session.user?.id;
        if (!uid) throw new Error("Your session has expired. Please sign in again.");
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
        const path = `${uid}/bar-council-certificate.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("lawyer-credentials")
          .upload(path, file, { upsert: true, contentType: file.type });
        if (uploadError) throw new Error(uploadError.message);
        return submit({
          data: {
            fullName,
            barCouncilNumber: barNumber,
            documentPath: path,
            documentName: file.name,
            ...(email ? { email } : {}),
          },
        });
      } finally {
        setUploading(false);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lawyer-application"] });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Application submitted for review.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your application…
        </CardContent>
      </Card>
    );
  }

  if (application && application.status !== "rejected") {
    const approved = application.status === "verified";
    return (
      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2">
            {approved ? (
              <CheckCircle2 className="size-5 text-gold" />
            ) : (
              <Clock className="size-5 text-muted-foreground" />
            )}
            <h2 className="font-display text-xl">
              {approved ? "Your credentials are approved" : "Application under review"}
            </h2>
          </div>
          {approved ? (
            <>
              <p className="text-sm text-muted-foreground">
                Sign in from the advocate panel using the code below. Keep it confidential.
              </p>
              <p className="rounded-md border border-gold/50 bg-gold/5 p-4 font-mono text-lg">
                {me?.advocateCode ?? "—"}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              A ParthSarathi administrator is checking your Bar Council enrolment certificate. You'll be
              notified here and by email once your Advocate Code is issued.
            </p>
          )}
          <SecureNotice>
            Advocate Codes and enrolment numbers are never shown to citizens on the platform.
          </SecureNotice>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-5 pt-6">
        {application?.status === "rejected" && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
            <XCircle className="mt-0.5 size-4 text-destructive" />
            <span>
              Your previous application was not approved.
              {application.review_note ? ` ${application.review_note}` : ""} You may correct the details
              and submit again.
            </span>
          </div>
        )}

        <div>
          <h2 className="font-display text-xl">Bar Council verification</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit your enrolment number and a scan of your Bar Council enrolment certificate. An
            administrator reviews it before your Advocate Code is issued.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="adv-full-name">Full name (as enrolled)</Label>
            <Input
              id="adv-full-name"
              maxLength={120}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bar-number">Bar Council enrolment number</Label>
            <Input
              id="bar-number"
              maxLength={60}
              placeholder="D/1234/2016"
              value={barNumber}
              onChange={(e) => setBarNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Enrolment certificate</Label>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-md border border-dashed border-border p-4 text-left text-sm hover:border-gold"
          >
            <FileUp className="size-5 text-gold" strokeWidth={1.6} />
            <span className={file ? "" : "text-muted-foreground"}>
              {file ? file.name : "Attach a PDF or image (max 10 MB)"}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0] ?? null;
              if (picked && picked.size > 10 * 1024 * 1024) {
                toast.error("That file is larger than 10 MB.");
                return;
              }
              setFile(picked);
            }}
          />
        </div>

        <SecureNotice>
          Certificates are stored privately and are visible only to ParthSarathi administrators reviewing
          your application.
        </SecureNotice>

        <Button
          className="w-full"
          disabled={
            send.isPending || uploading || fullName.trim().length < 2 || barNumber.trim().length < 4 || !file
          }
          onClick={() => send.mutate()}
        >
          {(send.isPending || uploading) && <Loader2 className="mr-2 size-4 animate-spin" />} Submit for
          review
        </Button>
      </CardContent>
    </Card>
  );
}

/* ----------------------------------------------------------------- official */

function OfficialFlow({
  role,
  defaultName,
  credentialLabel,
}: {
  role: AppRole;
  defaultName: string;
  credentialLabel: string;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const [fullName, setFullName] = useState(defaultName);
  const [city, setCity] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const register = useServerFn(completeRegistration);

  const mutation = useMutation({
    mutationFn: () =>
      register({
        data: {
          fullName,
          role,
          ...(me?.email ? { email: me.email } : {}),
          ...(city ? { city } : {}),
          ...(credentialId ? { credentialId } : {}),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: ROLE_HOME[role], replace: true });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Card className="mt-6">
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="off-name">Full name</Label>
            <Input
              id="off-name"
              maxLength={120}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="off-city">City</Label>
            <Input id="off-city" maxLength={80} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="off-cred">{credentialLabel}</Label>
            <Input
              id="off-cred"
              maxLength={60}
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
            />
          </div>
        </div>

        <SecureNotice>
          Credentials are checked against the issuing authority before privileged records are released.
        </SecureNotice>

        <Button
          className="w-full"
          disabled={mutation.isPending || fullName.trim().length < 2}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Continue
        </Button>
      </CardContent>
    </Card>
  );
}
