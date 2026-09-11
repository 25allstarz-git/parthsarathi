import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell, LogOut, Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { listNotifications, markNotificationsRead } from "@/lib/cases.functions";
import { ROLE_LABEL, initials, relativeTime } from "@/lib/nyaysetu";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/use-me";
import { FloatingAssistant } from "@/components/floating-assistant";

export interface NavItem {
  label: string;
  to: string;
}

export function AppShell({ nav, children }: { nav: NavItem[]; children: ReactNode }) {
  const { data: me } = useMe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const fetchNotifications = useServerFn(listNotifications);
  const markRead = useServerFn(markNotificationsRead);
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
    refetchInterval: 60_000,
  });
  const unread = notifications.filter((n) => !n.is_read).length;

  const readMutation = useMutation({
    mutationFn: () => markRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const navLinks = (
    <>
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            pathname === item.to
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo />
              <nav className="mt-8 flex flex-col gap-1">{navLinks}</nav>
            </SheetContent>
          </Sheet>

          <Link to="/">
            <Logo />
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">{navLinks}</nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Popover
              onOpenChange={(open) => {
                if (open && unread > 0) readMutation.mutate();
              }}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="size-5" strokeWidth={1.7} />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-gold font-mono text-[9px] text-gold-foreground">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-88 p-0">
                <div className="border-b border-border px-4 py-3">
                  <p className="font-display text-sm">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No notifications yet.
                    </p>
                  )}
                  {notifications.map((n) => (
                    <div key={n.id} className="border-b border-border/60 px-4 py-3 last:border-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {relativeTime(n.created_at)}
                        </span>
                      </div>
                      {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pr-2 pl-2">
                  <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-[11px] text-ink-foreground">
                    {initials(me?.profile?.full_name ?? "PS")}
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-xs font-medium">
                      {me?.profile?.full_name ?? "Account"}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground uppercase">
                      {me?.role ? ROLE_LABEL[me.role] : "—"}
                    </span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <span className="block text-sm">{me?.profile?.full_name}</span>
                  <span className="block text-xs text-muted-foreground">{me?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:px-6">
          <p>ParthSarathi — digital access to the Indian justice system.</p>
          <p>Records are access-controlled and audited. AI outputs are assistive, not adjudicatory.</p>
        </div>
      </footer>
      {me?.role === "citizen" && <FloatingAssistant />}
    </div>
  );
}
